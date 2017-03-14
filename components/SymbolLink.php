<?php
class SymbolLink
{
	protected $x1;
	protected $y1;
	protected $x2;
	protected $y2;
	protected $border_color;
	protected $border_width;
	
	protected $properties;
	function __construct($x1, $y1, $x2, $y2,$border_color='#00FF00',$border_width='3px')
	{
		$this->x1=$x1;
		$this->y1=$y1;
		$this->x2=$x2;
		$this->y2=$y2;		
		$this->border_color=$border_color;
		$this->border_width=$border_width;
		$this->properties=array();
	}
	function addProperty($name,$value)
	{
		$this->properties[$name]=$value;
	}
	function scale($base_x,$base_y,$koef)
	{
		$x=$this->x1;
		$y=$this->y1;
		$dist_x=($x-$base_x)*$koef;
		$dist_y=($y-$base_y)*$koef;
		$this->x1=$base_x+$dist_x;
		$this->y1=$base_y+$dist_y;
		$x=$this->x2;
		$y=$this->y2;
		$dist_x=($x-$base_x)*$koef;
		$dist_y=($y-$base_y)*$koef;
		$this->x2=$base_x+$dist_x;
		$this->y2=$base_y+$dist_y;		
	}
	function get_html()
	{
		$properties="";
		foreach($this->properties as $npr=>$vpr)
			$properties=$properties." $npr='$vpr'";
		$res="<line $properties x1={$this->x1} y1={$this->y1} x2={$this->x2} y2={$this->y2} stroke-width='{$this->border_width}'
		stroke='{$this->border_color}' />";
		return $res;	
	}
	function modifPoints($dx,$dy)
	{
		$this->x1+=$dx;
		$this->y1+=$dy;
		$this->x2+=$dx;
		$this->y2+=$dy;
	}
}
?>
