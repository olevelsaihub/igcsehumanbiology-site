<?php
declare(strict_types=1);
require_once __DIR__.'/auth-core.php';
function tm_context(PDO $db,array $cfg): array {
 session_name(hb_config()['teach_session']);ini_set('session.use_strict_mode','1');session_cache_limiter('');
 session_set_cookie_params(['lifetime'=>0,'path'=>hb_config()['base'],'secure'=>true,'httponly'=>true,'samesite'=>'Lax']);
 if(!session_start())throw new TmError('Session unavailable.',503);
 $fingerprint=hash('sha256',hb_config()['policy'].json_encode([$_COOKIE['teacher']??'',$_COOKIE['student']??'']));
 // Reuse verified access for the PHP session. Explicit class refresh clears checked.
 if(($_SESSION['fingerprint']??null)===$fingerprint&&is_int($_SESSION['checked']??null)&&$_SESSION['checked']>0&&$_SESSION['checked']<=time()&&is_array($_SESSION['context']??null))return $_SESSION['context'];
 unset($_SESSION['context']);
 $context=null;$unavailable=false;$denied=false;
 foreach(['teacher','student'] as $cookie){
  if(!is_string($_COOKIE[$cookie]??null))continue;
  $r=olv_run($_COOKIE[$cookie],$cookie,null,static function(array $claims,callable $firebase,array $topicInventory)use($db,$cfg):array{
   $role=$claims['role'];$uid=$claims['sub'];$classes=[];$members=[];$managed=[];$name=$claims['displayName']??'';
   foreach($topicInventory as $key=>$metadata){
    $classes[]=$key;
    if($role==='student'){$v=$firebase('topics/'.olv_path_key($key).'/students/'.olv_path_key($name),true);if(is_array($v)&&count($v))$members[]=$key;}
   }
   // Verified course staff manage the matching Firebase topic groups by default.
   if(in_array($role,['admin','teacher'],true))$managed=$classes;
   return ['uid'=>$uid,'role'=>$role,'name'=>$name,'studentKey'=>$role==='student'?$name:null,'memberships'=>$members,'managedClasses'=>$managed,'classes'=>$role==='admin'?$classes:[],'classTopics'=>array_values(array_intersect_key($topicInventory,array_flip($managed)))];
  });
  $unavailable=$unavailable||in_array($r['outcome'],['unverified','verification_failed','unavailable','error'],true);
  $denied=$denied||($r['outcome']==='no_membership_found');
  if(in_array($r['outcome'],['admin_confirmed','teacher_confirmed','membership_confirmed'],true)&&isset($r['teaching'])){$context=$r['teaching'];break;}
 }
 if(!$context&&$unavailable)throw new TmError('Course verification is unavailable. Try again.',503);
 if(!$context&&$denied)throw new TmError('No active Human Biology class membership was found.',403);
 if(!$context)throw new TmError('Sign in to the Human Biology course to continue.',401);
 if($context['role']==='student'&&!$context['memberships'])throw new TmError('No active Human Biology class membership was found.',403);
 if(($_SESSION['fingerprint']??null)!==$fingerprint){session_regenerate_id(true);$_SESSION['csrf']=bin2hex(random_bytes(32));}
 $_SESSION['csrf']=$_SESSION['csrf']??bin2hex(random_bytes(32));$_SESSION['fingerprint']=$fingerprint;$_SESSION['checked']=time();$_SESSION['context']=$context;
 return $context;
}
function tm_roster(string $key,array $context): array {
 if(!in_array($key,$context['managedClasses'],true))throw new TmError('You cannot manage this class.',403);
 $result=null;
 $r=olv_run($_COOKIE['teacher']??'','teacher',null,static function($claims,$firebase)use($key,&$result){$v=$firebase('topics/'.olv_path_key($key).'/students',true);if($v!==null&&!is_array($v))throw new OlvDiagnosticStop('Class roster unavailable.');$result=array_keys($v??[]);return [];});
 if(!in_array($r['outcome'],['admin_confirmed','teacher_confirmed'],true)||$result===null)throw new TmError('Class roster is unavailable. Try again.',503);
 return $result;
}
