<?php 
session_start();
require_once('configs/path_config.php');
require_once('classes/classPDF.php');
require_once('classes/PDF_MC_Table.php');

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
	  	$header = array('Наименование', 'Производитель', 'Артикул', 'Количество','Мощность');  
	  	$pdf->AddFont('DejaVuSans','','DejaVuSans.ttf',true);
	  	$pdf->SetFont('DejaVuSans','',10);
	  	$pdf->SetMargins(5,0.5);
	  	$title = 'Ведомость осветительных приборов по помещениям';
		$pdf->SetTitle($title,1);
	  	
	  	$pdf->AddPage();
	 	$pdf->viewListInRooms($header,$data); 

		$pdf->Output();
		break;
	case 'viewList':		
		$pdf=new PDF_MC_Table('L','mm','A4');
		$pdf->AddPage();
		$pdf->AddFont('DejaVuSans','','DejaVuSans.ttf',true);
	  	$pdf->SetFont('DejaVuSans','',12);	  	
	  	$title = 'Ведомость осветительных приборов';
		$pdf->SetTitle($title,1);
		$w = array(10, 30, 60, 80, 50, 20, 30);
		$header = array('№','Артикул', 'Производ.','Наименование','Этаж/комната', 'Кол-во', 'Фото');
		$pdf->viewHeader($w,$header);		
		
		$pdf->SetWidths(array(10, 30, 60, 80, 50, 20, 30));
		srand(microtime()*1000000);
		$pdf->SetFillColor(255,255,255); 
        $pdf->SetDrawColor(236,125,99);
		$pdf->SetLineWidth(.3);
		$pdf->SetTextColor(0);		
		for($i=0;$i<count($data);$i++) {
			$curLamp = $data[$i];
			$number = $i + 1;								
			if(!isset($curLamp["key"])) {
            	$curLamp["key"] = "----";
            } else {
            	if($curLamp["key"] === 'undefined') {
            		$curLamp["key"] = "----";
            	}            	
            }
            if(!isset($curLamp["producer"])) {
            	$curLamp["producer"] = "----";
            } else {
            	if($curLamp["producer"] === 'undefined') {
            		$curLamp["producer"] = "----";
            	}            	
            }           
		    $pdf->Row(array($number,intval($curLamp["key"]),$curLamp["producer"],$curLamp["nameLamp"],$curLamp["paramStr"],intval($curLamp["count"]),$curLamp["photoLink"]));
		}	
			
		$pdf->Output();		
		break;
	default:
		# code...
		break;
}
	
?>