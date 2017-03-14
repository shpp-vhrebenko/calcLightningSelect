<?php
class GAngle //угол, по трем точкам
{
	//начнем ложить гипсокартон из самого большого угла
	protected $A;
	protected $O;
	protected $B;
	function getO()	{return new Vector($this->O->x,$this->O->y);}
	function getA() {return new Vector($this->A->x,$this->A->y);}
	function getB() {return new Vector($this->B->x,$this->B->y);}
	function __construct($A, $O, $B)
	{
		$this->A=new Vector($A['x'],$A['y']);
		$this->O=new Vector($O['x'],$O['y']);
		$this->B=new Vector($B['x'],$B['y']);		
	}
	function getOA() //vector OA
	{
		$res=new Vector(-$this->O->x,-$this->O->y);
		$res->addVect($this->A);
		return $res;
	}
	function getOB() //vector OB
	{
		$res=new Vector(-$this->O->x,-$this->O->y);
		$res->addVect($this->B);
		return $res;
	}
	function getScalyarOAOB()
	{
		return ($this->getOA()->x*$this->getOB()->x+$this->getOA()->y*$this->getOB()->y);
	}	
	function getSquareAOB() //площадь треугольника AOB
	{
		//S = 1/2 *(OA X OB)
		$vectOA=$this->getOA();
		$vectOB=$this->getOB();
		return 0.5*abs($vectOA->x*$vectOB->y-$vectOA->y*$vectOB->x);
	}
	
}
?>
