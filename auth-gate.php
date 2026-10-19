<?php
/** Configured Human Biology course gate. Built and verified by work/build.py. */
declare(strict_types=1);
require_once __DIR__.'/human-biology-config.php';
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
        $verifiedName = $claims['displayName'] ?? '';
        if (!is_string($verifiedName) || trim($verifiedName) === '') { $verifiedName = $claims['username'] ?? ''; }
        if (!is_string($verifiedName) || strlen($verifiedName) > 160) { $verifiedName = ''; }
        $report['identity'] = ['uid' => $claims['sub'], 'role' => $role,
            'name' => trim($verifiedName) !== '' ? trim($verifiedName) : 'Your account'];
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



// Shared by the standalone course gate and Teach Me API. No network calls.
const OLV_CRAWLER_PATTERN = '~bot|crawl|spider|scrap|ChatGPT-User|Claude-User|Perplexity-User|anthropic-ai|cohere-ai|Google-Extended|meta-external|facebookexternalhit|BingPreview|ia_archiver|archive\.org|omgili|ImageSift|curl/|wget/|python[-/]|httpx/|aiohttp/|libwww-perl|Go-http-client|Java/|node-fetch|undici|axios/|PostmanRuntime|HeadlessChrome|PhantomJS|HTTrack|Selenium|Playwright|Puppeteer~i';
const OLV_CRAWLER_ROBOTS = 'noindex, nofollow, nosnippet, noarchive, noimageindex';

function olv_crawler_denied(string $agent): bool
{
    return trim($agent) === '' || preg_match(OLV_CRAWLER_PATTERN, $agent) === 1;
}

function olv_crawler_guard(): void
{
    header('X-Robots-Tag: ' . OLV_CRAWLER_ROBOTS);
    header('X-Olevels-Crawler-Policy: no-crawl-v1');
    if (!olv_crawler_denied($_SERVER['HTTP_USER_AGENT'] ?? '')) { return; }
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: private, no-store');
    header('CDN-Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'HEAD') {
        echo 'Automated access is not permitted. Course content is protected by copyright.';
    }
    exit;
}

function olv_course_copyright(): string
{
    return '<footer id="olv-course-copyright" aria-label="Copyright and content use"'
        . ' style="clear:both;max-width:1100px;margin:32px auto 0;padding:18px 24px 88px;'
        . 'border-top:1px solid var(--rule,currentColor);font-family:inherit;font-size:12px;line-height:1.6;color:inherit">'
        . '<strong>&copy; ' . gmdate('Y') . ' olevels.com. All rights reserved.</strong> '
        . 'Course content is protected by copyright. Copying, redistribution, scraping, automated extraction '
        . 'and use for AI training are prohibited without prior written permission. '
        . 'Third-party materials remain the property of their respective copyright holders.</footer>';
}

function olv_course_protect_html(string $html): string
{
    if (strpos($html, 'data-olv-crawler-policy') === false) {
        $meta = '<meta name="robots" content="' . OLV_CRAWLER_ROBOTS . '" data-olv-crawler-policy="1">';
        $at = stripos($html, '</head>');
        if ($at !== false) { $html = substr_replace($html, $meta, $at, 0); }
    }
    if (strpos($html, 'id="olv-course-copyright"') === false) {
        $at = strripos($html, '</body>');
        $html = $at === false ? $html . olv_course_copyright() : substr_replace($html, olv_course_copyright(), $at, 0);
    }
    return $html;
}


define('OLV_GATE_BASE', hb_config()['base']);
define('OLV_GATE_ORIGIN', hb_config()['origin']);
define('OLV_GATE_POLICY', hb_config()['policy']);
const OLV_VISIBILITY_VERSION = 'teacher-content-v1';

function olv_gate_headers(): void
{
    header('Cache-Control: private, no-store, max-age=0');
    header('CDN-Cache-Control: no-store');
    header('Cloudflare-CDN-Cache-Control: no-store');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Referrer-Policy: same-origin');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Olevels-Gate: 1');
}

function olv_gate_request(string $uri): array
{
    $parts = explode('?', $uri, 2);
    $raw = $parts[0];
    if ($raw === rtrim(OLV_GATE_BASE, '/')) { $raw .= '/'; }
    if (strlen($uri) > 4096 || preg_match('/[\x00-\x20\x7f\\\\]/', $raw)
        || preg_match('/%(?:2f|5c)/i', $raw)) {
        throw new OlvDiagnosticStop('Invalid path.');
    }
    $path = rawurldecode($raw);
    if (strpos($path, OLV_GATE_BASE) !== 0 || preg_match('/[%\x00-\x1f\x7f\\\\]/', $path)) {
        throw new OlvDiagnosticStop('Invalid path.');
    }
    $relative = substr($path, strlen(OLV_GATE_BASE));
    foreach (explode('/', rtrim($relative, '/')) as $segment) {
        if ($segment !== '' && $segment[0] === '.') { throw new OlvDiagnosticStop('Invalid path.'); }
    }
    if (strpos($relative, '//') !== false) { throw new OlvDiagnosticStop('Invalid path.'); }
    // Preserve only an encoded, same-origin return URL; query strings never select a file.
    $canonical = OLV_GATE_BASE . implode('/', array_map('rawurlencode', explode('/', $relative)));
    if (isset($parts[1]) && strlen($parts[1]) <= 2048 && !preg_match('/[\x00-\x20\x7f]/', $parts[1])) {
        $canonical .= '?' . $parts[1];
    }
    return ['relative' => $relative, 'return' => OLV_GATE_ORIGIN . $canonical];
}

function olv_gate_file(string $root, string $relative): array
{
    // The gate is a static-file server. It never includes or returns PHP/configuration source.
    $allowed = ['html' => 'text/html; charset=utf-8', 'htm' => 'text/html; charset=utf-8',
        'css' => 'text/css; charset=utf-8', 'js' => 'text/javascript; charset=utf-8', 'mjs' => 'text/javascript; charset=utf-8',
        'json' => 'application/json; charset=utf-8', 'pdf' => 'application/pdf',
        'webp' => 'image/webp', 'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
        'gif' => 'image/gif', 'svg' => 'image/svg+xml', 'ico' => 'image/x-icon',
        'mp4' => 'video/mp4', 'webm' => 'video/webm', 'mp3' => 'audio/mpeg', 'm4a' => 'audio/mp4',
        'ogg' => 'audio/ogg', 'wav' => 'audio/wav', 'woff' => 'font/woff', 'woff2' => 'font/woff2',
        'ttf' => 'font/ttf', 'txt' => 'text/plain; charset=utf-8', 'vtt' => 'text/vtt; charset=utf-8', 'zip' => 'application/zip'];
    $root = realpath($root);
    if ($root === false) { throw new OlvDiagnosticStop('Missing site root.'); }
    $cursor = $root;
    foreach (explode('/', $relative) as $segment) {
        if ($segment === '') { continue; }
        if ($segment[0] === '.' || strpos($segment, '\\') !== false || strpos($segment, "\0") !== false) {
            throw new OlvDiagnosticStop('Invalid path.');
        }
        $cursor .= '/' . $segment;
        if (is_link($cursor)) { throw new OlvDiagnosticStop('Linked files are not served.'); }
    }
    $directory = is_dir($cursor);
    if ($directory) { $cursor .= '/index.html'; }
    if (is_link($cursor)) { throw new OlvDiagnosticStop('Linked files are not served.'); }
    $real = realpath($cursor);
    $ext = strtolower(pathinfo($cursor, PATHINFO_EXTENSION));
    if ($real === false || strpos($real, $root . '/') !== 0 || !is_file($real) || !is_readable($real)
        || !isset($allowed[$ext])) { throw new OlvDiagnosticStop('File not found.'); }
    return ['path' => $real, 'type' => $allowed[$ext], 'directory' => $directory];
}

function olv_gate_range(?string $range, int $size): ?array
{
    if ($range === null || $range === '') { return null; }
    if ($size < 1 || !preg_match('/^bytes=(\d*)-(\d*)$/D', $range, $m)
        || ($m[1] === '' && $m[2] === '') || strlen($m[1]) > 18 || strlen($m[2]) > 18) {
        throw new OlvDiagnosticStop('Invalid range.');
    }
    if ($m[1] === '') {
        $length = (int)$m[2];
        if ($length < 1) { throw new OlvDiagnosticStop('Invalid range.'); }
        return [max(0, $size - $length), $size - 1];
    }
    $start = (int)$m[1];
    $end = $m[2] === '' ? $size - 1 : min((int)$m[2], $size - 1);
    if ($start >= $size || $end < $start) { throw new OlvDiagnosticStop('Invalid range.'); }
    return [$start, $end];
}

function olv_gate_decision(array $report): array
{
    $identity = $report['identity'] ?? [];
    $role = $identity['role'] ?? '';
    $outcome = $report['outcome'] ?? '';
    $courseOK = ($report['course']['id'] ?? null) === OLV_COURSE_ID;
    $teacher = ($role === 'admin' && $outcome === 'admin_confirmed')
        || ($role === 'teacher' && $outcome === 'teacher_confirmed');
    if ($courseOK && ($teacher
        || ($role === 'student' && $outcome === 'membership_confirmed'))) {
        return ['status' => 200, 'identity' => $identity, 'teacher' => $teacher];
    }
    if (in_array($outcome, ['no_membership_found', 'staff_policy_pending'], true)) {
        return ['status' => 403, 'identity' => $identity];
    }
    return ['status' => 503, 'identity' => null];
}

function olv_gate_teacher_file(string $relative): bool
{
    // Includes official PDF names (" MS.pdf"), crops (-MS.webp), answer sheets and stories.
    // Release ZIPs can contain both roles' pages and must never be a student download.
    // The type MS PDFs are for students (Bareera, 16 Oct 2026: practice PDF as separate QP and MS files).
    if (preg_match('~^workbooks/types/[a-z0-9-]+-ms\.pdf$~', $relative)) { return false; }
    return (bool)preg_match('~(?:^|[/\s_.-])(?:mark[\s_-]*schemes?|answers?|solutions?|ms)(?:[/\s_.-]|$)|(?:^|/)story(?:book|figs|text|[-.])~i', $relative)
        || strtolower(pathinfo($relative, PATHINFO_EXTENSION)) === 'zip';
}

function olv_gate_student_file(string $root, string $relative, array $file): array
{
    if (strpos($file['type'], 'text/html') !== 0) { return $file; }
    $plans = ['gradeAplan', 'grade8plan', 'grade9plan', 'topinworld', 'passplan', 'grade7execution'];
    $parts = explode('/', $relative);
    $bucket = in_array($parts[0], $plans, true) ? array_shift($parts) : '';
    $page = implode('/', $parts);
    if ($file['directory']) { $page = rtrim($page, '/') . '/index.html'; }
    $page = ltrim($page, '/');
    $base = rtrim($root, '/') . ($bucket === '' ? '' : '/' . $bucket);
    $private = $base . '/.student';
    $manifestPath = $private . '/manifest.json';
    // Only internally constructed private paths are allowed. Direct dotfile requests remain blocked.
    foreach ([$private, $manifestPath] as $path) {
        if (is_link($path)) { throw new OlvDiagnosticStop('Student release is unavailable.'); }
    }
    if (!is_file($manifestPath) || filesize($manifestPath) > 2097152) {
        throw new OlvDiagnosticStop('Student release is unavailable.');
    }
    $manifest = json_decode((string)file_get_contents($manifestPath), true);
    $entry = is_array($manifest) && ($manifest['version'] ?? '') === OLV_VISIBILITY_VERSION
        ? ($manifest['pages'][$page] ?? null) : null;
    if (!is_array($entry) || !is_string($entry['source'] ?? null) || !is_string($entry['student'] ?? null)
        || !hash_equals($entry['source'], (string)hash_file('sha256', $file['path']))) {
        throw new OlvDiagnosticStop('Student release is missing or out of date.');
    }
    $cursor = $private;
    foreach (explode('/', $page) as $segment) {
        if ($segment === '' || $segment[0] === '.') { throw new OlvDiagnosticStop('Invalid student release path.'); }
        $cursor .= '/' . $segment;
        if (is_link($cursor)) { throw new OlvDiagnosticStop('Student release is unavailable.'); }
    }
    $real = realpath($cursor);
    $privateRoot = realpath($private);
    if ($real === false || $privateRoot === false || strpos($real, $privateRoot . '/') !== 0
        || !is_file($real) || !hash_equals($entry['student'], (string)hash_file('sha256', $real))) {
        throw new OlvDiagnosticStop('Student release is unavailable.');
    }
    $file['path'] = $real;
    return $file;
}

function olv_gate_fingerprint(array $cookies): string
{
    $values = [];
    foreach (['teacher', 'student'] as $key) {
        $value = $cookies[$key] ?? '';
        if (!is_string($value) || strlen($value) > 8192) { $value = ''; }
        $values[$key] = $value;
    }
    return hash('sha256', OLV_GATE_POLICY . "\0" . json_encode($values));
}

function olv_gate_authorize(array $cookies, ?callable $transport = null): array
{
    // Keep the production transport null so olv_run uses parallel topic discovery
    // and its private metadata cache. An injected transport is for isolated tests.
    $results = [];
    // Verify teacher first: a verified teacher/admin takes precedence over any student login.
    foreach (['teacher', 'student'] as $key) {
        if (!isset($cookies[$key]) || !is_string($cookies[$key]) || $cookies[$key] === '') { continue; }
        try { olv_profile($cookies[$key], $key); }
        catch (OlvDiagnosticStop $e) { $results[] = ['status' => 401, 'identity' => null]; continue; }
        $decision = olv_gate_decision(olv_run($cookies[$key], $key, $transport));
        if ($decision['status'] === 200) { return $decision; }
        $results[] = $decision;
    }
    if (!$results) { return ['status' => 401, 'identity' => null]; }
    foreach ($results as $result) { if ($result['status'] === 503) { return $result; } }
    foreach ($results as $result) { if ($result['status'] === 403) { return $result; } }
    return ['status' => 401, 'identity' => null];
}

function olv_gate_cached(array $session, string $fingerprint, int $now): ?array
{
    // A verified decision lasts for this PHP session, bound to the current login cookies.
    $cache = $session['decision'] ?? null;
    if (!is_array($cache) || ($cache['policy'] ?? '') !== OLV_GATE_POLICY
        || !is_string($cache['fingerprint'] ?? null) || !hash_equals($fingerprint, $cache['fingerprint'])
        || !is_int($cache['checked'] ?? null) || $cache['checked'] < 1 || $cache['checked'] > $now
        || ($cache['result']['status'] ?? null) !== 200) { return null; }
    // Older course sessions may have cached a verified role without a display name.
    // Refresh those sessions so the header uses the current verified account profile.
    $name = $cache['result']['identity']['name'] ?? null;
    if (!is_string($name) || trim($name) === '' || $name === 'Your account') { return null; }
    return $cache['result'];
}

function olv_gate_message(int $status, string $returnURL, bool $head = false, bool $probe = false, bool $teacherOnly = false): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: ' . OLV_CRAWLER_ROBOTS);
    header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data:; base-uri 'none'; frame-ancestors 'self'");
    if ($status === 503) { header('Retry-After: 30'); }
    if ($head) { return; }
    $copy = [
        200 => ['Course access confirmed', 'Your current login can open this Human Biology course.'],
        401 => ['Sign in to open the Human Biology course', 'Use the olevels.com account enrolled in this course.'],
        403 => ['Course access could not be confirmed', 'Your account is signed in, but no active membership was found in the configured Human Biology classes. Contact your teacher if you should have access.'],
        404 => ['Page not found', 'This page or file is not available.'],
        405 => ['This request is not supported', 'Open the course using a normal page or file link.'],
        503 => ['We could not check your access', 'The login or course service could not verify this request. Try again shortly, or sign in again.'],
    ];
    [$title, $description] = $copy[$status] ?? $copy[503];
    if ($teacherOnly) {
        $title = 'Teacher access required';
        $description = 'This resource is available to signed-in teachers and administrators.';
    }
    $login = 'https://live.olevels.com/student?redirect=' . rawurlencode($returnURL);
    ?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?= olv_text($title) ?> · olevels.com</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600&display=swap"><!-- brand:head:start --><link rel="icon" type="image/png" href="data:,"><style>:root{--ol-coral:#E4464F;--ol-navy:#3B465A;--ol-coral-soft:#FCE9EA;--ol-navy-soft:#E9ECF2;--ol-nib:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 200'%3E%3Cg transform='translate(80 100)'%3E%3Cpath fill='%233B465A' fill-opacity='.055' fill-rule='evenodd' d='M0-32C11-32 16-24 16-14V2L0 34-16 2V-14C-16-24-11-32 0-32ZM0-11a4 4 0 1 0 .01 0ZM-1.5-2.5h3V19L0 24-1.5 19Z'/%3E%3C/g%3E%3C/svg%3E")}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ol-coral:#F26A72;--ol-navy:#B9C2D6;--ol-coral-soft:#3A2328;--ol-navy-soft:#283042;--ol-nib:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 200'%3E%3Cg transform='translate(80 100)'%3E%3Cpath fill='%23B9C2D6' fill-opacity='.05' fill-rule='evenodd' d='M0-32C11-32 16-24 16-14V2L0 34-16 2V-14C-16-24-11-32 0-32ZM0-11a4 4 0 1 0 .01 0ZM-1.5-2.5h3V19L0 24-1.5 19Z'/%3E%3C/g%3E%3C/svg%3E")}}:root[data-theme="dark"]{--ol-coral:#F26A72;--ol-navy:#B9C2D6;--ol-coral-soft:#3A2328;--ol-navy-soft:#283042;--ol-nib:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 200'%3E%3Cg transform='translate(80 100)'%3E%3Cpath fill='%23B9C2D6' fill-opacity='.05' fill-rule='evenodd' d='M0-32C11-32 16-24 16-14V2L0 34-16 2V-14C-16-24-11-32 0-32ZM0-11a4 4 0 1 0 .01 0ZM-1.5-2.5h3V19L0 24-1.5 19Z'/%3E%3C/g%3E%3C/svg%3E")}body{font-family:'Poppins',system-ui,-apple-system,'Segoe UI',sans-serif;background-image:var(--ol-nib);background-size:160px 200px;background-attachment:fixed}h1,h2,h3,h4{font-family:'Poppins',system-ui,-apple-system,'Segoe UI',sans-serif;font-weight:700;color:var(--ol-navy)}.ol-bar{display:flex;align-items:center;gap:14px;padding:9px 18px;background:#fff;border-bottom:3px solid var(--ol-coral);font-family:'Poppins',system-ui,-apple-system,'Segoe UI',sans-serif}.ol-bar .ol-logo{display:inline-flex;line-height:0}.ol-bar img{height:42px;width:auto;max-width:none;border:0;border-radius:0;background:transparent;box-shadow:none;margin:0;padding:0}.ol-bar .ol-tag{margin-left:auto;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#3B465A;text-align:right}@media (max-width:560px){.ol-bar .ol-tag{display:none}}@media print{.ol-bar{border-bottom-color:#000}body{background-image:none}}</style><!-- brand:head:end -->
<style>:root{--paper:#F5F6F8;--card:#FFFFFF;--ink:#2F3A4D;--muted:#6B7386;--rule:#E1E4EA;--accent:#E4464F;--shadow:0 1px 2px rgba(59,70,90,.06),0 8px 24px -12px rgba(59,70,90,.18)}
@media (prefers-color-scheme:dark){:root{--paper:#161B26;--card:#1F2634;--ink:#E6E9F0;--muted:#A3ABBD;--rule:#2E3648;--accent:#F26A72;--shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px -14px rgba(0,0,0,.7)}}

*{box-sizing:border-box}body{margin:0;background-color:var(--paper);color:var(--ink);line-height:1.7}main{max-width:700px;margin:12vh auto;padding:30px}section{padding:32px;border:1px solid var(--rule);border-radius:18px;background:var(--card);box-shadow:var(--shadow)}h1{font-size:clamp(1.7rem,5vw,2.3rem);line-height:1.2}p{color:var(--muted)}a{color:var(--accent)}.actions{display:flex;gap:22px;flex-wrap:wrap;margin-top:24px}.button{display:inline-block;padding:10px 18px;background:var(--ol-navy);color:var(--card);border-radius:9px;text-decoration:none;font-weight:600}:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.label{color:var(--accent);font-size:.8rem;font-weight:600}footer{font-size:.8rem;margin-top:24px}</style></head><body>
<!-- brand:bar:start --><header class="ol-bar"><a class="ol-logo" href="/igcsehumanbiology/"><img src="data:image/png;base64,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" alt="OLevels.com School" width="640" height="250"></a><span class="ol-tag">Human Biology · course access</span></header><!-- brand:bar:end -->
<main><section><div class="label">HUMAN BIOLOGY · IGCSE</div><h1><?= olv_text($title) ?></h1><p><?= olv_text($description) ?></p><div class="actions">
<?php if ($status === 200): ?><a class="button" href="<?= olv_text(OLV_GATE_BASE) ?>">Open the Human Biology course</a>
<?php elseif ($status === 401 || $status === 403 || $status === 503): ?><a class="button" href="<?= olv_text($login) ?>">Sign in</a><a href="<?= olv_text($returnURL) ?>">Try again</a>
<?php else: ?><a class="button" href="<?= olv_text(OLV_GATE_BASE) ?>">Human Biology course</a><?php endif; ?>
</div><?php if ($probe): ?><footer>This connection check uses the course access rule. It does not activate protection on other pages.</footer><?php endif; ?></section></main><?= olv_course_copyright() ?></body></html>
<?php
}

function olv_gate_account_html(array $identity): string
{
    $role = $identity['role'] ?? '';
    if (!in_array($role, ['admin', 'teacher', 'student'], true)) { return 'Signed in'; }
    $name = $identity['name'] ?? 'Your account';
    return '<span class="account-name">' . olv_text($name) . '</span> '
        . '<span class="account-role">' . olv_text(ucfirst($role)) . '</span>';
}

function olv_gate_main(string $root, ?callable $transport = null): void
{
    ini_set('display_errors', '0'); ini_set('log_errors', '0');
    olv_gate_headers();
    olv_crawler_guard();
    $head = ($_SERVER['REQUEST_METHOD'] ?? '') === 'HEAD';
    $open = hb_config()['open_access'] === true;
    if (!$open && OLV_COURSE_ID < 1) { olv_gate_message(503, OLV_GATE_ORIGIN . OLV_GATE_BASE, $head); return; }
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $returnURL = OLV_GATE_ORIGIN . OLV_GATE_BASE;
    try { $request = olv_gate_request($_SERVER['REQUEST_URI'] ?? ''); $returnURL = $request['return']; }
    catch (OlvDiagnosticStop $e) { olv_gate_message(404, $returnURL, $head); return; }
    $probe = $request['relative'] === 'auth-gate.php';
    if (!in_array($method, ['GET', 'HEAD'], true)) {
        header('Allow: GET, HEAD'); olv_gate_message(405, $returnURL, $head, $probe); return;
    }
    // No forwarded-header trust: Apache's HTTPS state must be configured correctly.
    if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off'
        || !extension_loaded('curl') || !extension_loaded('openssl') || !extension_loaded('session')) {
        olv_gate_message(503, $returnURL, $head, $probe); return;
    }
    if ($open) {
        // Open access: everyone gets the student view. No login, session or Firebase call.
        $decision = ['status' => 200, 'identity' => [], 'teacher' => false];
    } else {
    session_name(hb_config()['gate_session']);
    ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1');
    session_cache_limiter('');
    session_set_cookie_params(['lifetime' => 0, 'path' => OLV_GATE_BASE, 'domain' => '', 'secure' => true,
        'httponly' => true, 'samesite' => 'Lax']);
    if (!session_start()) { olv_gate_message(503, $returnURL, $head, $probe); return; }
    $fingerprint = olv_gate_fingerprint($_COOKIE);
    $decision = olv_gate_cached($_SESSION, $fingerprint, time());
    if ($decision === null) {
        $changedIdentity = ($_SESSION['decision']['fingerprint'] ?? '') !== $fingerprint;
        unset($_SESSION['decision']);
        $decision = olv_gate_authorize($_COOKIE, $transport);
        if ($decision['status'] === 200) {
            if ($changedIdentity) { session_regenerate_id(true); }
            $_SESSION['decision'] = ['policy' => OLV_GATE_POLICY, 'fingerprint' => $fingerprint,
                'checked' => time(), 'result' => $decision];
        }
    }
    session_write_close();
    if ($decision['status'] !== 200) {
        // Redirect a missing login once. Failed verification stays on an explanatory page.
        if ($decision['status'] === 401 && empty($_COOKIE['teacher']) && empty($_COOKIE['student']) && !$probe) {
            header('Location: https://live.olevels.com/student?redirect=' . rawurlencode($returnURL), true, 302);
            return;
        }
        olv_gate_message($decision['status'], $returnURL, $head, $probe); return;
    }
    }
    if ($probe) { olv_gate_message(200, $returnURL, $head, true); return; }
    $teacher = ($decision['teacher'] ?? false) === true;
    if (!$teacher && olv_gate_teacher_file($request['relative'])) {
        if ($open) { olv_gate_message(404, $returnURL, $head); return; }
        olv_gate_message(403, $returnURL, $head, false, true); return;
    }
    // The Teach Me studio is for signed-in teachers; open access serves the student video library instead.
    if ($open && in_array($request['relative'], ['teach-me', 'teach-me/', 'teach-me/index.html'], true)) {
        olv_gate_message(404, $returnURL, $head); return;
    }
    try { $file = olv_gate_file($root, $request['relative']); }
    catch (OlvDiagnosticStop $e) { olv_gate_message(404, $returnURL, $head); return; }
    if (!$teacher && !in_array($request['relative'], ['teach-me', 'teach-me/', 'teach-me/index.html'], true)) {
        try { $file = olv_gate_student_file($root, $request['relative'], $file); }
        catch (OlvDiagnosticStop $e) { olv_gate_message(503, $returnURL, $head); return; }
    }
    if ($file['directory'] && substr(explode('?', $_SERVER['REQUEST_URI'], 2)[0], -1) !== '/') {
        $parts = explode('?', $returnURL, 2);
        header('Location: ' . $parts[0] . '/' . (isset($parts[1]) ? '?' . $parts[1] : ''), true, 302); return;
    }
    // Apply policy after role-specific content selection and integrity verification.
    if (strpos($file['type'], 'text/html') === 0) {
        $html = olv_course_protect_html((string)file_get_contents($file['path']));
        $account = $open ? '' : olv_gate_account_html($decision['identity'] ?? []);
        $html = str_replace('<span data-olv-account></span>', '<span data-olv-account>' . $account . '</span>', $html);
    // Keep course links alongside the copyright notice, after the student SHA check.
    if (strpos($request['relative'], 'teach-me/') !== 0) {
        $script = '<script src="/igcsehumanbiology/teach-me/course-links.js" defer></script>';
        $html = str_replace('</body>', $script . '</body>', $html);
    }
    // The red Feedback tab on every course page, Teach Me included.
    // Feedback needs a signed-in account, so open access leaves it out.
    if (!$open) { $html = str_replace('</body>', '<script src="/igcsehumanbiology/assets/feedback.js?v=1" defer></script></body>', $html); }

        header('Content-Type: text/html; charset=utf-8');
        header('Content-Length: ' . strlen($html));
        if (!$head) { echo $html; }
        return;
    }
    $handle = @fopen($file['path'], 'rb');
    if ($handle === false) { olv_gate_message(503, $returnURL, $head); return; }
    $size = fstat($handle)['size'];
    header('Content-Type: ' . $file['type']);
    header('Accept-Ranges: bytes');
    $rangeHeader = $head || isset($_SERVER['HTTP_IF_RANGE']) ? null : ($_SERVER['HTTP_RANGE'] ?? null);
    try { $range = olv_gate_range($rangeHeader, $size); }
    catch (OlvDiagnosticStop $e) {
        fclose($handle); http_response_code(416); header('Content-Range: bytes */' . $size); header('Content-Length: 0'); return;
    }
    [$start, $end] = $range ?? [0, $size - 1];
    $length = $size === 0 ? 0 : $end - $start + 1;
    if ($range !== null) { http_response_code(206); header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size); }
    header('Content-Length: ' . $length);
    if ($head) { fclose($handle); return; }
    @ini_set('zlib.output_compression', '0');
    if ($start > 0) { fseek($handle, $start); }
    while (ob_get_level() > 0) { ob_end_clean(); }
    while ($length > 0 && !feof($handle) && !connection_aborted()) {
        $chunk = fread($handle, min(65536, $length));
        if ($chunk === false || $chunk === '') { break; }
        echo $chunk; $length -= strlen($chunk);
    }
    fclose($handle);
}

if (!defined('OLV_GATE_LIBRARY_ONLY')) { olv_gate_main(__DIR__); }
