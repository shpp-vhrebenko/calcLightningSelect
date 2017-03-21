<?php  ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CalcLightning</title> 
  <!-- build:js scripts/main_vendor.js -->
	<script src="bower_components/jquery/dist/jquery.js"></script>  	  
  <!-- endbuild -->  
  <script src="scripts/main.js?<?php echo filemtime('scripts/main.js');?>"></script>   
</head>
<body>
  <iframe name="fr1" id="iframeid" onload="load(this)" src="widget.php" scrolling="auto" frameborder="0" style="overflow: hidden; height: 99%; width: 99%; position: absolute;" height="99%" width="99%">  
</body>
</html>