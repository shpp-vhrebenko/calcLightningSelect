<?php
  require_once('configs/ftp_config.php');
  require_once('configs/path_config.php');
  require_once('classes/classCSV.php');
  require_once('classes/classFTP.php');

  define('JSON_RESOURCES', 'json_resources/');

  header("Content-type: text/html; charset=utf-8;");

  /*date_default_timezone_set('UTC');
  define('MONTH', 2592000);*/ 
  //ini_set('max_input_vars', 3000); 
  ini_set('error_reporting', E_ALL);
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);  
 
  try {
     if ($_SERVER['REQUEST_METHOD'] === 'POST') {        
        if(isset($_POST["calc_lighting"])) {
          foreach($_POST["draw_object"] as $key => $value) {
            $answer[$key] = $value;
          } 
         /* echo json_encode($answer);
          exit();*/          
          $resultArray["calcLighting"] = calcLightingDrawObject($answer);               
          //$resultArray["calcLighting"] = calcLighting($answer);            
          echo json_encode($resultArray);                
        }
        else
        {
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
  function calcLightingDrawObject($drawArray) {
    $resultArray = $drawArray;    
    $countFloors = count($resultArray["floors"]);
    for ($i = 0; $i < $countFloors; $i++) { 
      $currentFloor = & $resultArray["floors"][$i];     
      for ($r = 0; $r < count($currentFloor["rooms"]); $r++) { 
        $currentRoom = & $currentFloor["rooms"][$r];
        if(isset($currentRoom["typeLamp"])) { 
          foreach ($currentRoom["typeLamp"] as $key => $value) {
            $currentLamp = & $currentRoom["typeLamp"][$key];
            $currentLamp["resultCalc"] = calcLighting($value, $currentRoom);
          }                   
        }
      }
    }   
    
    return $resultArray;
  } 

 
   /*Function calculation loads housetop
  *
  * @param {array} housetop
  *
  * @return {array} resultArray object with result calculation loads
  */
  function calcLighting($room, $roomDraw) { 
      
    $params = parseDrawing($roomDraw);
    uploadUsagecodfficient($room["usagecoefficient"], $room["typeLamp"]);    
    $utilization_rate_array = [];    

    if($room["lumix"] == 0) {
      $room["lumix"] = 1150;
    }

    $light_use_rate = [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
    $utilization_rate_array = getUsagecoefficientArray($room["typeLamp"]);
    /*if (file_exists("json_resourses/selectTypeLamp.json")) {
      $test = file_get_contents("json_resourses/selectTypeLamp.json");
      $arrayLamps = json_decode($test, true);
      $lamps = $arrayLamps["lamps"];

      foreach($lamps as $key => $value) {
        if($room["typeLamp"] === $value["name"]) {
          $utilization_rate_array = $value["useRateArray"];
        }
      }
    } else {
        echo ("There is no file with this name selectTypeLamp.json");
        exit();
    }*/    

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
    //$nameFile = "test";
    if ($handle = opendir(FTP_DIR)) {      
      while (false !== ($file = readdir($handle))) { 
          if ($file === $nameFile.".csv"){            
            break;
          }                
      }
      closedir($handle);    
       
    } else {
      throw new Exception('Проблема с Ftp соединением', 2);
    }  
    /*if ($handle = opendir(FTP_DIR)) {
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
   * [clearFtpDirectori description]
   * @return [type] [description]
   */
  function clearFtpDirectori(){ 
    if ($handle = opendir(FTP_DIR)) {
      while (false !== ($file = readdir($handle))) { 
          if ($file != "." && $file != "..") { 
            unlink (FTP_DIR.$file);              
          } 
      }  
      closedir($handle); 
    }  else {
      throw new Exception('Проблема с Ftp соединением', 3);
    }        
  }

  /**
   * [uploadFileFtp description]
   * @param  [type] $link     [description]
   * @param  [type] $nameFile [description]
   * @return [type]           [description]
   */
  function uploadFileFtp($link, $nameFile) {
    $link = str_replace("\\","/", $link);     
    // *** Create the FTP object   
    $ftpObj = new FTPClient(); 

    // *** Connect   
    $ftpObj -> connect(FTP_HOST, FTP_USER, FTP_PASS);
   // $curDir = $ftpObj -> getCurDir();
   // $array = $ftpObj -> getDirListing();
    //var_dump($array);
    //echo $curDir;
   // exit();
    // *** Download file =================================
    $fileFrom = $link;      // The location on the server   
    $fileTo = FTP_DIR.$nameFile.".csv";            // Local dir to save to  
    $ftpObj->downloadFile($fileFrom, $fileTo);
    if (!file_exists(FTP_DIR.$nameFile.".csv")){
      throw new Exception('Проблема с Ftp соединением', 4);
    }
    //print_r($ftpObj -> getMessages());
    //====================================================
  }

  /**
   * [getSelectTypeLampMongoDB description]
   * @return [type] [description]
   */
  function getSelectTypeLampMongoDB() {
    $arrayResult = [];
    $con = new MongoClient();
    $collection= $con-> test-> typeLamp;     
    if(($collection->count()) != 0) {
      $arrayResult = getFromMongoTypeLamp($con);
    } else {
      $arrayJsonData = uploadJsonFile();
      uploadToMongodb($arrayJsonData, $con);
      $arrayResult = getFromMongoTypeLamp($con);
    }  
    #Variant upload mongo db after 1 month ============================
    /*$timeNow =  strtotime("now");
    $time_init = array( 
        "timeInit" => $timeNow      
    );

    $con = new MongoClient();
    $collection= $con-> test-> timeInit;    
    $timeInit = $collection->findOne();

    if(isset($timeInit["timeInit"])) {    
      $timeInterval = $timeNow - $timeInit["timeInit"];
      //echo $timeInterval;
      if($timeInterval >= MONTH) {
        $arrayJsonData = uploadJsonFile();
        uploadToMongodb($arrayJsonData, $con);
        $arrayResult = getFromMongoTypeLamp($con);
        //echo "uploadJson";
      } else {
        $arrayResult = getFromMongoTypeLamp($con);
      }
    } else {
      $collection->insert($time_init);
      $arrayJsonData = uploadJsonFile();
      uploadToMongodb($arrayJsonData, $con);
      $arrayResult = getFromMongoTypeLamp($con);
      //echo "timeInit";
    } */
    #==================================================================
    $con->close();   

    return $arrayResult;  
  }

  /**
   * [getSelectTypeLampJson description]
   * @return [type] [description]
   */
  function getSelectTypeLampJson() {
    $arrayResult = [];    
    $arrayJsonData = [];

    $arrayJsonData = uploadJsonFile();
    for ($i=0; $i < count($arrayJsonData); $i++) { 
      $current = $arrayJsonData[$i];
      if(isset($current["usagecoefficient"])) {
          $usagecoefficient = trim($current["usagecoefficient"]);
          $usagecoefficient = parseUsagecoefficient($usagecoefficient);
          $curentName = parseNameLamp($usagecoefficient);
          $arrayResult[$curentName]["usagecoefficient"] = $usagecoefficient;        
          $arrayResult[$curentName]["typeLamp"] = $curentName;        
          if(isset($current["ssylkanavebstranicu"])) {
            $linkToLamp = trim($current["ssylkanavebstranicu"]);
            $arrayResult[$curentName]["link"] = $linkToLamp;
          }
          if(isset($current["svetovojpotoklamp"])) {
            $lumixLamp = trim($current["svetovojpotoklamp"]);
            $arrayResult[$curentName]["lumix"] = $lumixLamp;
          }
          if(isset($current["moshhnostsuchetompoterpra"])) {
            $powerLamp = trim($current["moshhnostsuchetompoterpra"]);
            $arrayResult[$curentName]["powerLamp"] = $powerLamp;
          }
          if(isset($current["kolichestvolamp"])) {
            $kolichestvolamp = trim($current["kolichestvolamp"]);
            $arrayResult[$curentName]["numberLamps"] = $kolichestvolamp;
          } 
          if(isset($current["photo_small_family"])) {            
            $photoLamp = trim($current["photo_small_family"]);
            $photoLamp = parseLinkPhoto($input6);
            $arrayResult[$curentName]["photo_lamp"] = $photoLamp;
          } 
          if(isset($current["naimenovanie"])) {            
            $nameLamp = trim($current["naimenovanie"]);           
            $arrayResult[$curentName]["nameLamp"] = $nameLamp;
          }
          if(isset($document["oblastprimeneniya"])) {            
            $applArea = trim($document["oblastprimeneniya"]);           
            $arrayResult[$curentName]["application_area"] = $applArea;
          } 
      }
    }

    return $arrayResult;  
  }   

  /**
   * [getFromMongoTypeLamp description]
   * @param  [type] $con [description]
   * @return [type]      [description]
   */
  function getFromMongoTypeLamp($con) {
    $arrayResult = [];
    $collection= $con-> test-> typeLamp;
    

    $cond=array("usagecoefficient"=> array('$ne' => NULL));
    $list = $collection->find($cond);
    $arrayResult = [];
     
    while($document = $list->getNext())
    {
      $usagecoefficient = trim($document["usagecoefficient"]);
      $usagecoefficient = parseUsagecoefficient($usagecoefficient);
      $curentName = parseNameLamp($usagecoefficient);
      $arrayResult[$curentName]["usagecoefficient"] = $usagecoefficient;        
      $arrayResult[$curentName]["typeLamp"] = $curentName;        
      if(isset($document["ssylkanavebstranicu"])) {
        $input2 = trim($document["ssylkanavebstranicu"]);
        $arrayResult[$curentName]["link"] = $input2;
      }
      if(isset($document["svetovojpotoklamp"])) {
        $input3 = trim($document["svetovojpotoklamp"]);
        $arrayResult[$curentName]["lumix"] = $input3;
      }
      if(isset($document["moshhnostsuchetompoterpra"])) {
        $input4 = trim($document["moshhnostsuchetompoterpra"]);
        $arrayResult[$curentName]["powerLamp"] = $input4;
      }
      if(isset($document["kolichestvolamp"])) {
        $input5 = trim($document["kolichestvolamp"]);
        $arrayResult[$curentName]["numberLamps"] = $input5;
      } 
      if(isset($document["photo_small_family"])) { 
        $photoLamp = trim($document["photo_small_family"]);
        $photoLamp = parseLinkPhoto($photoLamp);
        $arrayResult[$curentName]["photo_lamp"] = $photoLamp;
      }  
      if(isset($document["naimenovanie"])) {            
        $nameLamp = trim($document["naimenovanie"]);           
        $arrayResult[$curentName]["nameLamp"] = $nameLamp;
      } 
      if(isset($document["oblastprimeneniya"])) {            
        $applArea = trim($document["oblastprimeneniya"]);           
        $arrayResult[$curentName]["application_area"] = $applArea;
      }          
        /*echo "<p>" . $curentName . "</br>"; */      
    } 
    return $arrayResult;
  } 

  /**
   * [parseLinkPhoto description]
   * @param  [type] $strLink [description]
   * @return [type]          [description]
   */
  function parseLinkPhoto($strLink) {    
    $result = "";
    $result = mb_substr($strLink, 35);
   //$result = str_replace("\\","/", $result);
    $result = DIR_PHOTO.$result;
    return $result;
  }

  /**
   * [uploadToMongodb description]
   * @param  [type] $array [description]
   * @param  [type] $con   [description]
   * @return [type]        [description]
   */
  function uploadToMongodb($array, $con) {
      $collection= $con-> test-> typeLamp;
      $collection -> drop();
      $collection= $con-> test-> typeLamp;
      for ($i=0; $i < count($array); $i++) {              
        $collection->insert($array[$i]);        
        //print_r($con-> listDBs());      
      } 
  }

  /**
   * [uploadJsonFile description]
   * @return [type] [description]
   */
  function uploadJsonFile() {
    if (file_exists(JSON_RESOURCES."lt_product_features.json")) {
      ini_set('memory_limit', '300M');

      $checkLogin = file_get_contents(JSON_RESOURCES."lt_product_features.json");
      //$checkLogin = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($checkLogin));

      // This will remove unwanted characters.
      // Check http://www.php.net/chr for details
      for ($i = 0; $i <= 31; ++$i) { 
          $checkLogin = str_replace(chr($i), "", $checkLogin); 
      }
      $checkLogin = str_replace(chr(127), "", $checkLogin);

      // This is the most common part
      // Some file begins with 'efbbbf' to mark the beginning of the file. (binary level)
      // here we detect it and we remove it, basically it's the first 3 characters 
      if (0 === strpos(bin2hex($checkLogin), 'efbbbf')) {
         $checkLogin = substr($checkLogin, 3);
      }
    
      //$data = stripslashes($checkLogin);
     // $checkLogin = mb_convert_encoding($checkLogin, "UTF-8", "auto"); 
      //$checkLogin = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($checkLogin));
      $checkLogin = json_decode($checkLogin, true);
      /*var_dump($checkLogin);
      exit(); */
       //echo ($checkLogin[0] -> artikul );     
      
      switch (json_last_error()) {
          case JSON_ERROR_NONE:
            return $checkLogin;  
          break;
          case JSON_ERROR_DEPTH:
              /*echo ' - Достигнута максимальная глубина стека';*/
              throw new Exception('Техническая проблема с загрузкой библиотек', 6);
          break;
          case JSON_ERROR_STATE_MISMATCH:
              /*echo ' - Некорректные разряды или не совпадение режимов';*/
              throw new Exception('Техническая проблема с загрузкой библиотек', 7);
          break;
          case JSON_ERROR_CTRL_CHAR:
              /*echo ' - Некорректный управляющий символ';*/
              throw new Exception('Техническая проблема с загрузкой библиотек', 8);
          break;
          case JSON_ERROR_SYNTAX:
              /*echo ' - Синтаксическая ошибка, не корректный JSON';*/
              throw new Exception('Техническая проблема с загрузкой библиотек', 9);
          break;
          case JSON_ERROR_UTF8:
              /*echo ' - Некорректные символы UTF-8, возможно неверная кодировка';*/
              throw new Exception('Техническая проблема с загрузкой библиотек', 10);
          break;
          default:
              /*echo ' - Неизвестная ошибка';*/
              throw new Exception('Техническая проблема с загрузкой библиотек', 11);
          break;
      }  
      
    } else {
      throw new Exception('There is no file with this name lt_product_features.json', 5);      
    }
  }

 
  /**
   * @param  [string]
   * @return [string]
   */
  function parseUsagecoefficient($inputStr) {
    $subinput1 = mb_substr($inputStr, 12);
    return $subinput1;    
  } 
  
  /**
   * @param  [string]
   * @return [string]
   */
  function parseNameLamp($inputStr) {
    $subinput1 = mb_substr($inputStr, 2);
    $result = explode( '\\', $subinput1);
    $str = $result[count($result)-1];
    $num = strlen($str); 
    $curentName = mb_substr($str, 0, ($num - 4));
    return $curentName;
  }

  /**
   * @param  [string]
   * @return [array]
   */
  function getUsagecoefficientArray($nameFile) {

    //$nameFile = "test";    
    $CSV = CSV::Instance();
    $data_csv = $CSV->getCSV(FTP_DIR.$nameFile.".csv"); //Открываем наш csv    
    
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
        $arrayResult["10,30,30"][$val] = $value[7];
        $arrayResult["10,30,50"][$val] = $value[6];
        $arrayResult["10,50,50"][$val] = $value[5];
        $arrayResult["20,50,70"][$val] = $value[4];
        $arrayResult["10,30,80"][$val] = $value[3];
        $arrayResult["30,50,80"][$val] =$value[2];
        $arrayResult["30,80,80"][$val] = $value[1];
      }  
    }   
    return $arrayResult;
  }
  
  /**
   * @param [array]
   * @return [bool]
   */
  function buildResultJson($arrayLamp) {    
    $con = new MongoClient();
    $collection= $con-> test-> typeLamp;
    $cond=array("naimenovanie"=> $arrayLamp["lampName"]);
    $document = $collection->findOne($cond);
    if(count($document) != 0) {
      $arrayLamp["nameLamp"] = buildFullNameLamp($document);
      $array["rooms"][0] = $arrayLamp;      
      saveLightingResult($array);
      return true;
    } else {
      return false;
    }    
  }

  /**
   * [build full name lamp]
   * @param  [type] $arrayLamp [array lamp properties]
   * @return [type] $resultStr [full name lamp]
   */
  function buildFullNameLamp($arrayLamp) {
    $resultStr = "";
    $resultStr = $arrayLamp["naimenovanie"];
    if(isset($arrayLamp["tipizdeliya"])) {
      $resultStr = $resultStr." ".$arrayLamp["tipizdeliya"];
    }    
    if(isset($arrayLamp["led"])) {
      $led = $arrayLamp["led"];
      if($led) {
        $resultStr = $resultStr." светодиодный ";
      } else {
        if(isset($arrayLamp["tipistochnikasveta"])) {
          if($arrayLamp["tipistochnikasveta"] != "Нет значения") {
            $resultStr = $resultStr."; Тип источника света: ".$arrayLamp["tipistochnikasveta"];
          }
        }
      }      
    }
    if(isset($arrayLamp["ip"])) {
      $resultStr = $resultStr."; Cтепень защиты: ".$arrayLamp["ip"];
    }  
    if(isset($arrayLamp["tipsvetilnikapomontazhu"])) {
      $typeM = mb_strtolower($arrayLamp["tipsvetilnikapomontazhu"],'UTF-8');
      $resultStr = $resultStr."; Тип установки: ".$typeM;
    }   
    if(isset($arrayLamp["oblastprimeneniya"])) {
      $typeP = mb_strtolower($arrayLamp["oblastprimeneniya"],'UTF-8');
      $resultStr = $resultStr."; Область приминения: ".$typeP;
    }    

    return $resultStr;
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

  /**
   * @param  [array]
   * @return [array]
   */
  function parseDrawing($currentRoom){ 
    $resultArray = [];      
    $resultArray["space"] = $currentRoom["room_area"];
    $resultArray["perimetr"] = getRoomPerimetr($currentRoom["walls"]);
    
    return $resultArray;
  }

  /**
   * [getRoomPerimetr description]
   * @param  [type] $arrayWalls [description]
   * @return [type]             [description]
   */
  function getRoomPerimetr($arrayWalls) {
    $perimetr = 0;
    for ($i=0; $i < count($arrayWalls); $i++) { 
      $currentWall = $arrayWalls[$i];      
      $perimetr = $perimetr +$currentWall["wall_length_mm"];
    }
    $perimetr = round(($perimetr/1000),2);
    return $perimetr;
  }

  /**
   * [saveLightingResult description]
   * @param  [type] $array [description]
   * @return [type]        [description]
   */
  function saveLightingResult($array) {
    $result = json_encode($array, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    /*var_dump($result);
    exit();*/
    file_put_contents(JSON_RESULT_CALC, $result);
  }



?>
