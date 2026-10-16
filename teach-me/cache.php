<?php
declare(strict_types=1);
// Cache only reusable recording data on the server. Identity and restrictions stay live.
const TM_CACHE_VERSION='human-biology-player-v1-20260917';
const TM_CACHE_TTL=604800;
function tm_cache_dir():string{return hb_config()['private_dir'].'/library-cache';}
function tm_cache_epoch():string{
 $dir=tm_cache_dir();if(!is_dir($dir))@mkdir($dir,0700,true);
 return TM_CACHE_VERSION.':'.(string)@file_get_contents($dir.'/epoch');
}
function tm_cache_invalidate():void{
 $dir=tm_cache_dir();if(!is_dir($dir))@mkdir($dir,0700,true);
 $tmp=$dir.'/epoch.'.bin2hex(random_bytes(6));
 if(@file_put_contents($tmp,bin2hex(random_bytes(16)),LOCK_EX)!==false){@chmod($tmp,0600);@rename($tmp,$dir.'/epoch');}
}
function tm_cache_read(string $file):?array{
 if(!is_file($file)||filemtime($file)<time()-TM_CACHE_TTL)return null;
 $entry=json_decode((string)@file_get_contents($file),true);
 return is_array($entry)&&isset($entry['rows'])&&is_array($entry['rows'])?$entry['rows']:null;
}
function tm_cached_rows(PDO $db,string $sql,array $args=[]):array{
 $epoch=tm_cache_epoch();$file=tm_cache_dir().'/'.hash('sha256',$epoch.json_encode([$sql,$args])).'.json';
 $saved=tm_cache_read($file);if($saved!==null)return $saved;
 $lock=@fopen($file.'.lock','c');
 if($lock)flock($lock,LOCK_EX);
 try{
  $saved=tm_cache_read($file);if($saved!==null)return $saved;
  $q=$db->prepare($sql);$q->execute($args);$rows=$q->fetchAll(PDO::FETCH_ASSOC);
  // Never publish an old query result into a newly invalidated cache namespace.
  if($epoch===tm_cache_epoch()){
   $tmp=$file.'.'.bin2hex(random_bytes(6));
   if(@file_put_contents($tmp,json_encode(['rows'=>$rows]),LOCK_EX)!==false){@chmod($tmp,0600);@rename($tmp,$file);}
  }
  return $rows;
 }finally{if($lock){flock($lock,LOCK_UN);fclose($lock);}}
}
