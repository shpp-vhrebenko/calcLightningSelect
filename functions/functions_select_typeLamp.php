<?php 

 /**
   * [parseLinkPhoto description]
   * @param  [type] $strLink [description]
   * @return [type]          [description]
   */
  function parseLinkPhoto($strLink) {    
    $result = "";
    $result = basename($strLink);    
   //$result = str_replace("\\","/", $result);
    $result = DIR_PHOTO.$result;
    return $result;
  }

   /**
   * @param  [string]
   * @return [string]
   */
  function parseUsagecoefficient($inputStr) {    
    $result = substr($inputStr, strlen(URL_IT_COMPANY));       
    return $result;    
  }  

?>