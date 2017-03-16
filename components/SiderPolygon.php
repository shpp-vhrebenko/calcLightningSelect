<?php
//добавляем отрезки, заданные точками и коректирующей длиной
//определяем по ним точки пересечения
//считаем площадь
class Otrezok {
    protected $start;
    protected $end;
    protected $correct_length;
    function __construct($start,$end,$correct_length)
    {
        $this->start=$start;
        $this->end=$end;
        $this->correct_length=$correct_length;
    }
    function cosEOX() //косинус угла образованого отрезком с положительным направлением оси ОХ
    {
        $v=new Vector($this->end['x']-$this->start['x'], $this->end['y']-$this->start['y']);
        $vOX=new Vector(1, 0);
        return $v->getScalyarProizv($vOX)/$v->getNorma();
    }
    function difX() //знак косинуса EOX
    {
        return ($this->end['x']-$this->start['x']);
    }
    function correct_endpoint() //корректирует end по длине отрезка
    {
        if($this->correct_length)
        {
            $v=new Vector($this->end['x']-$this->start['x'], $this->end['y']-$this->start['y']);
            $v=$v->getNormirVect();
            $v->multNumber($this->correct_length);
            $this->end=$v->move_point($this->start['x'], $this->start['y']);
        }
    }
    function getStart() {return $this->start;}
    function getEnd() {return $this->end;}
    function getLength() {
        if($this->correct_length)  return $this->correct_length;
        else return decart_dist($this->start, $this->end);
    }
    function mov_d($dx,$dy)
    {
        $this->start['x']+=$dx;
        $this->start['y']+=$dy;
        $this->end['x']+=$dx;
        $this->end['y']+=$dy;
    }
    function getMinX(){return min($this->start['x'],$this->end['x']);}
    function getMinY(){return min($this->start['y'],$this->end['y']);}
}
class SiderPolygon {
    protected $siders; //стороны
    function __construct() {
        $this->siders=array();
    }
    function addSide($side,$correct_len=false)
    {
        $this->siders[]=new Otrezok($side['start'],$side['end'],$correct_len);        
    }
    function getMinX()
    {
        $x_arr=array();
        foreach($this->siders as $sd)
        {
            $x_arr[]=$sd->getMinX();
        }
        return min($x_arr);        
    }
    function getMinY()
    {
        $y_arr=array();
        foreach($this->siders as $sd)
        {
            $y_arr[]=$sd->getMinY();
        }
        return min($y_arr);        
    }
    function move_d($dx,$dy)
    {
        for($i=0;$i<count($this->siders);$i++) $this->siders[$i]->mov_d($dx, $dy);
    }
    function calcCorrcetedPlg()
    {
        //берем каждый отрезок корректируем последнюю точку
        //для следующего корректруем первую
        $plg_arr=array();
        $new_start=false;
        for($i=0;$i<count($this->siders)-1;$i++) //последний отрезок нам не нужен, дабы не получить первую точку дважды
        {
            if(count($plg_arr)==0) 
            {
                $new_start=$this->siders[$i]->getStart();
                $plg_arr[]=$new_start;
            }
            else
            {
                $new_start=$plg_arr[count($plg_arr)-1];
            }
            $start=$this->siders[$i]->getStart();
            $end=$this->siders[$i]->getEnd();
            $need_len=$this->siders[$i]->getLength();
            $se_vector=new Vector($end['x']-$start['x'], $end['y']-$start['y']);
            $se_vector=$se_vector->getNormirVect();
            $se_vector->multNumber($need_len);
            $new_end=$se_vector->move_point($new_start['x'], $new_start['y']);
            $plg_arr[]=$new_end;
        }
        return $plg_arr;
    }
    function getSquare()
    {
        $res=0;         
        $plg=$this->calcCorrcetedPlg();
        $cnt=count($plg);
        for($i=0;$i<$cnt;$i++)
        {
            //(y1+y2)/2*dx
            $res+=($plg[$i]['y']+$plg[($i+1)%$cnt]['y'])*($plg[($i+1)%$cnt]['x']-$plg[$i]['x'])/2;
        }
        /*
        for($i=0;$i<count($this->siders);$i++)
        {
           // $this->siders[$i]->correct_endpoint();
            $res+=($this->siders[$i]->getStart()['y']+$this->siders[$i]->getEnd()['y'])*$this->siders[$i]->difX()/2;
        }*/
        return abs($res);
    }
    function getPerim()
    {
        $res=0;
        for($i=0;$i<count($this->siders);$i++)
        {            
            $res+=$this->siders[$i]->getLength();
        }
        return $res;
    }
}
