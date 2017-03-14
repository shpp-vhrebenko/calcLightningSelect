<?php
class Vector
{
	public $x;
	public $y;
	function __construct($x,$y)
	{
		$this->x=$x;
		$this->y=$y;
	}
	function addVect($vect)
	{
		$this->x+=$vect->x;
		$this->y+=$vect->y;
	}
	function addVectRes($vect)
	{
		return new Vector($this->x+$vect->x,$this->y+$vect->y);
	}
	function multNumber($number)
	{
		$this->x*=$number;
		$this->y*=$number;
	}
	function multNumberRes($number)
	{
		return new Vector($this->x*$number,$this->y*$number);		
	}
	function getScalyarProizv($vect) //скалярное произведение
	{
		return $this->x*$vect->x+$this->y*$vect->y;
	}
	function getAbsVectProizv($vect) //модуль псевдо-векторного произведения
	{
		return $this->x*$vect->y-$this->y*$vect->x;
	}
        function getAngleB($BVect)
        {
            $norms = $this->getNorma()*$BVect->getNorma();
            $cos = $this->getScalyarProizv($BVect)/$norms;
            $sin = $this->getAbsVectProizv($BVect)/$norms;
            if($sin>=0) return asin($sin);
            if($sin<0 && $cos>=0) return acos($cos);
            return 2*pi()-acos($cos);            
        }
        function getAngleBGrad($BVect)
        {
            $ar = $this->getAngleB($BVect);
            return $ar*180/pi();
        }
	function getNorma()
	{
		return sqrt($this->getScalyarProizv($this));
	}
	function getNormirVect()
	{
		$norma=$this->getNorma();
		if($norma)	return new Vector($this->x/$norma,$this->y/$norma);
		else return new Vector(0,0);
	}
	function getOrtoVect()//вектор, перпендикулярный исходному
	{
		return new Vector(-($this->y),$this->x);
	}	
	function move_point($start_x,$start_y) //отображение точки ($start_x,$start_y) с помощью этого вектора
	{
		return array("x"=>($start_x+$this->x),"y"=>($start_y+$this->y));
	}
}
?>
