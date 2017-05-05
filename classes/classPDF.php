<?php  
  //define('FPDF_FONTPATH', dirname(__FILE__).'/class_tFPDF/font');
  require_once('class_tFPDF/tfpdf.php');	


	class PDF extends tFPDF
{
	// view pdf list Lighting Devices In Rooms
	function viewListInRooms($header, $data)
	{
			    
	    // Header
		// Column widths
	    $w = array(70, 50, 30, 25, 25);
	    // Header
	    $this->Cell(array_sum($w),10,'Ведомость осветительных приборов по помещениям',0,0,'C');	
	    $this->Ln();
	    // Colors, line width and bold font
	    $this->SetFillColor(236,125,99);
	    $this->SetTextColor(255);
	    $this->SetDrawColor(236,125,99);
	    $this->SetLineWidth(.3);
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
	            $this->Cell(array_sum($w),6,'Этаж '.$curFloor.' Комната № '.$curRoom ,1,0,'L', 1); 
	            $this->Ln(); 
	            $this->SetFillColor(255,255,255); 
	            $this->SetDrawColor(236,125,99);
	    		$this->SetLineWidth(.3);         
	            foreach ($typeLamp as $key => $value) {
	            	$x = $this->GetX();
					$y = $this->GetY();
					$this->Rect($x,$y,$w[0],12);
	                $this->MultiCell($w[0],6,$value["nameLamp"],0,'L');	
	                $this->SetXY($x + $w[0], $y);               
	                if(isset($value["producer"]) && $value["producer"] !== 'undefined') {
	                	$this->Cell($w[1],12,$value["producer"],1,0,'L');
	                } else {
	                	$this->Cell($w[1],12,"---",1,0,'L');
	                }  
	                if(isset($value["key"]) && $value["key"] !== 'undefined') {
	                	$this->Cell($w[2],12,$value["key"],1,0,'R');
	                } else {
	                	$this->Cell($w[2],12,"---",1,0,'R');
	                }                
	                $this->Cell($w[3],12,number_format(intval($value["lampsCount"])),1,0,'R');
	                $this->Cell($w[4],12,number_format(intval($value["lampsWatt"])),1,0,'R');                 
	                $this->Ln();
	            }
	        }
        }
      }

      // Closing line
      $this->Cell(array_sum($w),0,'','T');	  
	}

	// view pdf list Lighting Devices
	function viewList($header, $data)
	{
	   	    
	    // Header
		// Column widths
	    $w = array(10, 30, 60, 80, 50, 20, 30);
	    // Header
	    $this->SetFontSize(15);
	    $this->Cell(array_sum($w),10,'Ведомость осветительных приборов',0,0,'C');	
	    $this->Ln();
	    // Colors, line width and bold font
	    $this->SetFontSize(10);
	    $this->SetFillColor(236,125,99);
	    $this->SetTextColor(255);
	    $this->SetDrawColor(236,125,99);
	    $this->SetLineWidth(.3);
	    for($i=0;$i<count($header);$i++) {      	
	        $this->Cell($w[$i],7,$header[$i],1,0,'C',1);
	    }
	    $this->Ln();

	
      	for ($i=0; $i < count($data); $i++) { 
	        $curLamp = $data[$i];
	        $this->SetFillColor(255,255,255); 
            $this->SetDrawColor(236,125,99);
    		$this->SetLineWidth(.3);
    		$this->SetTextColor(0);	
    		$number = $i+1; 
    		$this->Cell($w[0],15,$number,1,0,'R'); 
    		if(isset($curLamp["key"]) && $curLamp["key"] !== 'undefined') {
            	$this->Cell($w[1],15,$curLamp["key"],1,0,'R');
            } else {
            	$this->Cell($w[1],15,"---",1,0,'C');
            }
            if(isset($curLamp["producer"]) && $curLamp["producer"] !== 'undefined') {
            	$this->Cell($w[2],15,$curLamp["producer"],1,0,'L');
            } else {
            	$this->Cell($w[2],15,"---",1,0,'C');
            }            
            $this->Cell($w[3],15,$curLamp["nameLamp"],1,0,'L'); 
            $x=$this->GetX();
        	$y=$this->GetY();                       
            $this->MultiCell($w[4],7.5,$curLamp["paramStr"],'T'); 
            $this->SetXY($x+$w[4],$y);           
            $this->Cell($w[5],15,$curLamp["count"],1,0,'R');
            if(isset($curLamp["photoLink"]) && $curLamp["photoLink"] !== 'undefined') { 
            	$this->Cell($w[6],15," ",1,0,'C');
            	$y = ($i * 15) + 25;          	
            	$this->Image($curLamp["photoLink"],267,$y,15,15);
            } else {
            	$this->Cell($w[6],15,"---",1,0,'C');
            }             
                                        
            $this->Ln();
            	       
        }
      

      // Closing line
      $this->Cell(array_sum($w),0,'','T');


	   /* // Column widths
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
	    $this->Cell(array_sum($w),0,'','T');*/
	}

	function getStrRooms($curLamp, $w) {
		$arrayRooms = $curLamp["floorRoom"];
		$resultStr = " ";
		for ($f=0; $f < count($arrayRooms); $f++) { 
			$curRooms = $arrayRooms[$f];
			if(($f + 1) !== 1) {
				$resultStr = $resultStr.$f."/";
			}
			for ($r=0; $r < count($curRooms); $r++) { 
				$curRoom = $curRooms[$r];
				if($curRoom === "lamp") {
					$room = $r + 1;
					$resultStr = $resultStr. $room .",";
				}
			}
		}
		return $resultStr;
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