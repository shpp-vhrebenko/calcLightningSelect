<?php
  require_once('configs/ftp_config.php');
  require_once('configs/path_config.php');
  require_once('configs/property_config.php');
  require_once('classes/classCSV.php');
  require_once('classes/classFTP.php');
  require_once('functions/functions.php');
  require_once('functions/functions_select_typeLamp.php');  
  require_once('functions/get_select_typeLamp_mongoDB.php');

  
  header("Content-type: text/html; charset=utf-8;");
 

  date_default_timezone_set('UTC');
  //ini_set('max_input_vars', 3000); 
  ini_set('max_execution_time', 300);
  ini_set('error_reporting', E_ALL);
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);  
 
  try {
     if ($_SERVER['REQUEST_METHOD'] === 'POST') {        
        if(isset($_POST["calc_lighting"])) {         
          /*foreach($_POST["currentRooms"] as $key => $value) {
            $answer[$key] = $value;
          }*/   
          $resultArray["calcLighting"] = calcLightingArray($_POST["currentRooms"]);                    
          echo json_encode($resultArray); 

        } else if(isset($_POST["calc_countLamp"])) { 

          $resultArray["calcCountLamp"] = calcLighting($_POST["parameters"]); 
          echo json_encode($resultArray);       

        } else if(isset($_POST["upload_widget_data"])) {
          $result["time"] = uploadWidgetData(); 
          echo json_encode($result); 
        } else {
          throw new Exception('Введенные данные некорректны', 1);           
        }
      }

      if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if(isset($_GET["select_type_lamp"])) {
          $arraySelectTypeLamp = getSelectTypeLampMongoDB();   
          //$arraySelectTypeLamp = getSelectTypeLampJson();       
          echo json_encode($arraySelectTypeLamp);           
        } 
        if(isset($_GET["properties_for_CalcLightning"])) {
          $arrayProperties = getPropertiesFromJsonDrawing();
          echo json_encode($arrayProperties);
        }  
      }    
  } catch (Exception $e) {
    $resultArray["error"]["message"] = $e->getMessage();
    $resultArray["error"]["code"] = $e->getCode();
    $resultArray["error"]["file"] = $e->getFile();
    $resultArray["error"]["line"] = $e->getLine();
 
    echo  json_encode($resultArray);
  }

  /**
   * [calc Lighting Drawing Object]
   * @param  [array] $drawArray [drawing array]
   * @return [array]            [drawing array witch result calc]
   */
  function calcLightingArray($array) {
    $resultArray = [];
    for ($i = 0; $i < count($array); $i ++) { 
      $currentElement = $array[$i];
      $resultArray[$i] = $array[$i];
      $resultArray[$i]["resultCalc"] = calcLighting($currentElement);
    }     
    return $resultArray;
  } 

 
   /*Function calculation loads housetop
  *
  * @param {array} housetop
  *
  * @return {array} resultArray object with result calculation loads
  */
  function calcLighting($room) {   
    $params = [];  
        
    $params["perimetr"] = $room["perimetr"];
    $params["space"] = round($room["roomArea"],1);     
       
    $utilization_rate_array = [];    

    if($room["lumix"] == 0) {
      $room["lumix"] = 1150;
    }

    $light_use_rate = [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
    $utilization_rate_array = getUsagecoefficientArray($room["typeLamp"]);      

    $initRoomRate = round($params["space"]/(($room["heightRoom"] - $room["lampsWorkHeight"])*($params["perimetr"]/2)),2);
    //echo ($initRoomRate."</br>");      
    if($initRoomRate < 0.6) {
      $roomRate = 0.6;
      $roomRate = (string) $roomRate; 
      $roomRate = str_replace('.',',',$roomRate); 
      $useRateCoeff = $utilization_rate_array[$room["reflectionCoef"]][$roomRate];
     /* echo ("v1</br>");
      echo ($roomRate."</br>");
      echo ($useRateCoeff."</br>");
      exit();*/
    } else {
      for($i = 0; $i < count($light_use_rate); $i++) {
        if(($i+1) === count($light_use_rate)) {
          $roomRate = $light_use_rate[$i];
          if(gettype($roomRate) == "double") {
            $roomRate = (string) $roomRate; 
            $roomRate = str_replace('.',',',$roomRate);            
          }
          $useRateCoeff = $utilization_rate_array[$room["reflectionCoef"]][$roomRate];
          /*echo ("v2</br>");
          echo ($roomRate."</br>");
          echo ($useRateCoeff."</br>");
          exit();*/
          break;
        }
        if($initRoomRate === $light_use_rate[$i]) {
          $roomRate = $initRoomRate;
           if(gettype($roomRate) == "double") {
            $roomRate = (string) $roomRate;
            $roomRate = str_replace('.',',',$roomRate);             
          }
          $useRateCoeff = $utilization_rate_array[$room["reflectionCoef"]][$roomRate];
         /* echo ("v3</br>");
          echo ($roomRate."</br>");
          echo ($useRateCoeff."</br>");
          exit();*/
          break;
        } else if($light_use_rate[$i] < $initRoomRate && $initRoomRate < $light_use_rate[$i+1]) {
          $minRoomRate = $light_use_rate[$i];
          $maxRoomRate = $light_use_rate[$i+1];
          if($initRoomRate < 0.8) {
            $roomRate = $maxRoomRate;
          } else {
            $roomRate = $minRoomRate;
          }          
          if(gettype($roomRate) == "double") {
            $roomRate = (string) $roomRate;
            $roomRate = str_replace('.',',',$roomRate);                       
          }
          $useRateCoeff = $utilization_rate_array[$room["reflectionCoef"]][$roomRate];/* +
          (( (4/($maxRoomRate - $minRoomRate)) * ($initRoomRate - $minRoomRate))/100);*/
          /*echo ("v4</br>");
          echo ($roomRate."</br>");
          echo ($useRateCoeff."</br>");
          exit();*/
          break;
        }
      }
    }    
     /* $vr1 = (intval($room["customRequiredIllumination"])*$room["space"]*$room["safetyFactor"]);
    $vr2 = ($useRateCoeff*$room["numberLamps"]*$room["lumix"]);
    $vr3 = $vr1 / $vr2;
    echo ($vr1."</br>");
    echo ($vr2."</br>");
    echo ($vr3."</br>");
    exit();*/
    $romRequiredIllumination = 0;
    if(isset($room["customRequiredIllumination"])) {          
      $romRequiredIllumination = $room["customRequiredIllumination"];
    } else {
      $romRequiredIllumination = $room["requiredIllumination"];
    }
    $numbeLamps = round((intval($room["customRequiredIllumination"])*$params["space"]*$room["safetyFactor"])/(($useRateCoeff/100)*$room["numberLamps"]*$room["lumix"]),2);
    $numbeLamps = ceil($numbeLamps);   
    if($numbeLamps == 0) {
      $numbeLamps = 1;
    }  
    $wattLight = $numbeLamps * $room["numberLamps"] * $room["powerLamp"];    
    
    $result["lampsCount"] = $numbeLamps;
    $result["lampsWatt"]= $wattLight; 
    $result["roomArea"]= $params["space"]; 
       

    return $result;
  }
  
  /**
   * [uploadUsagecodfficient description]
   * @param  [type] $link     [description]
   * @param  [type] $nameFile [description]
   * @return [type]           [description]
   */
  function uploadUsagecodfficient($link, $nameFile) {         
    $result = false;
    if ($handle = opendir(DIR_USAGECOEFFICIENT)) {      
      while (false !== ($file = readdir($handle))) { 
          if ($file === $nameFile){  
            $result = true;          
            break;
          }                
      }
      closedir($handle);          
       
    } else {
      throw new Exception('Проблема с Ftp соединением', 2);
    }  
    return $result;
    /*if ($handle = opendir(DIR_USAGECOEFFICIENT)) {
      $fileUpload = false;
      while (false !== ($file = readdir($handle))) { 
          if ($file === $nameFile.".csv"){
            $fileUpload = true;
            break;
          }                
      }
      closedir($handle);  
      if(!$fileUpload) {
        clearFtpDirectori();
        uploadFileFtp($link, $nameFile);
        //echo "uploadFTP";               
      } else {        
        //echo "upload";  
      }      
    } else {
      throw new Exception('Проблема с Ftp соединением', 2);
    } */   
  } 

  /**
   * @param  [string]
   * @return [array]
   */
  function getUsagecoefficientArray($nameFile) {

    //$nameFile = "test";    
    $CSV = CSV::Instance();
    $data_csv = $CSV->getCSV(DIR_USAGECOEFFICIENT.$nameFile.".csv"); //Открываем наш csv    
    
    $arrayResult = [];
   /* $rate = [0,0,0,0,"0,6", "0,8", "1", "1,25", "1,5","2","2,5","3","4","5"];*/
 
    foreach ($data_csv as $key=>$value) { //Проходим по строкам     
      if($key == 0) {
        $str = preg_replace('/\x{feff}$/u', '', $value[0]);
        $arrayResult["name"] = $str;
      }   
      if($key >=4 ) {        
        $val = $value[0];        
        $arrayResult["0,0,0"][$val] = $value[8];
        /*$arrayResult["10,30,30"][$val] = $value[7];
        $arrayResult["10,30,50"][$val] = $value[6];
        $arrayResult["10,50,50"][$val] = $value[5];
        $arrayResult["20,50,70"][$val] = $value[4];
        $arrayResult["10,30,80"][$val] = $value[3];
        $arrayResult["30,50,80"][$val] =$value[2];
        $arrayResult["30,80,80"][$val] = $value[1];*/

        $arrayResult["30,30,10"][$val] = $value[7];
        $arrayResult["50,30,10"][$val] = $value[6];
        $arrayResult["50,50,10"][$val] = $value[5];
        $arrayResult["70,50,20"][$val] = $value[4];
        $arrayResult["80,30,10"][$val] = $value[3];
        $arrayResult["80,50,30"][$val] =$value[2];
        $arrayResult["80,80,30"][$val] = $value[1];
      }  
    }   
    return $arrayResult;
  }
  
  

  /**
   * @return [array]
   */
  function getPropertiesFromJsonDrawing() {
    $arrayResult = [];
    if ($dh = opendir(JSON_DRAWINGS_PATH)) // открываем каталог
    {
        // считываем по одному файл или подкаталогу
        // пока не дойдем до конца
        while (($file = readdir($dh)) !== false) 
        {
            // пропускаем символы .. и .
            if($file=='.' || $file=='..') continue;
            // если каталог или файл
            if(!is_dir($file)) {
              $fileContent = file_get_contents(JSON_DRAWINGS_PATH.$file);
              $arrayContent = json_decode($fileContent, true);
              //$arrayResult["drawing"] = parseDrawing($arrayContent);
              /*$arrayResult["drawing"] = $arrayContent;*/
              break;
            }
        }
        closedir($dh); // закрываем каталог
        return $arrayContent;
    } else {
      throw new Exception('There is no file drawing', 12);
    }
  }

  



?>
