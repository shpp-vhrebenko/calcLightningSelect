<?php 
define('LOG_DATA', 'loggi/loggi.txt');
date_default_timezone_set('europe/kiev');

function addLogg($proces,$status, $message="message"){
  $today = time() + 3600;
  $dateLogg = date("Y-m-d H:i:s",$today); 
  $logMessage = "[".$dateLogg."]"." /  action: ". $proces ." / status: ". $status." / message: ".$message."\n";
  file_put_contents(LOG_DATA, $logMessage, FILE_APPEND);
}

?>