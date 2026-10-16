<?php
declare(strict_types=1);
ini_set('display_errors','0');
ini_set('log_errors','0');
// Reached through teach-me/api.php?action=progress-<action>; the course gate and crawler guard already ran there.
// Student progress for teachers: where each student is (plan, block, type, page), live heartbeats,
// block mastery results with every question, and the server-marked "Check my answer" attempts.
// Stored as private files outside the web root (the database user cannot create tables).
require_once __DIR__.'/../teach-me/crawler-policy.php';
olv_crawler_guard();
require_once __DIR__.'/../teach-me/domain.php';
require_once __DIR__.'/../teach-me/session.php';

const SP_VISIT_GAP=1800;   // A new visit starts after 30 minutes without activity.
const SP_HEARTBEAT=240;    // The same page again within 4 minutes is a heartbeat, not a new page view.
const SP_ONLINE=150;       // "Online now" means activity in the last 150 seconds (pages beat every 60 s).
const SP_DAY_OFFSET=18000; // Days are counted in Pakistan time (UTC+5).
const SP_RECENT=40;        // Recent pages kept per person.
const SP_KINDS=['home','plan','block','type','mastery','mastery-block','practice','story','video','lab','poem','paper','staff','page'];

function sp_json(array $value,int $status=200): void {
 http_response_code($status);
 header('Content-Type: application/json; charset=utf-8');
 echo json_encode($value,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);
}
function sp_dir(array $cfg,string $sub=''): string {
 // Check and create the base folder first: the web-root check needs an existing parent folder.
 $base=rtrim((string)($cfg['private_dir']??''),'/').'/student-progress';
 if(!hb_outside_webroot($base))throw new RuntimeException('Progress storage must be outside the web root.');
 if(!is_dir($base)&&!@mkdir($base,0700)&&!is_dir($base))throw new RuntimeException('Progress storage could not be created.');
 if($sub==='')return $base;
 if(!preg_match('/^[a-z]+$/D',$sub))throw new RuntimeException('Invalid progress folder.');
 $dir=$base.'/'.$sub;
 if(!is_dir($dir)&&!@mkdir($dir,0700)&&!is_dir($dir))throw new RuntimeException('Progress storage could not be created.');
 return $dir;
}
function sp_day(int $t): string { return gmdate('Y-m-d',$t+SP_DAY_OFFSET); }
function sp_str($v,int $max): string {
 if(!is_string($v)&&!is_int($v)&&!is_float($v))return '';
 $v=trim((string)preg_replace('/[\x00-\x1f\x7f]+/u',' ',(string)$v));
 return mb_substr($v,0,$max,'UTF-8');
}
function sp_id($v,string $pattern): string { return is_string($v)&&preg_match($pattern,$v)?$v:''; }
function sp_person_file(array $cfg,string $uid): string { return sp_dir($cfg,'people').'/'.hash('sha256',$uid).'.json'; }
/** Read-modify-write one person's record under an exclusive lock. */
function sp_update(array $cfg,array $ctx,callable $change): array {
 $h=@fopen(sp_person_file($cfg,(string)$ctx['uid']),'c+');
 if(!$h)throw new RuntimeException('Progress could not be saved.');
 flock($h,LOCK_EX);
 $p=json_decode((string)stream_get_contents($h),true);
 if(!is_array($p))$p=['uid'=>(string)$ctx['uid'],'first_seen'=>time(),'last_seen'=>0,'visits'=>0,'page_views'=>0,'days'=>[],'recent'=>[],'mastery'=>[],'device_mastery'=>[]];
 $p['name']=sp_str($ctx['name']??'',190)?:'Unnamed account';
 $p['role']=(string)$ctx['role'];
 $p['classes']=$ctx['role']==='student'?array_values(array_filter($ctx['memberships']??[],'is_string')):[];
 $p=$change($p);
 ftruncate($h,0);rewind($h);fwrite($h,json_encode($p,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE));
 fflush($h);flock($h,LOCK_UN);fclose($h);
 @chmod(sp_person_file($cfg,(string)$ctx['uid']),0600);
 return $p;
}
function sp_place(array $in): array {
 $kind=in_array($in['kind']??'',SP_KINDS,true)?$in['kind']:'page';
 $path=sp_str($in['path']??'',300);
 if(strpos($path,'/igcsehumanbiology/')!==0)$path='/igcsehumanbiology/';
 return ['kind'=>$kind,'path'=>$path,'title'=>sp_str($in['title']??'',160),
  'plan'=>sp_str($in['plan']??'',60),'planTitle'=>sp_str($in['planTitle']??'',120),
  'block'=>sp_id($in['block']??'','/^HBI-BLOCK-[A-Z0-9-]{1,60}$/D'),'blockTitle'=>sp_str($in['blockTitle']??'',160),
  'type'=>sp_id($in['type']??'','/^HBI-[A-Z0-9-]{1,70}$/D'),'typeTitle'=>sp_str($in['typeTitle']??'',160)];
}
function sp_append(array $cfg,string $name,array $row): void {
 $file=sp_dir($cfg).'/'.$name.'-'.gmdate('Y-m',(int)$row['created_at']).'.jsonl';
 $line=json_encode($row,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE)."\n";
 if(@file_put_contents($file,$line,FILE_APPEND|LOCK_EX)!==strlen($line))throw new RuntimeException('The result could not be saved.');
 @chmod($file,0600);
}
/** JSON lines from monthly files since a time, oldest first. */
function sp_lines(string $dir,string $name,int $since,callable $keep): array {
 $rows=[];
 for($m=strtotime(gmdate('Y-m-01',$since));$m<=time();$m=strtotime('+1 month',$m)){
  $file=$dir.'/'.$name.'-'.gmdate('Y-m',$m).'.jsonl';
  if(!is_file($file))continue;
  $h=@fopen($file,'r');if(!$h)continue;
  while(($line=fgets($h))!==false){$r=json_decode($line,true);if(is_array($r)&&(int)($r['created_at']??0)>$since&&$keep($r))$rows[]=$r;}
  fclose($h);
 }
 return $rows;
}
function sp_marking_dir(array $cfg): string { return rtrim((string)($cfg['private_dir']??''),'/').'/marking-attempts'; }
function sp_people(array $cfg): array {
 $out=[];
 foreach(glob(sp_dir($cfg,'people').'/*.json')?:[] as $f){$p=json_decode((string)@file_get_contents($f),true);if(is_array($p)&&isset($p['uid']))$out[]=$p;}
 return $out;
}
function sp_mastery_summary(array $p): array {
 $s=['attempted'=>0,'mastered'=>0,'ready'=>0,'attempts'=>0,'lastPct'=>null,'lastBlock'=>'','lastAt'=>0];
 $all=$p['mastery']??[];
 foreach(($p['device_mastery']??[]) as $id=>$d)if(!isset($all[$id]))$all[$id]=['best'=>$d['best'],'attempts'=>0,'lastAt'=>0,'device'=>true];
 foreach($all as $id=>$m){
  $s['attempted']++;$s['attempts']+=(int)($m['attempts']??0);
  if((int)$m['best']===100)$s['mastered']++;elseif((int)$m['best']>=90)$s['ready']++;
  if((int)($m['lastAt']??0)>$s['lastAt']){$s['lastAt']=(int)$m['lastAt'];$s['lastPct']=$m['last']??null;$s['lastBlock']=$id;}
 }
 return $s;
}

try{
 header('Cache-Control: private, no-store, max-age=0');
 header('CDN-Cache-Control: no-store');
 header('Cloudflare-CDN-Cache-Control: no-store');
 header('X-Content-Type-Options: nosniff');
 header('Referrer-Policy: same-origin');
 if(($_SERVER['HTTPS']??'')!=='on')throw new TmError('HTTPS is required.',503);
 $cfg=hb_config();
 if(($cfg['course_id']??0)<1||empty($cfg['dsn'])||empty($cfg['db_user']))throw new TmError('Progress tracking is not configured yet.',503);
 $db=new PDO($cfg['dsn'],$cfg['db_user'],$cfg['db_password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);
 $ctx=tm_context($db,$cfg);$csrf=$_SESSION['csrf'];session_write_close();
 if(!is_string($ctx['uid']??null)||!preg_match('/^[\x21-\x7e]{1,128}$/D',(string)$ctx['uid']))throw new TmError('Your sign-in could not be read. Refresh and try again.',403);
 $staff=in_array($ctx['role'],['admin','teacher'],true);
 $action=$_GET['action']??'session';$method=$_SERVER['REQUEST_METHOD']??'GET';
 $input=[];
 if(in_array($action,['ping','mastery'],true)){
  if($method!=='POST')throw new TmError('Use POST.',405);
  if(($_SERVER['HTTP_ORIGIN']??'')!==$cfg['origin']||!hash_equals($csrf,$_SERVER['HTTP_X_CSRF_TOKEN']??''))throw new TmError('Your session expired. Refresh the page.',403);
  $raw=file_get_contents('php://input',false,null,0,120001);
  if(strlen((string)$raw)>120000)throw new TmError('Too much data.',413);
  $input=json_decode((string)$raw,true);
  if(!is_array($input))throw new TmError('Invalid request.');
 }elseif(!in_array($method,['GET','HEAD'],true))throw new TmError('Unsupported method.',405);

 if($action==='session'){
  sp_json(['role'=>$ctx['role'],'csrf'=>$csrf,'staff'=>$staff]);
 }elseif($action==='ping'){
  $place=sp_place($input);$now=time();
  $device=is_array($input['device']??null)?$input['device']:[];
  sp_update($cfg,$ctx,static function(array $p)use($place,$now,$device){
   if($now-(int)$p['last_seen']>SP_VISIT_GAP||(int)$p['visits']===0)$p['visits']++;
   $last=$p['recent'][0]??null;
   $same=is_array($last)&&$last['path']===$place['path']&&$last['type']===$place['type']&&$now-(int)$last['at']<SP_HEARTBEAT;
   if($same){$p['recent'][0]['seen']=$now;}
   else{
    $p['page_views']++;$day=sp_day($now);$p['days'][$day]=(int)($p['days'][$day]??0)+1;
    array_unshift($p['recent'],$place+['at'=>$now,'seen'=>$now]);$p['recent']=array_slice($p['recent'],0,SP_RECENT);
    if(count($p['days'])>120)$p['days']=array_slice($p['days'],-120,null,true);
   }
   $p['last_seen']=$now;$p['current']=$place+['at'=>$now];
   // Best scores saved in the student's own browser before tracking began (sent once per session).
   foreach($device as $id=>$d){
    if(!is_string($id)||!preg_match('/^HBI-BLOCK-[A-Z0-9-]{1,60}$/D',$id)||!is_array($d))continue;
    $best=max(0,min(100,(int)($d['best']??0)));
    if(!isset($p['device_mastery'][$id])||$p['device_mastery'][$id]['best']<$best)$p['device_mastery'][$id]=['best'=>$best,'n'=>max(0,min(999,(int)($d['n']??0)))];
   }
   return $p;
  });
  sp_json(['ok'=>true]);
 }elseif($action==='mastery'){
  $block=sp_id($input['block']??'','/^HBI-BLOCK-[A-Z0-9-]{1,60}$/D');
  $total=(int)($input['total']??0);$score=(int)($input['score']??-1);
  if($block===''||$total<1||$total>80||$score<0||$score>$total)throw new TmError('Invalid mastery result.');
  $pct=(int)round($score*100/$total);
  $band=$pct===100?'mastered':($pct>=90?'ready':($pct>=80?'nearly':'not-yet'));
  $questions=[];
  foreach(array_slice(is_array($input['questions']??null)?$input['questions']:[],0,80) as $q){
   if(!is_array($q))continue;
   $questions[]=['typeId'=>sp_id($q['typeId']??'','/^HBI-[A-Z0-9-]{1,70}$/D'),'kind'=>sp_str($q['kind']??'',8),'q'=>sp_str($q['q']??'',600),
    'response'=>sp_str($q['response']??'',300),'answer'=>sp_str($q['answer']??'',300),'correct'=>!empty($q['correct'])];
  }
  $types=[];
  foreach(array_slice(is_array($input['types']??null)?$input['types']:[],0,40) as $t){
   if(!is_array($t))continue;$id=sp_id($t['id']??'','/^HBI-[A-Z0-9-]{1,70}$/D');
   if($id!=='')$types[]=['id'=>$id,'right'=>max(0,(int)($t['right']??0)),'total'=>max(0,(int)($t['total']??0))];
  }
  $now=time();$id=bin2hex(random_bytes(16));
  sp_append($cfg,'mastery',['id'=>$id,'uid'=>(string)$ctx['uid'],'name'=>sp_str($ctx['name']??'',190),'role'=>(string)$ctx['role'],
   'block'=>$block,'title'=>sp_str($input['title']??'',160),'score'=>$score,'total'=>$total,'pct'=>$pct,'band'=>$band,
   'types'=>$types,'questions'=>$questions,'seconds'=>max(0,min(86400,(int)($input['seconds']??0))),'created_at'=>$now]);
  sp_update($cfg,$ctx,static function(array $p)use($block,$pct,$now){
   $m=$p['mastery'][$block]??['best'=>0,'attempts'=>0,'firstAt'=>$now];
   $m['best']=max((int)$m['best'],$pct);$m['last']=$pct;$m['attempts']=(int)$m['attempts']+1;$m['lastAt']=$now;
   if($pct===100&&empty($m['masteredAt']))$m['masteredAt']=$now;
   $p['mastery'][$block]=$m;$p['last_seen']=max((int)$p['last_seen'],$now);
   return $p;
  });
  sp_json(['ok'=>true,'id'=>$id]);
 }elseif($action==='overview'){
  if(!$staff)throw new TmError('Teacher access is required.',403);
  $who=($_GET['who']??'students')==='all'?'all':'students';$now=time();
  $since=$now-60*86400;
  $checks=[];
  foreach(sp_lines(sp_marking_dir($cfg),'attempts',$since,static function(){return true;}) as $r){
   $u=(string)($r['student_uid']??'');if($u==='')continue;
   $c=&$checks[$u];$c=$c??['n'=>0,'full'=>0,'last'=>0,'name'=>'','role'=>'student','type'=>'','part'=>'','days'=>[]];$c['n']++;
   $c['days'][sp_day((int)$r['created_at'])]=1;
   if((int)$r['created_at']>=$c['last']){$c['name']=(string)($r['student_name']??'');$c['role']=(string)($r['role']??'student');$c['type']=(string)($r['type_id']??'');$c['part']=(string)($r['part_id']??'');}
   if(($r['score']??null)!==null&&$r['score']===$r['max_marks'])$c['full']++;
   $c['last']=max($c['last'],(int)$r['created_at']);unset($c);
  }
  $people=[];$feed=[];$k=['online'=>0,'today'=>0,'week'=>0,'tracked'=>0,'masteryToday'=>0,'mastered'=>0,'checksToday'=>0];
  $today=sp_day($now);
  foreach(sp_people($cfg) as $p){
   if($who==='students'&&$p['role']!=='student')continue;
   $ms=sp_mastery_summary($p);$ch=$checks[$p['uid']]??['n'=>0,'full'=>0,'last'=>0];
   // Active days count page visits and checked answers.
   $active=$p['days']+($ch['days']??[]);$days30=0;foreach($active as $d=>$n)if($d>=sp_day($now-30*86400))$days30++;
   $online=$now-(int)$p['last_seen']<=SP_ONLINE;
   $k['tracked']++;if($online)$k['online']++;if(isset($p['days'][$today]))$k['today']++;
   if($now-(int)$p['last_seen']<=7*86400)$k['week']++;$k['mastered']+=$ms['mastered'];
   $people[]=['uid'=>$p['uid'],'name'=>$p['name'],'role'=>$p['role'],'classes'=>$p['classes']??[],'online'=>$online,
    'lastSeen'=>(int)$p['last_seen'],'firstSeen'=>(int)$p['first_seen'],'visits'=>(int)$p['visits'],'pageViews'=>(int)$p['page_views'],
    'daysActive30'=>$days30,'current'=>$p['current']??null,'mastery'=>$ms,'checks'=>['n'=>$ch['n'],'full'=>$ch['full'],'last'=>$ch['last']]];
   foreach(array_slice($p['recent'],0,8) as $r)$feed[]=['at'=>(int)$r['at'],'kind'=>'page','uid'=>$p['uid'],'name'=>$p['name'],'place'=>$r];
  }
  // Students seen only through "Check my answer" (before or without a page open since tracking began).
  $known=array_flip(array_column($people,'uid'));
  foreach($checks as $u=>$c){
   if(isset($known[$u])||($who==='students'&&$c['role']!=='student'))continue;
   $online=$now-$c['last']<=SP_ONLINE;$k['tracked']++;if($online)$k['online']++;
   if(sp_day($c['last'])===$today)$k['today']++;if($now-$c['last']<=7*86400)$k['week']++;
   $people[]=['uid'=>$u,'name'=>$c['name']?:'Unnamed account','role'=>$c['role'],'classes'=>[],'online'=>$online,'lastSeen'=>$c['last'],'firstSeen'=>0,
    'visits'=>0,'pageViews'=>0,'daysActive30'=>count(array_filter(array_keys($c['days']),static function($d)use($now){return $d>=sp_day($now-30*86400);})),'current'=>['kind'=>'practice','title'=>'Checked an answer','type'=>$c['type'],'path'=>'/igcsehumanbiology/'],
    'mastery'=>sp_mastery_summary([]),'checks'=>['n'=>$c['n'],'full'=>$c['full'],'last'=>$c['last']],'checksOnly'=>true];
  }
  foreach(sp_lines(sp_dir($cfg),'mastery',$now-14*86400,static function(array $r)use($who){return $who==='all'||$r['role']==='student';}) as $r){
   if(sp_day((int)$r['created_at'])===$today)$k['masteryToday']++;
   $feed[]=['at'=>(int)$r['created_at'],'kind'=>'mastery','uid'=>$r['uid'],'name'=>$r['name'],'block'=>$r['block'],'title'=>$r['title'],'score'=>$r['score'],'total'=>$r['total'],'pct'=>$r['pct'],'band'=>$r['band']];
  }
  foreach(sp_lines(sp_marking_dir($cfg),'attempts',$now-3*86400,static function(array $r)use($who){return $who==='all'||($r['role']??'')==='student';}) as $r){
   if(sp_day((int)$r['created_at'])===$today)$k['checksToday']++;
   $feed[]=['at'=>(int)$r['created_at'],'kind'=>'check','uid'=>$r['student_uid'],'name'=>$r['student_name'],'part'=>$r['part_id'],'type'=>$r['type_id']??'','score'=>$r['score'],'max'=>$r['max_marks'],'mode'=>$r['mode']??''];
  }
  usort($feed,static function($a,$b){return $b['at']<=>$a['at'];});
  usort($people,static function($a,$b){return $b['lastSeen']<=>$a['lastSeen'];});
  sp_json(['now'=>$now,'who'=>$who,'kpis'=>$k,'people'=>$people,'feed'=>array_slice($feed,0,80)]);
 }elseif($action==='student'){
  if(!$staff)throw new TmError('Teacher access is required.',403);
  $uid=(string)($_GET['uid']??'');
  if(!preg_match('/^[\x21-\x7e]{1,128}$/D',$uid))throw new TmError('Invalid student.');
  $f=sp_person_file($cfg,$uid);$p=is_file($f)?json_decode((string)file_get_contents($f),true):null;
  $since=time()-120*86400;
  if(!is_array($p)){
   $rows=sp_lines(sp_marking_dir($cfg),'attempts',$since,static function(array $r)use($uid){return ($r['student_uid']??'')===$uid;});
   if(!$rows)throw new TmError('No activity has been recorded for this student yet.',404);
   $last=end($rows);
   $p=['uid'=>$uid,'name'=>(string)($last['student_name']??'Unnamed account'),'role'=>(string)($last['role']??'student'),'classes'=>[],'first_seen'=>(int)$rows[0]['created_at'],
    'last_seen'=>(int)$last['created_at'],'visits'=>0,'page_views'=>0,'days'=>[],'recent'=>[],'mastery'=>[],'device_mastery'=>[],
    'current'=>['kind'=>'practice','title'=>'Checked an answer','type'=>(string)($last['type_id']??''),'path'=>'/igcsehumanbiology/']];
  }
  $attempts=array_reverse(sp_lines(sp_dir($cfg),'mastery',$since,static function(array $r)use($uid){return $r['uid']===$uid;}));
  $checks=array_reverse(sp_lines(sp_marking_dir($cfg),'attempts',$since,static function(array $r)use($uid){return ($r['student_uid']??'')===$uid;}));
  sp_json(['now'=>time(),'person'=>$p,'summary'=>sp_mastery_summary($p),'attempts'=>array_slice($attempts,0,200),'checks'=>array_slice($checks,0,300)]);
 }else throw new TmError('Unknown progress action.',404);
}catch(TmError $e){if(!headers_sent())sp_json(['error'=>$e->getMessage()],$e->status);}
catch(Throwable $e){if(!headers_sent())sp_json(['error'=>'Progress tracking is temporarily unavailable.']+((isset($staff)&&$staff)?['detail'=>get_class($e).': '.mb_substr($e->getMessage(),0,300)]:[]),503);}
