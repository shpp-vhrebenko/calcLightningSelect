<?php 
require_once('configs/ftp_config.php');
require_once('configs/path_config.php');
require_once('configs/property_config.php');
require_once('classes/classCSV.php');
require_once('classes/classFTP.php');
require_once('functions/functions.php');
require_once('functions/functions_select_typeLamp.php');  
require_once('functions/get_select_typeLamp_mongoDB.php');
require_once('functions/upload_widget_data.php');
require_once('functions/add_loggi.php');

header("Content-type: text/html; charset=utf-8;");


date_default_timezone_set('UTC');
ini_set('max_execution_time', 600);
set_error_handler("customError");

try {
		if(isset($_POST["get_time_last_update"])) {
				$result["time"] = getLastTimeUpdateWidget(); 
				$time = date("d M Y H:i:s",$result["time"]);
				$str = "TIME LAST UPDATE - ";
				$str .= $time;
				addLogg("GET TIME LAST UPDATE", "SUCCESS", $str);
				echo json_encode($result);
		} else {
				$result["time"] = uploadWidgetData();
				$time = date("d M Y H:i:s",$result["time"]);
				$str = "Time start - ";
				$str.= $time;
				addLogg("UPLOAD WIDGET DATA", "SUCCESS", $str);
				echo json_encode($result);
		}	
	} catch (Exception $e) {
		$resultArray["error"]["message"] = $e->getMessage();
    $resultArray["error"]["code"] = $e->getCode();
    $resultArray["error"]["file"] = $e->getFile();
    $resultArray["error"]["line"] = $e->getLine();
		$result = "";
		$result .= $e->getMessage()."||";
		$result .= $e->getCode()."||";
		$result .= $e->getFile()."||";
		$result .= $e->getLine()."||";
		addLogg("UPLOAD WIDGET DATA", "ERROR", $result);
		echo  json_encode($resultArray);
}

function customError($errno, $errstr, $errline, $errcontext) {
	$result = "[".$errno."]". $errstr."||".$errline."|| Line number - ".$errcontext;
	addLogg("UPLOAD WIDGET DATA", "ERROR", $result);
	$resultArray["error"]["message"] = $result;
	echo  json_encode($resultArray);
}

?>