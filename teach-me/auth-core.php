<?php
/**
 * Shared-cookie / Firebase verification. PHP 8.2+, cURL, OpenSSL, sessions.
 * Imported contract, adapted and verified by work/build.py.
 * No service-account key, password, or saved user token belongs in this file.
 * Internal library; the course gate and Teach Me API own HTTP responses.
 */
declare(strict_types=1);
require_once dirname(__DIR__).'/human-biology-config.php';
hb_bootstrap_config();


// Only small topic metadata is read. Rosters and lesson contents are never fetched here.
function olv_topic_time($value): ?int {
 if(is_int($value)||is_float($value)||(is_string($value)&&ctype_digit($value))){$n=(float)$value;if($n>100000000000)$n/=1000;if($n>=946684800&&$n<=time()+86400)return (int)$n;}
 if(is_string($value)&&preg_match('/^\d{4}-\d{2}-\d{2}/',$value)){$n=strtotime($value);if($n!==false&&$n>=946684800&&$n<=time()+86400)return$n;}
 return null;
}
function olv_topic_cache_file(): ?string { return hb_config()['private_dir'].'/course-topics.json'; }

function olv_course_topics(callable $db,?callable $batch=null,?string $cacheFile=null,int $now=0): array {
 $now=$now?:time();$saved=[];
 if($cacheFile&&is_file($cacheFile)&&filesize($cacheFile)<2097152){$saved=json_decode((string)file_get_contents($cacheFile),true)?:[];if(($saved['version']??0)===2&&($saved['checkedAt']??0)>$now-60)return $saved['topics'];}
 $batch=$batch??static function(array $requests)use($db){$r=[];foreach($requests as$key=>$request)$r[$key]=$db($request['path'],$request['shallow']??false);return$r;};
 $keys=$db('topics',true);if(!is_array($keys)||count($keys)>5000)throw new OlvDiagnosticStop('The Firebase topic directory is unavailable.');
 $full=($saved['version']??0)!==2||($saved['fullScanAt']??0)<$now-3600;$courses=array_intersect_key($saved['courseMap']??[],$keys);$requests=[];foreach(array_keys($keys)as$key){$key=(string)$key;if($full||!array_key_exists($key,$courses)||(string)($courses[$key]['id']??'')===(string)OLV_COURSE_ID)$requests[$key]=['path'=>'topics/'.olv_path_key($key).'/course'];}
 foreach($batch($requests)as$key=>$course)$courses[$key]=$course;$math=[];$requests=[];
 foreach($courses as$key=>$course){if(!is_array($course)||(string)($course['id']??'')!==(string)OLV_COURSE_ID)continue;$math[$key]=$course;$requests[$key.'|archived']=['path'=>'topics/'.olv_path_key($key).'/archived'];$requests[$key.'|fields']=['path'=>'topics/'.olv_path_key($key),'shallow'=>true];}
 if(!$math)throw new OlvDiagnosticStop('No Firebase topics map to the Human Biology course.');
 $metadata=$batch($requests);$requests=[];$dateFields=[];$aliases=['createdat','datecreated','creationdate','created','addedat','dateadded'];
 foreach($math as$key=>$course){$fields=$metadata[$key.'|fields'];if(!is_array($fields))throw new OlvDiagnosticStop('Topic metadata could not be verified.');foreach(array_keys($fields)as$field){$normalized=strtolower(str_replace(['_','-'],'',(string)$field));if(in_array($normalized,$aliases,true)){$dateFields[$key]=$field;$requests[$key]=['path'=>'topics/'.olv_path_key($key).'/'.olv_path_key($field)];break;}}}
 $dates=$requests?$batch($requests):[];$firstSeen=$saved['firstSeen']??[];$result=[];
 foreach($math as$key=>$course){$archived=$metadata[$key.'|archived'];if(!in_array($archived,[null,false,true],true))throw new OlvDiagnosticStop('A Human Biology topic has an invalid archive status.');$firstSeen[$key]=$firstSeen[$key]??$now;$created=olv_topic_time($dates[$key]??null);$result[$key]=['key'=>$key,'course'=>['id'=>OLV_COURSE_ID,'name'=>(string)($course['name']??'Human Biology')],'archived'=>$archived===true,'createdAt'=>$created,'firstSeenAt'=>$firstSeen[$key],'sortTime'=>$created??$firstSeen[$key]];}
 uasort($result,static function($a,$b){return ($b['sortTime']<=>$a['sortTime'])?:strnatcasecmp($a['key'],$b['key']);});
 if($cacheFile){$payload=json_encode(['version'=>2,'checkedAt'=>$now,'fullScanAt'=>$full?$now:($saved['fullScanAt']??$now),'courseMap'=>$courses,'firstSeen'=>$firstSeen,'topics'=>$result]);$tmp=$cacheFile.'.'.bin2hex(random_bytes(5));if(file_put_contents($tmp,$payload,LOCK_EX)!==false){chmod($tmp,0600);rename($tmp,$cacheFile);}}
 return$result;
}
// Twenty-four concurrent requests bound discovery latency without downloading topic contents.
function olv_topic_batch_http(array $requests,string $token,float $deadline): array {
 $result=[];
 foreach(array_chunk($requests,24,true)as$chunk){
  $multi=curl_multi_init();$handles=[];$bodies=[];$limited=[];
  foreach($chunk as$key=>$request){$remaining=(int)(($deadline-microtime(true))*1000);if($remaining<1)throw new OlvDiagnosticStop('Topic discovery timed out. Please refresh.');
   $url=OLV_DB.'/'.$request['path'].'.json?auth='.rawurlencode($token).(!empty($request['shallow'])?'&shallow=true':'');$ch=curl_init($url);$bodies[$key]='';$limited[$key]=false;
   curl_setopt_array($ch,[CURLOPT_FOLLOWLOCATION=>false,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_CONNECTTIMEOUT_MS=>min(5000,$remaining),CURLOPT_TIMEOUT_MS=>min(12000,$remaining),CURLOPT_HTTPHEADER=>['Accept: application/json'],CURLOPT_WRITEFUNCTION=>static function($ch,$data)use(&$bodies,&$limited,$key){if(strlen($bodies[$key])+strlen($data)>65536){$limited[$key]=true;return 0;}$bodies[$key].=$data;return strlen($data);}]);curl_multi_add_handle($multi,$ch);$handles[$key]=$ch;
  }
  do{$status=curl_multi_exec($multi,$active);if($active)curl_multi_select($multi,.25);}while($active&&$status===CURLM_OK);
  $failed=false;foreach($handles as$key=>$ch){$code=curl_getinfo($ch,CURLINFO_RESPONSE_CODE);if($code!==200||curl_errno($ch)||$limited[$key])$failed=true;else$result[$key]=json_decode($bodies[$key],true);curl_multi_remove_handle($multi,$ch);}unset($handles,$multi);
  if($failed)throw new OlvDiagnosticStop('Firebase topic metadata could not be verified. Please refresh.');
 }
 return$result;
}


define('OLV_PROJECT', hb_config()['firebase_project']);
// Public Firebase Web configuration, already distributed by the login app.
define('OLV_WEB_API_KEY', hb_config()['firebase_web_key']);
define('OLV_DB', hb_config()['firebase_database']);
define('OLV_EXCHANGE', hb_config()['auth_exchange']);
define('OLV_EPOCH', hb_config()['auth_epoch']);
define('OLV_CERTS', hb_config()['auth_certificates']);
define('OLV_RETURN_URL', hb_config()['return_url']);
define('OLV_COURSE_ID', hb_config()['course_id']);
final class OlvDiagnosticStop extends RuntimeException {}

function olv_text($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function olv_profile(string $raw, string $cookieName): array
{
    if ($raw === '') {
        throw new OlvDiagnosticStop('No selected login cookie was received. Open this page in your logged-in browser.');
    }
    if (strlen($raw) > 8192 || !in_array($cookieName, ['teacher', 'student'], true)) {
        throw new OlvDiagnosticStop('The selected cookie is not a supported login profile.');
    }
    // PHP normally URL-decodes cookies already. Accept an encoded JSON value too.
    $value = json_decode($raw, true);
    if (!is_array($value) && preg_match('/^%7[bB]/', $raw)) {
        $value = json_decode(rawurldecode($raw), true);
    }
    if (!is_array($value) || !isset($value['role'], $value['id'], $value['sessionProof'], $value['sessionEpoch'])) {
        throw new OlvDiagnosticStop('The cookie is missing the required session fields.');
    }
    $roles = $cookieName === 'student' ? ['student'] : ['teacher', 'admin'];
    if (!in_array($value['role'], $roles, true)
        || !(is_int($value['id']) || (is_string($value['id']) && ctype_digit($value['id'])))
        || (int)$value['id'] < 1
        || !is_string($value['sessionProof']) || !preg_match('/^[a-f0-9]{64}$/iD', $value['sessionProof'])
        || !is_int($value['sessionEpoch']) || $value['sessionEpoch'] < 1) {
        throw new OlvDiagnosticStop('The cookie has an invalid role, identity, or session format.');
    }
    $body = [
        'role' => $value['role'], 'id' => (int)$value['id'],
        'sessionProof' => $value['sessionProof'], 'sessionEpoch' => $value['sessionEpoch'],
    ];
    foreach (['username', 'displayName', 'email'] as $key) {
        $item = $value[$key] ?? '';
        if (!is_string($item) || strlen($item) > 320) {
            throw new OlvDiagnosticStop('The cookie contains an invalid profile field.');
        }
        $body[$key] = $item;
    }
    return $body;
}

function olv_http(string $url, ?array $body, float $deadline): array
{
    $host = parse_url($url, PHP_URL_HOST);
    $allowed = ['live.olevels.com', 'identitytoolkit.googleapis.com', 'www.googleapis.com',
        'olevels-live-default-rtdb.firebaseio.com'];
    if (parse_url($url, PHP_URL_SCHEME) !== 'https' || !in_array($host, $allowed, true)) {
        throw new OlvDiagnosticStop('The diagnostic refused an unexpected service address.');
    }
    $remaining = (int)floor(($deadline - microtime(true)) * 1000);
    if ($remaining < 1) {
        throw new OlvDiagnosticStop('The test reached its time limit. Try again after checking the hosting connection.');
    }
    $handle = curl_init($url);
    $response = '';
    curl_setopt_array($handle, [
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_CONNECTTIMEOUT_MS => min(5000, $remaining),
        CURLOPT_TIMEOUT_MS => min(12000, $remaining),
        CURLOPT_USERAGENT => 'Olevels-Auth-Diagnostic/1.0',
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'Content-Type: application/json'],
        CURLOPT_WRITEFUNCTION => static function ($ch, string $chunk) use (&$response): int {
            if (strlen($response) + strlen($chunk) > 262144) {
                return 0;
            }
            $response .= $chunk;
            return strlen($chunk);
        },
    ]);
    if ($body !== null) {
        curl_setopt($handle, CURLOPT_POST, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES));
    }
    $ok = curl_exec($handle);
    $status = (int)curl_getinfo($handle, CURLINFO_HTTP_CODE);
    $errno = curl_errno($handle);
    // Do not return cURL error text, request URLs, headers, or raw response bodies.
    unset($handle);
    return [
        'status' => $status, 'data' => json_decode($response, true),
        'transportError' => $ok === false ? $errno : 0,
    ];
}

function olv_response(array $response)
{
    if (!empty($response['transportError'])) {
        throw new OlvDiagnosticStop('The server could not complete the HTTPS request (network, certificate, or time-limit failure).');
    }
    $status = (int)($response['status'] ?? 0);
    $data = $response['data'] ?? null;
    if ($status < 200 || $status >= 300) {
        $cloudflare = is_array($data) && (
            strpos((string)($data['title'] ?? ''), 'Error 1010') !== false
            || (string)($data['error_code'] ?? '') === '1010'
        );
        if ($cloudflare) {
            throw new OlvDiagnosticStop('Cloudflare blocked this server (HTTP 403, Error 1010). The cookie has not been validated.');
        }
        if ($status === 401 || $status === 403) {
            throw new OlvDiagnosticStop('The service rejected this request (HTTP ' . $status . '). Authentication or database permission could not be confirmed.');
        }
        throw new OlvDiagnosticStop('The service returned HTTP ' . $status . '. This step could not be verified.');
    }
    return $data;
}

function olv_b64(string $value): string
{
    if ($value === '' || !preg_match('/^[A-Za-z0-9_-]+$/D', $value)) {
        throw new OlvDiagnosticStop('Firebase returned an invalid token format.');
    }
    $decoded = base64_decode(strtr($value, '-_', '+/') . str_repeat('=', (4 - strlen($value) % 4) % 4), true);
    if ($decoded === false) {
        throw new OlvDiagnosticStop('Firebase returned an invalid token format.');
    }
    return $decoded;
}

function olv_verify_token(string $token, array $certificates, int $now): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3 || strlen($token) > 16384) {
        throw new OlvDiagnosticStop('Firebase returned an invalid token format.');
    }
    $header = json_decode(olv_b64($parts[0]), true);
    $claims = json_decode(olv_b64($parts[1]), true);
    $kid = is_array($header) ? ($header['kid'] ?? '') : '';
    if (!is_array($header) || !is_array($claims) || ($header['alg'] ?? '') !== 'RS256'
        || !is_string($kid) || $kid === '' || !isset($certificates[$kid]) || !is_string($certificates[$kid])) {
        throw new OlvDiagnosticStop('The Firebase signing algorithm or signing key was not recognised.');
    }
    $signature = olv_b64($parts[2]);
    if (@openssl_verify($parts[0] . '.' . $parts[1], $signature, $certificates[$kid], OPENSSL_ALGO_SHA256) !== 1) {
        throw new OlvDiagnosticStop('The Firebase token signature did not verify.');
    }
    foreach (['exp', 'iat', 'auth_time'] as $timeClaim) {
        if (!isset($claims[$timeClaim]) || !is_int($claims[$timeClaim])) {
            throw new OlvDiagnosticStop('The Firebase token has invalid time claims.');
        }
    }
    if ($claims['exp'] <= $now || $claims['iat'] > $now + 30 || $claims['auth_time'] > $now + 30
        || $claims['iat'] < 1 || $claims['auth_time'] < 1
        || ($claims['aud'] ?? '') !== OLV_PROJECT
        || ($claims['iss'] ?? '') !== 'https://securetoken.google.com/' . OLV_PROJECT
        || !is_string($claims['sub'] ?? null) || strlen($claims['sub']) < 1 || strlen($claims['sub']) > 128) {
        throw new OlvDiagnosticStop('The Firebase token is expired or its project, issuer, or identity is invalid.');
    }
    return $claims;
}

function olv_path_key($value): string
{
    if (!is_string($value) || trim($value) === '' || strlen($value) > 200
        || preg_match('/[.#$\[\]\/\x00-\x1f\x7f]/', $value)) {
        throw new OlvDiagnosticStop('A verified profile field cannot be safely used as a Firebase record key.');
    }
    return rawurlencode($value);
}

function olv_run(string $rawCookie, string $cookieName, ?callable $transport = null, ?callable $context = null): array
{
    $report = ['outcome' => 'unverified', 'identity' => null, 'course' => null, 'steps' => [], 'topics' => []];
    $step = 'Read shared cookie';
    $deadline = microtime(true) + 45;
    $customTransport = $transport !== null;
    $transport = $transport ?? static function (string $url, ?array $body) use ($deadline): array {
        return olv_http($url, $body, $deadline);
    };
    $read = static function (string $url, ?array $body = null) use ($transport) {
        return olv_response($transport($url, $body));
    };
    $pass = static function (string $name, string $detail) use (&$report): void {
        $report['steps'][] = ['name' => $name, 'ok' => true, 'detail' => $detail];
    };
    try {
        $profile = olv_profile($rawCookie, $cookieName);
        $pass($step, 'Session fields are present. Identity will be checked by the server.');
        $step = 'Check session epoch';
        $epoch = $read(OLV_EPOCH);
        if (!is_array($epoch) || !is_int($epoch['epoch'] ?? null) || $epoch['epoch'] !== $profile['sessionEpoch']) {
            throw new OlvDiagnosticStop('The session epoch is missing or out of date. Sign in again.');
        }
        $pass($step, 'The cookie matches the current server session epoch.');
        $step = 'Validate cookie with live.olevels.com';
        $exchange = $read(OLV_EXCHANGE, $profile);
        if (!is_array($exchange) || !is_string($exchange['customToken'] ?? null) || $exchange['customToken'] === '') {
            throw new OlvDiagnosticStop('The exchange did not return an authentication token.');
        }
        $pass($step, 'The login server accepted the selected cookie.');
        $step = 'Authenticate with Firebase';
        $auth = $read('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' . rawurlencode(OLV_WEB_API_KEY),
            ['token' => $exchange['customToken'], 'returnSecureToken' => true]);
        unset($exchange);
        if (!is_array($auth) || !is_string($auth['idToken'] ?? null) || $auth['idToken'] === '') {
            throw new OlvDiagnosticStop('Firebase did not return an ID token.');
        }
        $idToken = $auth['idToken'];
        unset($auth); // Discard the returned refresh token immediately.
        $pass($step, 'Firebase issued an ID token for this login.');
        $step = 'Verify Firebase identity';
        $certs = $read(OLV_CERTS);
        if (!is_array($certs)) {
            throw new OlvDiagnosticStop('Google signing certificates could not be read.');
        }
        $claims = olv_verify_token($idToken, $certs, time());
        $role = $claims['role'] ?? '';
        if (!in_array($role, ['admin', 'teacher', 'student'], true)
            || !isset($claims['id']) || !is_int($claims['id']) || $claims['id'] < 1
            || $role !== $profile['role'] || $claims['id'] !== $profile['id']
            || $claims['sub'] !== $role . '_' . $claims['id']) {
            throw new OlvDiagnosticStop('The verified identity does not match the selected login profile.');
        }
        $lookup = $read('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . rawurlencode(OLV_WEB_API_KEY), ['idToken' => $idToken]);
        $user = is_array($lookup) ? ($lookup['users'][0] ?? []) : [];
        if (($user['localId'] ?? '') !== $claims['sub'] || !empty($user['disabled'])) {
            throw new OlvDiagnosticStop('Firebase could not confirm this account as active.');
        }
        $report['identity'] = ['uid' => $claims['sub'], 'role' => $role];
        $pass($step, 'Signature, project, expiry, identity, and Firebase account lookup passed.');
        unset($profile, $lookup, $user);
        $db = static function (string $path, bool $shallow = false) use ($read, $idToken) {
            return $read(OLV_DB . '/' . $path . '.json?auth=' . rawurlencode($idToken) . ($shallow ? '&shallow=true' : ''));
        };
        $admin = false;
        if ($role === 'admin') {
            $step = 'Read verified admin record';
            $key = olv_path_key($claims['username'] ?? null);
            $admin = $db('teachers/' . $key . '/admin') === true;
            $pass($step, $admin ? 'Firebase confirms the verified account has the admin flag.' : 'No admin flag was found for the verified account.');
        }
        $step = 'Discover topics linked to the Human Biology course';
        $batch = $customTransport ? null : static function(array $requests) use($idToken,$deadline){return olv_topic_batch_http($requests,$idToken,$deadline);};
        $topics = olv_course_topics($db,$batch,$customTransport?null:olv_topic_cache_file());
        $activeTopics=array_filter($topics,static function($topic){return !$topic['archived'];});
        if(!$activeTopics)throw new OlvDiagnosticStop('No active Firebase topics map to the Human Biology course.');
        $course = reset($activeTopics)['course'];
        if (!is_array($course) || (string)($course['id'] ?? '') !== (string)OLV_COURSE_ID
            || !is_string($course['name'] ?? null) || strlen($course['name']) > 300) {
            throw new OlvDiagnosticStop('The expected Human Biology course could not be confirmed in the active Firebase topics.');
        }
        $report['course'] = ['id' => OLV_COURSE_ID, 'name' => $course['name']];
        $pass($step, 'Read course ' . OLV_COURSE_ID . ' directly from Firebase.');
        if ($role === 'admin' && $admin) {
            $report['outcome'] = 'admin_confirmed';
            $pass('Access evidence', 'Verified admin identity and admin record; Human Biology course is readable.');
        } elseif ($role === 'student') {
            $step = 'Check student membership in matching Human Biology topics';
            // Only signed profile fields are allowed to select a membership record.
            $name = olv_path_key($claims['displayName'] ?? null);
            $report['outcome'] = 'no_membership_found';
            foreach ($activeTopics as $topic=>$metadata) {
                $prefix = 'topics/' . rawurlencode($topic);
                $archived = false;
                $member = $db($prefix . '/students/' . $name, true);
                if ($member !== null && $member !== false && !is_array($member)) {
                    throw new OlvDiagnosticStop('The membership record has an unexpected format.');
                }
                $found = is_array($member) && count($member) > 0;
                $report['topics'][] = ['topic' => $topic, 'member' => $found, 'archived' => $archived === true];
                if ($found && $archived !== true) {
                    $report['outcome'] = 'membership_confirmed';
                    break;
                }
            }
            $pass($step, $report['outcome'] === 'membership_confirmed'
                ? 'A membership record exists in an active topic linked to this Human Biology course.'
                : 'No active membership was found in the Firebase topics linked to this Human Biology course.');
        } elseif ($role === 'teacher') {
            $report['outcome'] = 'teacher_confirmed';
            $pass('Access evidence', 'Signed teacher identity and active Firebase account confirmed.');
        } else {
            $report['outcome'] = 'staff_policy_pending';
            $pass('Access evidence', 'Identity and course read passed. Teacher group permissions need a separate access policy.');
        }
        if ($context !== null && in_array($report['outcome'], ['admin_confirmed', 'teacher_confirmed', 'membership_confirmed'], true)) {
            $report['teaching'] = $context($claims, $db, $activeTopics);
        }
    } catch (OlvDiagnosticStop $error) {
        $report['outcome'] = 'unverified';
        $report['steps'][] = ['name' => $step, 'ok' => false, 'detail' => $error->getMessage()];
    } catch (Throwable $error) {
        // Never expose exception dumps: upstream errors may contain credentials.
        $report['outcome'] = 'unverified';
        $report['steps'][] = ['name' => $step, 'ok' => false, 'detail' => 'This step could not complete. Check the PHP runtime and hosting connection.'];
    }
    return $report;
}
