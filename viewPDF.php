<?php 
 /* echo ($_SERVER['DOCUMENT_ROOT']);
  echo(dirname(__FILE__));*/
require_once('configs/path_config.php');
require_once('classes/classPDF.php');

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);  

		$pdf = new PDF();
		// Column headings
  	$header = array('Наименование', 'Значение');  
  	$pdf->AddFont('DejaVuSans','','DejaVuSans.ttf',true);
  	$pdf->SetFont('DejaVuSans','',12);
  	// Data loading
  	$data = $pdf->LoadData();
  	$pdf->AddPage();
 	 	$pdf->BasicTable($header,$data);
	 /* $pdf->AddPage();
	  $pdf->ImprovedTable($header,$data);
	  $pdf->AddPage();
	  $pdf->FancyTable($header,$data);*/
	  $pdf->Output(); 


?>