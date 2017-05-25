<?php 

	/**
   * [getSelectTypeLampMongoDB description]
   * @return [type] [description]
   */
  function uploadWidgetData() {    
    // Upload usagecoefficient from ftp server ======================================    	
     	 // *** Connect ***  
      $ftpObj = new FTPClient();
     	$ftpObj -> connect(FTP_HOST, FTP_USER, FTP_PASS);
     	$ftpObj -> changeDir(DIR_USAGECOEFFICIENT);      
     	$ftpObj -> downloadDir(DIR_USAGECOEFFICIENT);
    // Upload mongo db from ftp server ==============================================
   		$con = new MongoClient();   		
	    $arrayJsonData = uploadJsonFileFTP($ftpObj,IT_PRODUCT_FUATURES, JSON_RESOURCES);
      if(isset($arrayJsonData) && (count($arrayJsonData) != 0)) {
        uploadToMongodb($arrayJsonData, $con);
      } else {
        throw new Exception('Проблема с Ftp соединением', 1);
      }
     
      $timeNow =  strtotime("now");
	    $time_init = array( 
	        "timeInit" => $timeNow      
	    );
      $collection= $con-> test-> timeInit;    
   		$timeInit = $collection->findOne();
   		if(isset($timeInit["timeInit"])) {          
		    $collection -> drop();
		    $collection = $con-> test-> timeInit;
		    $collection->insert($time_init);		       
		  } else {
		    $collection->insert($time_init);		          
		  }  
    //Upload mongo db colection from ftp after setup time ============================
   /* $timeNow =  strtotime("now");
    $time_init = array( 
        "timeInit" => $timeNow      
    );

    $con = new MongoClient();
    $collection= $con-> test-> timeInit;    
    $timeInit = $collection->findOne();

    if(isset($timeInit["timeInit"])) {          
      $timeInterval = $timeNow - $timeInit["timeInit"];      
      //echo $timeInterval;
      if($timeInterval >= TIME_UPLOAD) {
        $collection -> drop();
        $collection = $con-> test-> timeInit;
        $collection->insert($time_init);
        $arrayJsonData = uploadJsonFileFTP(IT_PRODUCT_FUATURES, JSON_RESOURCES);
        uploadToMongodb($arrayJsonData, $con);
        $arrayResult = getFromMongoTypeLamp($con);
        //echo "uploadJson";
      } else {
        $arrayResult = getFromMongoTypeLamp($con);
      }
    } else {
      $collection->insert($time_init);
      $arrayJsonData = uploadJsonFileFTP(IT_PRODUCT_FUATURES, JSON_RESOURCES);
      uploadToMongodb($arrayJsonData, $con);
      $arrayResult = getFromMongoTypeLamp($con);      
    } */
    #==================================================================
    $con->close();   

    return $timeNow;  
  }

  function getLastTimeUpdateWidget() {
    $con = new MongoClient(); 
    $collection= $con-> test-> timeInit;    
    $timeInit = $collection->findOne();
    if(isset($timeInit["timeInit"])) {          
      $result = $timeInit["timeInit"];           
    } else {
      $result = 0;              
    } 
    return $result; 
  }

?>