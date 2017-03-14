<?php
class GSVGButton
{
	protected $w;
	protected  $h;
	protected $x;
	protected $y;
	protected $properties;
	function __construct($x, $y, $w=63, $h=28)
	{
		$this->x=$x-1;
		$this->y=$y+2;
		$this->w=$w;
		$this->h=$h;
		$this->properties=array();
	}
	function addProperty($name,$value)
	{
		$this->properties[$name]=$value;
	}
	function scale($base_x,$base_y,$koef)
	{
		$x=$this->x;
		$y=$this->y;
		$dist_x=($x-$base_x)*$koef;
		$dist_y=($y-$base_y)*$koef;
		$x=$base_x+$dist_x;
		$y=$base_y+$dist_y;
		$this->x=$x;
		$this->y=$y;
		$this->w*=$koef;
		$this->h*=$koef;			
	}
	function get_html()
	{
		$properties="";
		foreach($this->properties as $npr=>$vpr)
			$properties=$properties." $npr='$vpr'";
//		return "<image $properties x={$this->x} y={$this->y} width=40 height=14 xlink:href='easyui/themes/icons/walls_13_1.png' />";
		/*return "<image $properties x={$this->x} y={$this->y} width={$this->w} height={$this->h} xlink:href='easyui/themes/icons/12341.png' />";*/
		return "<image $properties x={$this->x} y={$this->y} width={$this->w} height={$this->h} />";
	}
	function modifPoints($dx,$dy)
	{
		$this->x+=$dx;
		$this->y+=$dy;
	}
}
?>
