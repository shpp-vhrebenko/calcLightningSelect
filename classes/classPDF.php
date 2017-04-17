<?php  
  //define('FPDF_FONTPATH', dirname(__FILE__).'/class_tFPDF/font');
  require_once('class_tFPDF/tfpdf.php');	


	class PDF extends tFPDF
{
	// Load data
	function LoadData()
	{	
		if (file_exists(JSON_RESULT_CALC)) { 
	    $content = file_get_contents(JSON_RESULT_CALC);	      
	    $array = json_decode($content, true); 
      return $array["rooms"][0];       
    } else {
      throw new Exception('There is no file json_result_calc', 15);      
    }
  }
	    
	

	// Simple table
	function BasicTable($header, $data)
	{
		 /*// Header
	    for ($i=0; $i < count($header); $i++) { 
	        if($i != 0) {
	            $this->Cell(80,7,$header[$i],1);
	        } else {
	            $this->Cell(40,7,$header[$i],1);
	        }
	    } 
	      $this->Ln();*/
      	// Color and font restoration
		// Colors, line width and bold font
	    $this->SetFillColor(236,125,99);
	    $this->SetTextColor(255);
	    $this->SetDrawColor(236,125,99);
	    $this->SetLineWidth(.3);	    
	    // Header
		// Column widths
	    $w = array(80, 40, 30, 40);
	    // Header
	    for($i=0;$i<count($header);$i++) {      	
	        $this->Cell($w[$i],7,$header[$i],1,0,'C',1);
	    }
	    $this->Ln();

	        
      	$floors = $data["floors"];
      	for ($f=0; $f < count($floors); $f++) { 
	        $rooms = $floors[$f]["rooms"];
	        for ($r=0; $r < count($rooms) ; $r++) { 
	         	$currentRoom = $rooms[$r];
	          	if(isset($currentRoom["typeLamp"]) && $currentRoom["typeLamp"] !== 'undefined') {
	            $typeLamp = $currentRoom["typeLamp"];
	            $curFloor = $f + 1;
	            $curRoom = $r + 1;	
	            $this->SetFillColor(217,237,247);
	            $this->SetDrawColor(236,125,99);
	    		$this->SetLineWidth(.3);
	   			$this->SetTextColor(0);	                                 
	            $this->Cell(array_sum($w),6,'Этаж №'.$curFloor.' Комната № '.$curRoom ,1,0,'L', 1); 
	            $this->Ln(); 
	            $this->SetFillColor(255,255,255); 
	            $this->SetDrawColor(236,125,99);
	    		$this->SetLineWidth(.3);         
	            foreach ($typeLamp as $key => $value) {
	                $this->Cell($w[0],6,$value["nameLamp"],1,0,'C');
	                if(isset($value["key"]) && $value["key"] !== 'undefined') {
	                	$this->Cell($w[1],6,$value["key"],1,0,'C');
	                } else {
	                	$this->Cell($w[1],6,"---",1,0,'C');
	                }                
	                $this->Cell($w[2],6,number_format(intval($value["lampsCount"])),1,0,'C');
	                $this->Cell($w[3],6,number_format(intval($value["lampsWatt"])),1,0,'C');                 
	                $this->Ln();
	            }
	        }
        }
      }

      // Closing line
      $this->Cell(array_sum($w),0,'','T');
	   /* foreach($header as $col)
	        $this->Cell(40,7,$col,1);
	    $this->Ln();*/
	    // Data     
     /* foreach ($data as $key => $value) {
        if($key != "nameLamp") {
          $this->Cell(40,6,$key,1);          
          $this->Cell(80,6,$value,1);
        }        
        $this->Ln();
      }  */     
	   /* foreach($data as $row)
	    {
	        foreach($row as $col)
	            $this->Cell(40,6,$col,1);
	        $this->Ln();
	    }*/
     /* $currentX = $this->GetX();
      $currentY = $this->GetY();
      $this->SetXY(($currentX), ($currentY));
      $array = explode(";", $data["nameLamp"]);
      foreach ($array as $value) {
        $this->Cell(140,7,$value,1);
        $this->Ln();
      }*/
      //$this->Cell(80,7,$data["nameLamp"]);
	}

	// Better table
	function ImprovedTable($header, $data)
	{
	    // Column widths
	    $w = array(40, 35, 40, 45);
	    // Header
	    for($i=0;$i<count($header);$i++)
	        $this->Cell($w[$i],7,$header[$i],1,0,'C');
	    $this->Ln();
	    // Data
	    foreach($data as $row)
	    {
	        $this->Cell($w[0],6,$row[0],'LR');
	        $this->Cell($w[1],6,$row[1],'LR');
	        $this->Cell($w[2],6,number_format($row[2]),'LR',0,'R');
	        $this->Cell($w[3],6,number_format($row[3]),'LR',0,'R');
	        $this->Ln();
	    }
	    // Closing line
	    $this->Cell(array_sum($w),0,'','T');
	}

	// Colored table
	function FancyTable($header, $data)
	{
	    // Colors, line width and bold font
	    $this->SetFillColor(255,0,0);
	    $this->SetTextColor(255);
	    $this->SetDrawColor(128,0,0);
	    $this->SetLineWidth(.3);
	    $this->SetFont('','B');
	    // Header
	    $w = array(40, 35, 40, 45);
	    for($i=0;$i<count($header);$i++)
	        $this->Cell($w[$i],7,$header[$i],1,0,'C',true);
	    $this->Ln();
	    // Color and font restoration
	    $this->SetFillColor(224,235,255);
	    $this->SetTextColor(0);
	    $this->SetFont('');
	    // Data
	    $fill = false;
	    foreach($data as $row)
	    {
	        $this->Cell($w[0],6,$row[0],'LR',0,'L',$fill);
	        $this->Cell($w[1],6,$row[1],'LR',0,'L',$fill);
	        $this->Cell($w[2],6,number_format($row[2]),'LR',0,'R',$fill);
	        $this->Cell($w[3],6,number_format($row[3]),'LR',0,'R',$fill);
	        $this->Ln();
	        $fill = !$fill;
	    }
	    // Closing line
	    $this->Cell(array_sum($w),0,'','T');
	}
} 

?>