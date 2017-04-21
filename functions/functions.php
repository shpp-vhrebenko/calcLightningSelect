<?php 

 /**
   * [uploadJsonFile description]
   * @return [type] [description]
   */
  function uploadJsonFileFTP($ftpObj,$from, $to) {
     /* $ftpObj = new FTPClient(); */

      // *** Connect ***  
       /*$ftpObj -> connect(FTP_HOST, FTP_USER, FTP_PASS);*/
      // *** Clear DIR for download file
          //clearFtpDirectori(JSON_RESOURCES_DIR);     
      // *** Download file ***
      $fileFrom = $from;      // The location on the server   
      $fileTo = $to;           // Local dir to save to  
      
      $ftpObj->downloadFile($fileFrom, $fileTo);
      if (!file_exists(JSON_RESOURCES)) {
          throw new Exception('There is no file with this name lt_product_features.json', 5);
      } else {
          ini_set('memory_limit', '300M');

          $checkLogin = file_get_contents(JSON_RESOURCES);         
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
      }   
  }

  /**
   * [clearFtpDirectori description]
   * @return [type] [description]
   */
  function clearFtpDirectori($dir){ 
    if ($handle = opendir($dir)) {
      while (false !== ($file = readdir($handle))) { 
          if ($file != "." && $file != "..") { 
            unlink ($dir.$file);              
          } 
      }  
      closedir($handle); 
    }  else {
      throw new Exception('Проблема с Ftp соединением', 3);
    }        
  }

  /**
   * [uploadJsonFile description]
   * @return [type] [description]
   */
  function uploadJsonFileLocal() {
    if (file_exists(JSON_RESOURCES)) {
      ini_set('memory_limit', '300M');

      $checkLogin = file_get_contents(JSON_RESOURCES);
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
   * [uploadFileFtp description]
   * @param  [type] $link     [description]
   * @param  [type] $nameFile [description]
   * @return [type]           [description]
   */
 /* function uploadFileFtp($link, $nameFile) {
    $link = str_replace("\\","/", $link);     
    // *** Create the FTP object   
    $ftpObj = new FTPClient(); 

    // *** Connect   
    $ftpObj -> connect(FTP_HOST, FTP_USER, FTP_PASS);
   $curDir = $ftpObj -> getCurDir();
   $array = $ftpObj -> getDirListing();
    var_dump($array);
    echo $curDir;
   exit();
    // *** Download file =================================
    $fileFrom = $link;      // The location on the server   
    $fileTo = DIR_USAGECOEFFICIENT.$nameFile.".csv";            // Local dir to save to  
    $ftpObj->downloadFile($fileFrom, $fileTo);
    if (!file_exists(DIR_USAGECOEFFICIENT.$nameFile.".csv")){
      throw new Exception('Проблема с Ftp соединением', 4);
    }
    print_r($ftpObj -> getMessages());
    //====================================================
  }*/

  /**
   * @param [array]
   * @return [bool]
   */
  /*function buildResultJson($arrayLamp) {    
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
  }*/

  /**
   * [build full name lamp]
   * @param  [type] $arrayLamp [array lamp properties]
   * @return [type] $resultStr [full name lamp]
   */
  /*function buildFullNameLamp($arrayLamp) {
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
  }*/

  /**
   * @param  [array]
   * @return [array]
   */
 /* function parseDrawing($currentRoom){ 
    $resultArray = [];      
    $resultArray["space"] = $currentRoom["room_area"];
    $resultArray["perimetr"] = getRoomPerimetr($currentRoom["walls"]);
    
    return $resultArray;
  }*/

  /**
   * [getRoomPerimetr description]
   * @param  [type] $arrayWalls [description]
   * @return [type]             [description]
   */
 /* function getRoomPerimetr($arrayWalls) {
    $perimetr = 0;
    for ($i=0; $i < count($arrayWalls); $i++) { 
      $currentWall = $arrayWalls[$i];      
      $perimetr = $perimetr +$currentWall["wall_length_mm"];
    }
    $perimetr = round(($perimetr/1000),2);
    return $perimetr;
  }*/

  /**
   * [saveLightingResult description]
   * @param  [type] $array [description]
   * @return [type]        [description]
   */
 /* function saveLightingResult($array) {
    $result = json_encode($array, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);    
    file_put_contents(JSON_RESULT_CALC, $result);
  }*/

 ?>