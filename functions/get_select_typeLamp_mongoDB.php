<?php 
	
	/**
   * [getSelectTypeLampMongoDB description]
   * @return [type] [description]
   */
  function getSelectTypeLampMongoDB() {
    $arrayResult = [];
    // Upload mongo db from local json data =========================================
    $con = new MongoClient();
    $collection= $con-> test-> typeLamp;     
    if(($collection->count()) != 0) {     
      $arrayResult = getFromMongoTypeLamp($con);      
    } else {
      $arrayJsonData = uploadJsonFileLocal();
      uploadToMongodb($arrayJsonData, $con);
      $arrayResult = getFromMongoTypeLamp($con);
    }     
    $con->close();   

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
    if(($collection->count()) != 0) {
        $cond=array("usagecoefficient"=> array('$ne' => NULL));
        $list = $collection->find($cond);        
        $arrayResult = [];
         
        while($document = $list->getNext())
        {           
          $usagecoefficient = trim($document["usagecoefficient"]);           
          $usagecoefficient = str_replace("\\","/", $usagecoefficient); 
          $curentName = basename($usagecoefficient);   
          if(uploadUsagecodfficient($usagecoefficient, $curentName)) {            
            $arrayResult[$curentName]["typeLamp"] = basename($usagecoefficient, ".csv");
            /*$usagecoefficient = parseUsagecoefficient($usagecoefficient); */
            $arrayResult[$curentName]["usagecoefficient"] = addslashes($usagecoefficient);           
            $arrayResult[$curentName]["producer"] = "Световые Технологии"; 
            /*if(isset($document["ssylkanavebstranicu"])) {
              $input2 = trim($document["ssylkanavebstranicu"]);
              $arrayResult[$curentName]["link"] = $input2;
            }*/
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
            if(isset($document["artikul"])) {            
              $artikul = trim($document["artikul"]);           
              $arrayResult[$curentName]["key"] = $artikul;
            }
            $arrayResult[$curentName]["producer"] = "Световые Технологии";
          }          
        }   
    } else {
      throw new Exception('Нет данных в базе данных!!!', 5);
    }    


    return $arrayResult;
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



 ?>