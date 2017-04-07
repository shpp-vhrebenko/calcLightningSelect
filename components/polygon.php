<?php
class Polygon
{
	protected $fill;	
	protected $points; //массив точек
	protected $ar_x;
	protected $ar_y;
	protected $id;
	protected $border_color;
	protected $border_width;
	protected $properties;
	public $plg_type;
	function addPoint($x,$y, $point_type=false) //$point_type используется в классе наследнике
	{
		$this->points[]="$x,$y";
		$this->ar_x[]=$x;
		$this->ar_y[]=$y;		
	}
	function getOuterPolygon() //вернет полигон, который содержит этот, и все углы которого прямые
	{
		//найти углы,скалярное произведение лучей которых не равно нулю, и сделать так, чтоб стало равно
		$out_points=$this->getArrPoints();
		$count_plg=count($out_points);
		$not_nul_scalyar=array();
		for($i=1;$i<=$count_plg;$i++)
		{
			$angl=new GAngle($out_points[$i-1],$out_points[$i%$count_plg],$out_points[($i+1)%$count_plg]);
			$sc_proizv=$angl->getScalyarOAOB();			
			if($sc_proizv>0)
			{
				$angl2=new GAngle($out_points[$i%$count_plg],$out_points[($i+1)%$count_plg],$out_points[($i+2)%$count_plg]);
				if($angl2->getScalyarOAOB()<0)
				{
					$O=$angl->getO();
					$B=$angl->getB();
					$OB=$angl->getOB();
					if(abs($OB->x)<abs($OB->y)) $B->x=$O->x;
					else $B->y=$O->y;
					$out_points[($i+1)%$count_plg]['x']=$B->x;
					$out_points[($i+1)%$count_plg]['y']=$B->y;
					$i++;
				}	
				else
				{
					$angl2=new GAngle($out_points[($count_plg+$i-2)%$count_plg],$out_points[($i-1)],$out_points[$i%$count_plg]);
					if($angl2->getScalyarOAOB()<0)
					{
						$O=$angl->getO();
						$A=$angl->getA();
						$OA=$angl->getOA();
						if(abs($OA->x)<abs($OA->y)) $A->x=$O->x;
						else $A->y=$O->y;
						$out_points[($i-1)%$count_plg]['x']=$A->x;
						$out_points[($i-1)%$count_plg]['y']=$A->y;						
					}
				}			
			}
		}
		return $out_points;
	}
	function addProperty($name,$value)
	{
		$this->properties[$name]=$value;
	}
	function setFill($fill)
	{
		$this->fill=$fill;
	}
	function __construct($fill='rgb(234,234,234)', $border_color="rgb(255,0,0)", $bord_width=1, $tooltip = '')
	{
		$this->fill=$fill;
		$this->properties=array();
		$this->points=array();
		$this->border_color=$border_color;
		$this->border_width=$bord_width;
		$this->id=false;
		$this->plg_type=false;
		$this->tooltip=$tooltip;
	}
	function setId($id)
	{
		$this->id=$id;
	}
	function getId() {return $this->id;}
	function del_angle_180($prefix="")
	{
		$point_arr=$this->getArrPoints();
		for($i=1;$i<count($point_arr)-1;$i++)
		{
			$angle_arr[]=new GAngle($point_arr[$i-1],$point_arr[$i],$point_arr[$i+1]);
		}
		$angle_arr[]=new GAngle($point_arr[count($point_arr)-2],$point_arr[count($point_arr)-1],$point_arr[0]);
		$angle_arr[]=new GAngle($point_arr[count($point_arr)-1],$point_arr[0],$point_arr[1]);
		for($i=0;$i<count($angle_arr);$i++)
		{
			if($angle_arr[$i]->getSquareAOB()==0)
			{				
				$this->delete_point($angle_arr[$i]->getO()->x,$angle_arr[$i]->getO()->y);
			}
		}
	}
	function get_html()
	{
		$properties="";
		foreach($this->properties as $npr=>$vpr)
		$properties=$properties." $npr='$vpr'";
		$res="<polygon ".($this->id ? "id=".$this->id : "")." $properties points='".implode(' ',$this->points)."' fill='{$this->fill}' stroke-width={$this->border_width} 
		stroke='{$this->border_color}'".($this->tooltip ? $this->tooltip : ' ')." />";
		return $res;
	}
	function getArrPoints()
	{
		$res=array();
		for($i=0;$i<count($this->points);$i++)
		{
			$x_y=explode(",",$this->points[$i]);
			$x=trim($x_y[0]);
			$y=trim($x_y[1]);
			$res[$i]['x']=$x;
			$res[$i]['y']=$y;
		}
		return $res;
	}
	function delete_point($x,$y)
	{
		$points=$this->getArrPoints();
		$this->points=array();
		$this->ar_x=array();
		$this->ar_y=array();
		for($i=0;$i<count($points);$i++)
		{
			if($x!=$points[$i]['x'] || $y!=$points[$i]['y']) $this->addPoint($points[$i]['x'],$points[$i]['y']);
		}
	}
	function getMinX()
	{
		sort($this->ar_x);
		return $this->ar_x[0];
	}
	function getMinBorderDist() //минимальное расстояние между соседними точками
	{
		$points=$this->getArrPoints();
		$min_dist=false;
		$cnt_points=count($points);
		for($i=0;$i<$cnt_points;$i++)
		{
			$dist_x=$points[$i]['x']-$points[($i+1)%$cnt_points]['x'];
			$dist_y=$points[$i]['y']-$points[($i+1)%$cnt_points]['y'];
			$dist=sqrt($dist_x*$dist_x+$dist_y*$dist_y);
			if($min_dist) $min_dist=min($min_dist,$dist);
			else $min_dist=$dist;
		}
		return $min_dist;
	}
	function getMinY()
	{
		sort($this->ar_y);
		return $this->ar_y[0];
	}
	function getMaxX()
	{
		sort($this->ar_x);
		return $this->ar_x[count($this->ar_x)-1];
	}
	function getMaxY()
	{
		sort($this->ar_y);
		return $this->ar_y[count($this->ar_y)-1];
	}
	function modifPoints($dx=0, $dy=0)
	{
		$this->ar_x=array();
		$this->ar_y=array();
		for($i=0;$i<count($this->points);$i++)
		{
			$x_y=explode(",",$this->points[$i]);
			$x=trim($x_y[0]);
			$y=trim($x_y[1]);
			$x+=$dx;
			$y+=$dy;
			$this->points[$i]="$x, $y";
			$this->ar_x[]=$x;
			$this->ar_y[]=$y;
		}		
	}
	function scale($base_x,$base_y,$koef)
	{
		$this->ar_x=array();
		$this->ar_y=array();
		for($i=0;$i<count($this->points);$i++)
		{
			$x_y=explode(",",$this->points[$i]);
			$x=trim($x_y[0]);
			$y=trim($x_y[1]);
			$dist_x=($x-$base_x)*$koef;
			$dist_y=($y-$base_y)*$koef;
			$x=$base_x+$dist_x;
			$y=$base_y+$dist_y;
			$this->points[$i]="$x, $y";
			$this->ar_x[]=$x;
			$this->ar_y[]=$y;
		}	
	}
	function getFirCoord()
	{		
		return explode(',',$this->points[0]);
	}
}
?>
