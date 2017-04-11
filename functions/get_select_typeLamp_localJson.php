<?php 

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
          $arrayResult[$curentName]["usagecoefficient"] = addslashes($usagecoefficient);        
          $arrayResult[$curentName]["typeLamp"] = basename($usagecoefficient, ".csv");
          $arrayResult[$curentName]["producer"] = "Световые Технологии";        
         /* if(isset($current["ssylkanavebstranicu"])) {
            $linkToLamp = trim($current["ssylkanavebstranicu"]);
            $arrayResult[$curentName]["link"] = $linkToLamp;
          }*/
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
          if(isset($document["artikul"])) {            
            $artikul = trim($document["artikul"]);           
            $arrayResult[$curentName]["key"] = $artikul;
          }
         
      }
    }

    return $arrayResult;  
  }    

 ?>