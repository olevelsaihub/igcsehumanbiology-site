<?php
declare(strict_types=1);
final class TmError extends RuntimeException {
 public $status;
 public function __construct(string $message, int $status=400) {parent::__construct($message);$this->status=$status;}
}
// Keep recording validation compatible with the hosting account's PHP 7.4.
function tm_is_list(array $value): bool {
 return $value === [] || array_keys($value) === range(0, count($value)-1);
}
function tm_id($id): string {
 if (!is_string($id)||!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/D',$id)) throw new TmError('Invalid recording identifier.');
 return $id;
}
function tm_text($value, int $limit=200): string {
 if (!is_string($value)||trim($value)===''||mb_strlen($value)>$limit||preg_match('/[\x00-\x08\x0b-\x1f\x7f]/',$value)) throw new TmError('Enter a valid text value.');
 return trim($value);
}
function tm_type($key, array $catalog): array {
 if (!is_string($key)||!isset($catalog[$key])) throw new TmError('Unknown question type.',404);
 return $catalog[$key];
}
function tm_number($v, float $min, float $max): float {
 if ((!is_int($v)&&!is_float($v))||!is_finite((float)$v)||$v<$min||$v>$max) throw new TmError('Invalid number in recording.');
 return (float)$v;
}
function tm_manifest(array $input, array $catalog, bool $admin): array {
 $type=tm_type($input['typeKey']??null,$catalog);
 $source=$input['sourceKind']??'teacher';
 if (!in_array($source,['teacher','self'],true)||($source==='self'&&!$admin)) throw new TmError('Only an administrator can publish self-explanations.',403);
 $kind=$input['kind']??'';
 if (!in_array($kind,['board','video'],true)) throw new TmError('Choose a whiteboard recording or a video.');
 $question=null;
 foreach ($type['questions'] as $q) if (($input['question']['id']??'')===$q['id']) $question=$q;
 if (!$question) throw new TmError('Choose a question belonging to this type.');
 $duration=tm_number($input['duration']??null,.01,14400);
 if (!is_array($input['steps']??null) || !tm_is_list($input['steps'])) throw new TmError('Steps must be an ordered array.');
 $steps=[];$end=0.;
 foreach (($input['steps']??[]) as $i=>$s) {
  if (!is_array($s)||count($steps)>=200) throw new TmError('Invalid recording steps.');
  if (isset($s['number']) && $s['number'] !== $i+1) throw new TmError('Step numbers must be consecutive.');
  $start=tm_number($s['start']??null,0,$duration);$next=tm_number($s['end']??null,.01,$duration+.1);
  if (abs($start-$end)>.02||$next<=$start) throw new TmError('Steps must be consecutive with no pause gaps.');
  $entry=['number'=>$i+1,'title'=>tm_text($s['title']??('Step '.($i+1))), 'start'=>$start,'end'=>$next];if($kind==='board'){if(isset($s['audioExpected'])&&!is_bool($s['audioExpected']))throw new TmError('Invalid voice metadata.');$entry['audioExpected']=$s['audioExpected']??true;}$steps[]=$entry;$end=$next;
 }
 if (!$steps||abs($end-$duration)>.1) throw new TmError('Steps must cover the complete recording.');
 $height=(int)tm_number($input['boardHeight']??1000,1000,12000);
 $events=$input['events']??[];
 if (!is_array($events)||count($events)>30000||strlen(json_encode($events))>6000000) throw new TmError('This whiteboard recording is too large.');
 // Rendering data is never HTML or executable script. Authored image URLs have a fixed allowlist.
 $last=0;
 foreach ($events as $e) {
  $t=tm_number($e['t']??null,0,$duration*1000+100);
  if ($t<$last||!in_array($e['kind']??'',['snapshot','stroke','viewport','cursor'],true)) throw new TmError('Invalid drawing timeline.');$last=$t;
  if($e['kind']==='cursor'){tm_number($e['x']??null,-100,1500);tm_number($e['y']??null,-100,$height+100);if(!is_bool($e['visible']??null))throw new TmError('Invalid pointer visibility.');continue;}
  if($e['kind']==='viewport'){tm_number($e['y']??null,0,$height);continue;}
  $strokes=$e['kind']==='snapshot'?($e['strokes']??null):[$e['stroke']??null];
  if (!is_array($strokes)||count($strokes)>10000) throw new TmError('Invalid drawing.');
  foreach($strokes as $s) {
   if (!is_array($s)) throw new TmError('Invalid drawing.');
   if (isset($s['src'])&&!in_array($s['src'],['assets/brand/olevels-logo.png',$question['image']],true)) throw new TmError('Untrusted drawing image.');
   if(isset($s['cropY'])||isset($s['cropH'])){tm_number($s['cropY']??null,0,1);tm_number($s['cropH']??null,.001,1);if($s['cropY']+$s['cropH']>1.00001)throw new TmError('Invalid question image slice.');}
   if (count($s['points']??[])>150000) throw new TmError('Drawing has too many points.');
   foreach(($s['points']??[]) as $p) {tm_number($p['x']??null,-10000,10000);tm_number($p['y']??null,-10000,12000);if(isset($p['t']))tm_number($p['t'],0,$duration*1000+100);}
  }
 }
 $result=['id'=>tm_id($input['id']??null),'typeKey'=>$type['typeKey'],'title'=>tm_text($input['title']??null),
  'sourceKind'=>$source,'kind'=>$kind,'manifestVersion'=>2,'duration'=>$duration,'question'=>$question,
  'steps'=>$steps,'events'=>$events,'boardHeight'=>$height,'sceneOwnsQuestion'=>($input['sceneOwnsQuestion']??false)===true];
 if(!array_key_exists('boardHeight',$input))unset($result['boardHeight']);
 if(isset($input['tracks'])){
  if(!$admin||$source!=='self'||$kind!=='video'||!is_array($input['tracks'])||count($input['tracks'])!==2)throw new TmError('Language tracks require a paired self-explanation.');
  $tracks=[];
  foreach(['ur','en']as$lang){
   $track=$input['tracks'][$lang]??null;if(!is_array($track))throw new TmError('Both language tracks are required.');
   if (!is_array($track['steps']??null) || !tm_is_list($track['steps'])) throw new TmError('Language steps must be an ordered array.');
   $d=tm_number($track['duration']??null,.01,14400);$ss=[];$end=0.;
   foreach(($track['steps']??[])as$i=>$s){
    if(!is_array($s)||count($ss)>=count($steps))throw new TmError('Language steps must match the lesson.');
    if (isset($s['number']) && $s['number'] !== $i+1) throw new TmError('Language step numbers must be consecutive.');
    $a=tm_number($s['start']??null,0,$d);$b=tm_number($s['end']??null,.01,$d+.1);
    if(abs($a-$end)>.02||$b<=$a)throw new TmError('Language steps must be consecutive.');
    $ss[]=['number'=>$i+1,'title'=>$steps[$i]['title'],'start'=>$a,'end'=>$b];$end=$b;
   }
   if(count($ss)!==count($steps)||abs($end-$d)>.1)throw new TmError('Language steps must cover the whole lesson.');
   $tracks[$lang]=['language'=>$lang,'duration'=>$d,'steps'=>$ss,'teacherPointer'=>true];
  }
  if(abs($tracks['ur']['duration']-$duration)>.01||$tracks['ur']['steps']!==$steps)throw new TmError('The default timeline must be Urdu.');
  $result['tracks']=$tracks;$result['language']='ur';$result['defaultTrack']='ur';$result['captionsDefault']=false;
 }
 return $result;
}
function tm_objects($input, array $manifest, string $prefix): array {
 if (!is_array($input) || !tm_is_list($input) || count($input)>201) throw new TmError('Invalid recording media.');
 $expected=[];
 if ($manifest['kind']==='video') {
  $expected=isset($manifest['tracks'])
   ? ['video'=>['video/mp4'],'captions'=>['text/vtt'],'transcript'=>['text/plain'],'video-en'=>['video/mp4'],'captions-en'=>['text/vtt'],'transcript-en'=>['text/plain']]
   : ['video'=>['video/mp4','video/webm','video/quicktime']];
 } else foreach ($manifest['steps'] as $i=>$step) if($step['audioExpected']??true)$expected['step-'.($i+1)]=['audio/mp4','audio/webm','audio/ogg'];
 $objects=[];$total=0;$seen=[];
 foreach ($input as $object) {
  if (!is_array($object) || !is_string($object['slot']??null)) throw new TmError('Invalid media slot.');
  $slot=$object['slot'];$mime=$object['mime']??null;$bytes=$object['bytes']??null;
  if (isset($seen[$slot]) || !isset($expected[$slot]) || !in_array($mime,$expected[$slot],true)) throw new TmError('Unsupported or duplicate recording media.');
  if (!is_int($bytes) || $bytes<1 || $bytes>536870912) throw new TmError('Invalid media size.');
  $total+=$bytes;$seen[$slot]=true;
  $objects[]=['slot'=>$slot,'mime'=>$mime,'bytes'=>$bytes,'object_key'=>$prefix.$manifest['id'].'/'.$slot];
 }
 if (count($seen)!==count($expected) || $total>1073741824) throw new TmError('Every recording step and language file is required.');
 return $objects;
}
function tm_blocked_until(array $rows, array $context, array $type, int $now): ?int {
 if ($context['role']!=='student') return null;
 $until=null;
 foreach($rows as $r) {
  if ($r['revoked_at']!==null||(int)$r['starts_at']>$now||(int)$r['expires_at']<=$now) continue;
  if (!in_array($r['class_key'],$context['memberships'],true)) continue;
  if ($r['student_key']!==null&&$r['student_key']!==$context['studentKey']) continue;
  if ($r['topic_id']!==null&&(int)$r['topic_id']!==($type['topicId']??null)) continue;
  if ($r['type_key']!==null&&$r['type_key']!==$type['typeKey']) continue;
  $until=max($until??0,(int)$r['expires_at']);
 }
 return $until;
}
// Rows arrive newest first. A learning pass uses one machine explanation per type,
// or the newest teacher recording when no machine explanation is available.
// Library totals include every available alternative; no media URLs leave here.
function tm_video_inventory(array $rows,array $rules,array $context,array $catalog,array $plans,int $now):array {
 $byType=[];$blocked=[];
 foreach($catalog as$key=>$type)$blocked[$key]=tm_blocked_until($rules,$context,$type,$now)!==null;
 foreach($rows as$row){
  $key=$row['type_key'];if(!isset($catalog[$key])||$blocked[$key])continue;
  $manifest=json_decode($row['manifest'],true);$duration=$manifest['duration']??null;
  if(!is_numeric($duration)||!is_finite((float)$duration)||(float)$duration<=0)continue;
  if(!isset($byType[$key]))$byType[$key]=['videos'=>0,'seconds'=>0.0,'passSeconds'=>(float)$duration,'machine'=>false];
  $item=&$byType[$key];$item['videos']++;$item['seconds']+=(float)$duration;
  if($row['source_kind']==='self'&&!$item['machine']){$item['passSeconds']=(float)$duration;$item['machine']=true;}
  unset($item);
 }
 $sum=static function(array $keys)use($byType,$blocked,$catalog):array{
  $keys=array_values(array_filter(array_unique($keys),static fn($key)=>isset($catalog[$key])));
  $s=['typeCount'=>count($keys),'availableTypes'=>0,'videoCount'=>0,'seconds'=>0.0,'passSeconds'=>0.0,'restrictedTypes'=>0];
  foreach($keys as$key){if($blocked[$key])$s['restrictedTypes']++;if(!isset($byType[$key]))continue;
   $s['availableTypes']++;$s['videoCount']+=$byType[$key]['videos'];$s['seconds']+=$byType[$key]['seconds'];$s['passSeconds']+=$byType[$key]['passSeconds'];}
  $s['seconds']=round($s['seconds'],3);$s['passSeconds']=round($s['passSeconds'],3);return $s;
 };
 $totals=[];foreach($plans as$plan)$totals[]=array_intersect_key($plan,array_flip(['id','name','href']))+$sum($plan['typeKeys']);
 return ['types'=>array_keys($byType),'summary'=>['plans'=>$totals,'course'=>$sum(array_keys($catalog))]];
}
function tm_restriction(array $input,array $context,array $catalog,array $roster,int $now): array {
 $class=tm_text($input['classKey']??null,180);
 if (!in_array($class,$context['managedClasses'],true)) throw new TmError('You cannot manage this class.',403);
 $hours=tm_number($input['hours']??null,1/60,168);
 $scope=$input['scope']??'';$topic=null;$type=null;
 if ($scope==='type') {$type=tm_type($input['typeKey']??null,$catalog)['typeKey'];}
 elseif ($scope==='topic') {
  $topic=$input['topicId']??null;
  if (!is_int($topic)||!in_array($topic,array_column($catalog,'topicId'),true)) throw new TmError('Unknown Human Biology topic.');
 } elseif ($scope!=='course') throw new TmError('Choose the access scope.');
 $students=$input['students']??null;
 if (!is_array($students)||count($students)>500) throw new TmError('Choose the students.');
 if (!$students&&($input['wholeClass']??false)!==true) throw new TmError('Select students or choose the whole class.');
 foreach($students as $key) if(!is_string($key)||!in_array($key,$roster,true)) throw new TmError('A selected student is not in this class.',403);
 return ['class_key'=>$class,'topic_id'=>$topic,'type_key'=>$type,'students'=>$students?array_values(array_unique($students)):[null], 'starts_at'=>$now,'expires_at'=>$now+(int)ceil($hours*3600)];
}
