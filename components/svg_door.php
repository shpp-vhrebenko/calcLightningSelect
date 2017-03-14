<?php
class SVG_Door extends GSVGButton //рисует фигурные двери
{
	protected $p1;
	protected $p2;	
        protected $transform;
       
	/*function __construct($p1, $p2)
	{
		$this->p1=$p1;
		$this->p2=$p2;				
	}*/
        function __construct($p1,$p2) {
            $this->p1=$p1;
            $this->p2=$p2;
            $w = decart_dist($p1, $p2);
            $x = min($p1['x'],$p2['x']);
            $y = min($p1['y'],$p2['y']) - $w;
            parent::__construct($x, $y, $w, $w);
            $v = new Vector(abs($p2['x']-$p1['x']), abs($p2['y']-$p1['y']));
            $vX= new Vector(1, 0);
            $angle = $vX->getAngleBGrad($v);
            $ry = $y+$w;
            if($angle!=0) $this->transform = "translate($x,$ry) rotate($angle) translate(-$x,-$ry)";
            else $this->transform = "";            
        }
        function setId($id) 
        {
            $this->addProperty('id', $id);
        }      
        function addPoint($x,$y) {} //заглушка для совместимости
	function getMinX()
	{
		return min($this->p1['x'],$this->p2['x']);
	}
	function getMinY()
	{
		return min($this->p1['y'],$this->p2['y']); //условно. не точный минимум. надо учитывать поворот
	}
	function getMaxX()
	{
		return max($this->p1['x'],$this->p2['x']);
	}
	function getMaxY()
	{
		return max($this->p1['y'],$this->p2['y']); //условно. не точный максимум. надо учитывать поворот
	}	
	function get_html()
	{
		$properties="";
		foreach($this->properties as $npr=>$vpr)
			$properties=$properties." $npr='$vpr'";
//		return "<image $properties x={$this->x} y={$this->y} width=40 height=14 xlink:href='easyui/themes/icons/walls_13_1.png' />";
		return "<image $properties x={$this->x} y={$this->y} width={$this->w} height={$this->h} xlink:href='easyui/themes/icons/Doors.png' transform='{$this->transform}' />";                
	}
}
?>
