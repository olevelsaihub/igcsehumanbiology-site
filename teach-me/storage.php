<?php
declare(strict_types=1);
// Google OAuth and private Storage JSON API; credentials never reach the browser.
final class TmStorage {
 private $cfg; private $token;
 public function __construct(array $cfg){$this->cfg=$cfg;}
 private function token(): string {
  if($this->token) return $this->token;
  $key=json_decode((string)@file_get_contents($this->cfg['gcs_key_file']),true);
  if(!is_array($key)||($key['type']??'')!=='service_account') throw new TmError('Recording storage is not configured.',503);
  $b64=static function($v){return rtrim(strtr(base64_encode(json_encode($v)),'+/','-_'),'=');};
  $now=time();$body=$b64(['alg'=>'RS256','typ'=>'JWT']).'.'.$b64(['iss'=>$key['client_email'],'scope'=>'https://www.googleapis.com/auth/devstorage.full_control','aud'=>'https://oauth2.googleapis.com/token','iat'=>$now,'exp'=>$now+3600]);
  if(!openssl_sign($body,$sig,$key['private_key'],OPENSSL_ALGO_SHA256)) throw new TmError('Storage authentication is unavailable.',503);
  $ch=curl_init('https://oauth2.googleapis.com/token');
  curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query(['grant_type'=>'urn:ietf:params:oauth:grant-type:jwt-bearer','assertion'=>$body.'.'.rtrim(strtr(base64_encode($sig),'+/','-_'),'=')]),CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>20]);
  $raw=curl_exec($ch);$code=curl_getinfo($ch,CURLINFO_RESPONSE_CODE);curl_close($ch);
  $value=is_string($raw)?json_decode($raw,true):null;
  if($code!==200||!is_string($value['access_token']??null)) throw new TmError('Storage authentication is unavailable.',503);
  return $this->token=$value['access_token'];
 }
 private function request(string $path,string $method='GET',?array $body=null,array $headers=[]): array {
  $ch=curl_init('https://storage.googleapis.com'.$path);$responseHeaders=[];
  curl_setopt_array($ch,[CURLOPT_CUSTOMREQUEST=>$method,CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>30,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_HTTPHEADER=>array_merge(['Authorization: Bearer '.$this->token(),'Content-Type: application/json'],$headers),CURLOPT_HEADERFUNCTION=>static function($ch,$line)use(&$responseHeaders){$p=explode(':',$line,2);if(count($p)===2)$responseHeaders[strtolower(trim($p[0]))]=trim($p[1]);return strlen($line);}]);
  if($body!==null)curl_setopt($ch,CURLOPT_POSTFIELDS,json_encode($body));
  $raw=curl_exec($ch);$code=curl_getinfo($ch,CURLINFO_RESPONSE_CODE);curl_close($ch);
  if($code<200||$code>=300||!is_string($raw))throw new TmError('Google storage request failed. Please retry.',503);
  return ['data'=>json_decode($raw,true),'headers'=>$responseHeaders];
 }
 public function configuration(): array {return $this->request('/storage/v1/b/'.rawurlencode($this->cfg['gcs_bucket']).'?fields=name,iamConfiguration,cors,location,metageneration')['data'];}
 public function accessPolicy(): array {return $this->request('/storage/v1/b/'.rawurlencode($this->cfg['gcs_bucket']).'/iam')['data'];}
 public function assertAvailable(): void {
  $config=$this->configuration();
  if(($this->cfg['media_delivery']??'private-proxy')==='public-redirect')return;
  // Human Biology defaults to private delivery; never weaken a shared bucket's policy.
  if(($config['iamConfiguration']['publicAccessPrevention']??'')!=='enforced')
   throw new TmError('Human Biology media requires a bucket with public access prevention enforced.',503);
 }
 public function configureCors(): void {
  $config=$this->configuration();$cors=array_values(array_filter($config['cors']??[],function($row){return ($row['origin']??[])!==[$this->cfg['origin']];}));
  $desired=['origin'=>[$this->cfg['origin']],'method'=>['GET','HEAD','PUT'],'responseHeader'=>['Content-Type','Content-Range','Range'],'maxAgeSeconds'=>3600];
  if(!in_array($desired,$cors,true)){$cors[]=$desired;$this->request('/storage/v1/b/'.rawurlencode($this->cfg['gcs_bucket']).'?ifMetagenerationMatch='.rawurlencode((string)$config['metageneration']),'PATCH',['cors'=>$cors]);}
 }
 public function start(array $object): string {
  $v=$this->request('/upload/storage/v1/b/'.rawurlencode($this->cfg['gcs_bucket']).'/o?uploadType=resumable&ifGenerationMatch=0','POST',['name'=>$object['object_key'],'contentType'=>$object['mime'],'cacheControl'=>($this->cfg['media_delivery']??'private-proxy')==='public-redirect'?'public, max-age=604800':'private, no-store'],['Origin: '.$this->cfg['origin'],'X-Upload-Content-Type: '.$object['mime'],'X-Upload-Content-Length: '.$object['bytes']]);
  $url=$v['headers']['location']??'';$p=parse_url($url);
  if(($p['scheme']??'')!=='https'||($p['host']??'')!=='storage.googleapis.com')throw new TmError('Invalid storage upload response.',503);
  return $url;
 }
 public function metadata(array $object): array {
  return $this->request('/storage/v1/b/'.rawurlencode($this->cfg['gcs_bucket']).'/o/'.rawurlencode($object['object_key']))['data'];
 }
 public function stream(array $object,bool $head):void {
  // api.php verifies identity, ready state and live restrictions before every read.
  if(($this->cfg['media_delivery']??'private-proxy')==='public-redirect'){
   $path=implode('/',array_map('rawurlencode',explode('/',$object['object_key'])));
   header('Location: https://storage.googleapis.com/'.rawurlencode($this->cfg['gcs_bucket']).'/'.$path.'?generation='.rawurlencode($object['generation']),true,302);return;
  }
  $range=$_SERVER['HTTP_RANGE']??null;
  if($range!==null&&!preg_match('/^bytes=(?:\d+-\d*|-\d+)$/D',$range))throw new TmError('Invalid media range.',416);
  $url='https://storage.googleapis.com/storage/v1/b/'.rawurlencode($this->cfg['gcs_bucket']).'/o/'.rawurlencode($object['object_key']).'?alt=media&generation='.rawurlencode((string)$object['generation']);
  $headers=['Authorization: Bearer '.$this->token()];if($range!==null)$headers[]='Range: '.$range;
  $ch=curl_init($url);$status=0;$sent=false;
  curl_setopt_array($ch,[CURLOPT_HTTPHEADER=>$headers,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_TIMEOUT=>90,CURLOPT_NOBODY=>$head,
   CURLOPT_HEADERFUNCTION=>static function($ch,$line)use(&$status){
    if(preg_match('~^HTTP/\S+ (\d+)~',$line,$m)){$status=(int)$m[1];if(in_array($status,[200,206,416],true))http_response_code($status);}
    elseif(in_array($status,[200,206,416],true)&&preg_match('/^(Content-Type|Content-Length|Content-Range|Accept-Ranges):/i',$line))header(trim($line));
    return strlen($line);
   },CURLOPT_WRITEFUNCTION=>static function($ch,$bytes)use(&$status,&$sent){if(!in_array($status,[200,206],true))return strlen($bytes);$sent=true;echo $bytes;return strlen($bytes);}]);
  $ok=curl_exec($ch);curl_close($ch);
  if(!$sent&&($ok===false||!in_array($status,[200,206,416],true)))throw new TmError('Media is temporarily unavailable.',503);
 }
}
