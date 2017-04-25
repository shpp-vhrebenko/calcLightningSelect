<?php 
session_start();
require_once('configs/path_config.php');
require_once('classes/classPDF.php');

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);  

$data = 0;
// Data loading
if(isset($_SESSION["calcLightningModuleCad5d"]) && isset($_SESSION['calcLMCad5dTypeView'])) {
	$data = $_SESSION["calcLightningModuleCad5d"];
	$type_view = $_SESSION['calcLMCad5dTypeView'];
	unset($_SESSION["calcLightningModuleCad5d"]);
	unset($_SESSION['calcLMCad5dTypeView']);	
} else {
	echo "Dont have session data!!!";
	exit();
}


switch ($type_view) {
	case 'viewListInRooms':
		$pdf = new PDF();			
	  	$header = array('Наименование','Артикул', 'Количество','Мощность');  
	  	$pdf->AddFont('DejaVuSans','','DejaVuSans.ttf',true);
	  	$pdf->SetFont('DejaVuSans','',12);
	  	$title = 'Ведомость осветительных приборов по помещениям';
		$pdf->SetTitle($title,1);
	  	
	  	$pdf->AddPage();
	 	$pdf->viewListInRooms($header,$data); 

		$pdf->Output();
		break;
	case 'viewList':
		$pdf = new PDF('L','mm','A4');;			
	  	$header = array('№','Артикул', 'Производ.','Наименование','Этаж/комната', 'Кол-во', 'Фото');  
	  	$pdf->AddFont('DejaVuSans','','DejaVuSans.ttf',true);
	  	$pdf->SetFont('DejaVuSans','',12);
	  	$title = 'Ведомость осветительных приборов';
		$pdf->SetTitle($title,1);
	  	
	  	$pdf->AddPage();
	 	$pdf->viewList($header,$data); 

		$pdf->Output();
		break;
	default:
		# code...
		break;
}
	
?>