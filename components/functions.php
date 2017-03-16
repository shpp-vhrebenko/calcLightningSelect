<?php 
function decart_dist($point1,$point2) //декартово расстояние
{
 $x=$point1['x']-$point2['x'];
 $y=$point1['y']-$point2['y'];
 return sqrt($x*$x+$y*$y);
}

function full_trim($str)                             
{                                                    
    return trim(preg_replace('/\s{2,}/', ' ', $str));                                                      
}

function getRoomFrontWall($g_wall, $id,$multNumber=20, $opacity=0, $fill_color='rgb(0,102,102)', $border_color='rgb(153,102,102)',$is_inner=1, $double=false)
{
	$inner=$g_wall->inner;
	$outer=$g_wall->outer;
	//первые 2 точки для над-стенки
	$start_center['x']=($inner->start->x+$outer->start->x)/2;
	$start_center['y']=($inner->start->y+$outer->start->y)/2;
	$end_center['x']=($inner->end->x+$outer->end->x)/2;
	$end_center['y']=($inner->end->y+$outer->end->y)/2;
	
	$inner_center['x']=($inner->start->x+$inner->end->x)/2;
	$inner_center['y']=($inner->start->y+$inner->end->y)/2;
	$outer_center['x']=($outer->start->x+$outer->end->x)/2;
	$outer_center['y']=($outer->start->y+$outer->end->y)/2;
	
	$vect_to_in=new Vector($inner_center['x']-$outer_center['x'],$inner_center['y']-$outer_center['y']);
	$vect_to_in=$vect_to_in->getNormirVect();
	$vect_to_in->multNumber($multNumber*$is_inner); //10 пикселей
	
	if($is_inner>0)
	{
		$start_point=new Vector($inner->start->x,$inner->start->y);
		$end_point=new Vector($inner->end->x,$inner->end->y);
	}
	else
	{
		$start_point=new Vector($outer->start->x,$outer->start->y);
		$end_point=new Vector($outer->end->x,$outer->end->y);
	}
	$start_point->addVect($vect_to_in);
	$end_point->addVect($vect_to_in);
	if($double)
	{
		$start_point2=new Vector($outer->start->x,$outer->start->y);
		$end_point2=new Vector($outer->end->x,$outer->end->y);
		$vect_to_in->multNumber(-1);
		$start_point2->addVect($vect_to_in);
		$end_point2->addVect($vect_to_in);
		$start_center['x']=$start_point2->x;
		$start_center['y']=$start_point2->y;
		$end_center['x']=$end_point2->x;
		$end_center['y']=$end_point2->y;
	}
	$res_plg=new Polygon($fill_color,$border_color);
	$res_plg->setId($id);
	$res_plg->addPoint($start_point->x,$start_point->y);
	$res_plg->addPoint($end_point->x,$end_point->y);
	$res_plg->addPoint($end_center['x'],$end_center['y']);
	$res_plg->addPoint($start_center['x'],$start_center['y']);
	/*$res_plg->addProperty('onmousemove','onWallmMove(this)');
	$res_plg->addProperty('onmouseout','onWallmOut(this)');
	$res_plg->addProperty('onclick','onPlanWallClick(this)');*/
//	$res_plg->addProperty('ondblclick',"onRoomClick(this,true)");
	$res_plg->addProperty('fill-opacity',$opacity);
	$res_plg->addProperty('stroke-opacity',$opacity);
	
	return $res_plg;
}

 ?>