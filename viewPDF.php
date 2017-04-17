<?php 
session_start();
require_once('configs/path_config.php');
require_once('classes/classPDF.php');

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);  

$data = 0;
// Data loading
if(isset($_SESSION["calcLightningModuleCad5d"])) {
	$data = $_SESSION["calcLightningModuleCad5d"];
	unset($_SESSION["calcLightningModuleCad5d"]);
}



	$pdf = new PDF();
		// Column headings
  	$header = array('Наименование','Артикул', 'Количество','Мощность');  
  	$pdf->AddFont('DejaVuSans','','DejaVuSans.ttf',true);
  	$pdf->SetFont('DejaVuSans','',12);
  	
  	$pdf->AddPage();
 	$pdf->BasicTable($header,$data);

	 /* $pdf->AddPage();
	  $pdf->ImprovedTable($header,$data);
	  $pdf->AddPage();
	  $pdf->FancyTable($header,$data);*/

	$pdf->Output();
?>