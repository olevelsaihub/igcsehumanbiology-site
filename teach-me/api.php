<?php
declare(strict_types=1);
ini_set('display_errors','0');ini_set('log_errors','0');
require_once __DIR__.'/crawler-policy.php';olv_crawler_guard();
if (strpos((string)($_GET['action']??''),'releases-')===0) {
 $_GET['action']=substr((string)$_GET['action'],9);
 require __DIR__.'/../releases/api.php';
 exit;
}
if (strpos((string)($_GET['action']??''),'feedback-')===0) {
 $_GET['action']=substr((string)$_GET['action'],9);
 require __DIR__.'/../feedback/api.php';
 exit;
}
require_once __DIR__.'/domain.php';require_once __DIR__.'/cache.php';require_once __DIR__.'/storage.php';require_once __DIR__.'/session.php';
function tm_json($data,int $status=200): void {http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_SLASHES|JSON_INVALID_UTF8_SUBSTITUTE);}
function tm_staff(array $ctx):void{if(!in_array($ctx['role'],['admin','teacher'],true))throw new TmError('Teacher access is required.',403);}
function tm_one(PDO $db,string $sql,array $args):?array{$q=$db->prepare($sql);$q->execute($args);return $q->fetch(PDO::FETCH_ASSOC)?:null;}
function tm_rows(PDO $db,string $sql,array $args=[]):array{$q=$db->prepare($sql);$q->execute($args);return $q->fetchAll(PDO::FETCH_ASSOC);}
function tm_check(PDO $db,array $ctx,array $type):void{
 $until=tm_blocked_until(tm_rows($db,'SELECT * FROM hb_tm_restrictions WHERE revoked_at IS NULL AND expires_at>?',[time()]),$ctx,$type,time());
 if($until!==null)throw new TmError('Your teacher has paused explanations for this topic until '.gmdate('Y-m-d H:i',$until).' UTC.',423);
}
function tm_view(PDO $db,array $row):array{
 $v=json_decode($row['manifest'],true);$v['createdAt']=gmdate('c',(int)$row['created_at']);$v['canArchive']=false;
 $objects=tm_cached_rows($db,'SELECT slot,generation FROM hb_tm_objects WHERE recording_id=?',[$row['id']]);
 foreach($objects as$o){$url='api.php?action=media&id='.rawurlencode($row['id']).'&slot='.rawurlencode($o['slot']);if($o['slot']==='video')$v['url']=$url;elseif($o['slot']==='captions')$v['captionsURL']=$url;elseif($o['slot']==='transcript')$v['transcriptURL']=$url;elseif(preg_match('/^step-(\d+)$/D',$o['slot'],$m))$v['steps'][(int)$m[1]-1]['audioURL']=$url;}
 if(isset($v['tracks'])){
  foreach($objects as$o){
   if(!$o['generation'])continue;
   if(!preg_match('/^(video|captions|transcript)(-en)?$/D',$o['slot'],$m))continue;
   $lang=isset($m[2])?'en':'ur';$field=['video'=>'url','captions'=>'captionsURL','transcript'=>'transcriptURL'][$m[1]];
   $v['tracks'][$lang][$field]='api.php?action=media&id='.rawurlencode($row['id']).'&slot='.rawurlencode($o['slot']);
  }
 }
 return $v;
}
try{
 header('Cache-Control: private, no-store, max-age=0');header('CDN-Cache-Control: no-store');header('Cloudflare-CDN-Cache-Control: no-store');header('X-Content-Type-Options: nosniff');header('Referrer-Policy: same-origin');
 if(($_SERVER['HTTPS']??'')!=='on')throw new TmError('HTTPS is required.',503);
 $cfg=hb_config();
 if (($cfg['course_id']??0)<1 || empty($cfg['dsn']) || empty($cfg['db_user'])) throw new TmError('Human Biology teaching services are not configured yet.',503);
 if(($cfg['origin']??'')!=='https://apps.olevels.com')throw new TmError('Invalid release configuration.',503);
 $db=new PDO($cfg['dsn'],$cfg['db_user'],$cfg['db_password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);
 $ctx=tm_context($db,$cfg);$csrf=$_SESSION['csrf'];session_write_close();
 $catalogData=json_decode((string)file_get_contents(__DIR__.'/catalog.json'),true);$catalog=$catalogData['types'];
 $action=$_GET['action']??'context';$method=$_SERVER['REQUEST_METHOD']??'GET';
 if(in_array($action,['ask-ai-status','ask-ai','ask-ai-reset'],true)){
  require_once __DIR__.'/ask-ai.php';
  tm_json(hb_ai_action($action,$cfg,$ctx,$csrf,$db));exit;
 }
 $writes=['create','upload-session','publish','archive','restrict','restore','assign-teacher','refresh-topics'];
 if(in_array($action,$writes,true)){
  tm_staff($ctx);
  if($method!=='POST')throw new TmError('Use POST for changes.',405);
  if(($_SERVER['HTTP_ORIGIN']??'')!==$cfg['origin']||!hash_equals($csrf,$_SERVER['HTTP_X_CSRF_TOKEN']??''))throw new TmError('Session expired. Refresh before saving.',403);
  if((int)($_SERVER['CONTENT_LENGTH']??0)>8000000)throw new TmError('Recording data is too large.',413);
  $raw=file_get_contents('php://input',false,null,0,8000001);if(strlen($raw)>8000000)throw new TmError('Recording data is too large.',413);
  $input=json_decode($raw,true);if(!is_array($input))throw new TmError('Invalid request.');
 }elseif(!in_array($method,['GET','HEAD'],true))throw new TmError('Unsupported method.',405);
 if($action==='context'){
  // One inventory query for the whole page; never issue a request for every type.
  $now=time();$rules=$ctx['role']==='student'?tm_rows($db,'SELECT * FROM hb_tm_restrictions WHERE revoked_at IS NULL AND expires_at>?',[$now]):[];
  $rows=tm_cached_rows($db,'SELECT type_key,source_kind,manifest FROM hb_tm_recordings WHERE state=? AND source_kind IN (?,?) ORDER BY published_at DESC,id ASC',['ready','self','teacher']);
  $inventory=tm_video_inventory($rows,$rules,$ctx,$catalog,$catalogData['videoPlans']??[],$now);
  tm_json(['uid'=>$ctx['uid'],'role'=>$ctx['role'],'name'=>$ctx['name'],'managedClasses'=>$ctx['managedClasses'],'classTopics'=>$ctx['classTopics']??[],'explanationTypes'=>$inventory['types'],'videoSummary'=>$inventory['summary'],'csrf'=>$csrf]);
 }
 elseif($action==='refresh-topics'){
  $path=olv_topic_cache_file();if($path&&is_file($path)){$cache=json_decode((string)file_get_contents($path),true);if(is_array($cache)){$cache['checkedAt']=0;$cache['fullScanAt']=0;$tmp=$path.'.refresh.'.bin2hex(random_bytes(4));file_put_contents($tmp,json_encode($cache),LOCK_EX);chmod($tmp,0600);rename($tmp,$path);}}
  session_start();unset($_SESSION['checked']);session_write_close();tm_json(['refresh'=>true]);
 }
 elseif($action==='list'){
  $type=tm_type($_GET['type']??null,$catalog);tm_check($db,$ctx,$type);
  $rows=tm_cached_rows($db,'SELECT * FROM hb_tm_recordings WHERE type_key=? AND state=? ORDER BY published_at DESC',[$type['typeKey'],'ready']);
  tm_json(['recordings'=>array_map(static function($r)use($ctx){$m=json_decode($r['manifest'],true);return ['id'=>$r['id'],'title'=>$r['title'],'sourceKind'=>$r['source_kind'],'duration'=>$m['duration'],'steps'=>count($m['steps']),'createdAt'=>gmdate('c',(int)$r['created_at']),'canArchive'=>$ctx['role']==='admin'||$ctx['uid']===$r['owner_uid']];},$rows)]);
 }
 elseif($action==='manifest'||$action==='media'){
  $id=tm_id($_GET['id']??null);$row=tm_cached_rows($db,'SELECT * FROM hb_tm_recordings WHERE id=? AND state=?',[$id,'ready'])[0]??null;if(!$row)throw new TmError('Recording not found.',404);
  tm_check($db,$ctx,tm_type($row['type_key'],$catalog));
  if($action==='manifest')tm_json(tm_view($db,$row));
  else{$o=tm_cached_rows($db,'SELECT * FROM hb_tm_objects WHERE recording_id=? AND slot=?',[$id,$_GET['slot']??''])[0]??null;if(!$o||!$o['generation'])throw new TmError('Media not found.',404);(new TmStorage($cfg))->stream($o,$method==='HEAD');}
 }
 elseif($action==='create'){
  $v=tm_manifest($input['manifest']??[],$catalog,$ctx['role']==='admin');
  $objects=tm_objects($input['objects']??null,$v,$cfg['media_prefix']);
  $hash=hash('sha256',json_encode([$v,$objects]));
  $old=tm_one($db,'SELECT * FROM hb_tm_recordings WHERE id=?',[$v['id']]);
  if($old){if($old['owner_uid']!==$ctx['uid']||$old['request_hash']!==$hash)throw new TmError('This recording ID already belongs to a different take.',409);tm_json(['id'=>$v['id'],'state'=>$old['state']]);}
  else{
   if($objects)(new TmStorage($cfg))->assertAvailable();
   $db->beginTransaction();$q=$db->prepare('INSERT INTO hb_tm_recordings(id,type_key,owner_uid,title,source_kind,state,manifest,request_hash,created_at) VALUES(?,?,?,?,?,?,?,?,?)');$q->execute([$v['id'],$v['typeKey'],$ctx['uid'],$v['title'],$v['sourceKind'],'uploading',json_encode($v),$hash,time()]);
   $q=$db->prepare('INSERT INTO hb_tm_objects(recording_id,slot,object_key,mime,bytes) VALUES(?,?,?,?,?)');foreach($objects as$o)$q->execute([$v['id'],$o['slot'],$o['object_key'],$o['mime'],$o['bytes']]);$db->commit();tm_json(['id'=>$v['id'],'state'=>'uploading'],201);
  }
 }
 elseif(in_array($action,['upload-session','publish','archive'],true)){
  $id=tm_id($input['id']??null);$r=tm_one($db,'SELECT * FROM hb_tm_recordings WHERE id=?',[$id]);if(!$r)throw new TmError('Recording not found.',404);
  if($ctx['uid']!==$r['owner_uid']&&$ctx['role']!=='admin')throw new TmError('You cannot change this recording.',403);
  if($action==='archive'){$q=$db->prepare('UPDATE hb_tm_recordings SET state=?,archived_at=? WHERE id=?');$q->execute(['archived',time(),$id]);tm_cache_invalidate();tm_json(['archived'=>true]);}
  elseif($action==='upload-session'){
   if($r['state']!=='uploading')throw new TmError('This recording is already finalized.',409);
   $o=tm_one($db,'SELECT * FROM hb_tm_objects WHERE recording_id=? AND slot=?',[$id,$input['slot']??'']);if(!$o)throw new TmError('Media slot not found.',404);
   $storage=new TmStorage($cfg);try{$meta=$storage->metadata($o);$complete=(int)($meta['size']??0)===(int)$o['bytes']&&($meta['contentType']??'')===$o['mime'];}catch(TmError $e){$complete=false;}
   tm_json($complete?['complete'=>true]:['url'=>$storage->start($o)]);
  }else{
   if($r['state']==='ready'){tm_json(['ready'=>true]);}
   elseif($r['state']!=='uploading')throw new TmError('This recording is no longer publishable.',409);
   else{
    $storage=new TmStorage($cfg);$objects=tm_rows($db,'SELECT * FROM hb_tm_objects WHERE recording_id=?',[$id]);if($objects)$storage->assertAvailable();
    foreach($objects as&$o){$meta=$storage->metadata($o);if((int)($meta['size']??0)!==(int)$o['bytes']||($meta['contentType']??'')!==$o['mime']||!preg_match('/^\d+$/D',$meta['generation']??''))throw new TmError('Upload is incomplete. Retry saving.',409);$o['generation']=$meta['generation'];}unset($o);
    $db->beginTransaction();$locked=tm_one($db,'SELECT state FROM hb_tm_recordings WHERE id=? FOR UPDATE',[$id]);if(!$locked||!in_array($locked['state'],['uploading','ready'],true))throw new TmError('This recording is no longer publishable.',409);$q=$db->prepare('UPDATE hb_tm_objects SET generation=? WHERE recording_id=? AND slot=?');foreach($objects as$o)$q->execute([$o['generation'],$id,$o['slot']]);$q=$db->prepare('UPDATE hb_tm_recordings SET state=?,published_at=? WHERE id=? AND state=?');$q->execute(['ready',time(),$id,'uploading']);$db->commit();tm_cache_invalidate();tm_json(['ready'=>true]);
   }
  }
 }
 elseif($action==='roster'){tm_staff($ctx);tm_json(['students'=>tm_roster(tm_text($_GET['class']??null,180),$ctx)]);}
 elseif($action==='restrictions'){
  tm_staff($ctx);$rows=tm_rows($db,'SELECT * FROM hb_tm_restrictions WHERE revoked_at IS NULL AND expires_at>? ORDER BY expires_at',[time()]);tm_json(['restrictions'=>array_values(array_filter($rows,static function($r)use($ctx){return in_array($r['class_key'],$ctx['managedClasses'],true);}))]);
 }
 elseif($action==='restrict'){
  $input['scope']='course';unset($input['topicId'],$input['typeKey']);$class=tm_text($input['classKey']??null,180);$roster=tm_roster($class,$ctx);$r=tm_restriction($input,$ctx,$catalog,$roster,time());
  $db->beginTransaction();$q=$db->prepare('INSERT INTO hb_tm_restrictions(id,class_key,student_key,topic_id,type_key,created_by,starts_at,expires_at) VALUES(?,?,?,?,?,?,?,?)');
  foreach($r['students']as$s){$b=random_bytes(16);$b[6]=chr((ord($b[6])&15)|64);$b[8]=chr((ord($b[8])&63)|128);$h=bin2hex($b);$id=substr($h,0,8).'-'.substr($h,8,4).'-'.substr($h,12,4).'-'.substr($h,16,4).'-'.substr($h,20);$q->execute([$id,$class,$s,$r['topic_id'],$r['type_key'],$ctx['uid'],$r['starts_at'],$r['expires_at']]);}
  $db->commit();tm_json(['expiresAt'=>$r['expires_at']]);
 }
 elseif($action==='restore'){
  $id=tm_id($input['id']??null);$r=tm_one($db,'SELECT * FROM hb_tm_restrictions WHERE id=?',[$id]);if(!$r||!in_array($r['class_key'],$ctx['managedClasses'],true)||($ctx['role']!=='admin'&&$r['created_by']!==$ctx['uid']))throw new TmError('You cannot change this class restriction.',403);
  $q=$db->prepare('UPDATE hb_tm_restrictions SET revoked_at=?,revoked_by=? WHERE id=? AND revoked_at IS NULL');$q->execute([time(),$ctx['uid'],$id]);tm_json(['restored'=>true]);
 }
 elseif($action==='assign-teacher'){
  if($ctx['role']!=='admin')throw new TmError('Administrator access required.',403);
  $class=tm_text($input['classKey']??null,180);$uid=tm_text($input['teacherUid']??null,100);
  if(!in_array($class,$ctx['classes'],true)||!preg_match('/^teacher_[1-9]\d*$/D',$uid))throw new TmError('Select an active Human Biology class and verified teacher UID.');
  $q=$db->prepare('INSERT INTO hb_tm_class_teachers(class_key,teacher_uid,assigned_by,assigned_at) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE assigned_by=VALUES(assigned_by),assigned_at=VALUES(assigned_at)');$q->execute([$class,$uid,$ctx['uid'],time()]);tm_json(['assigned'=>true]);
 }
 else throw new TmError('Unknown Teach Me action.',404);
}catch(TmError $e){if(isset($db)&&$db->inTransaction())$db->rollBack();if(!headers_sent())tm_json(['error'=>$e->getMessage()],$e->status);}
catch(Throwable $e){if(isset($db)&&$db->inTransaction())$db->rollBack();if(!headers_sent())tm_json(['error'=>'Teach Me is temporarily unavailable. Your unsaved take remains in this browser.'],503);}
