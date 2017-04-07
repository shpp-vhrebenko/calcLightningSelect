<?php

class Room extends Polygon {
  
    protected $name;
    protected $area_coords;
    protected $sider_plg;
    protected $scaling;
    protected $button_id;
    public $number;    
    function __construct($type,$name,$area_coords,$scaling,$button_id,$fill = 'rgb(234,234,234)', $border_color = "rgb(255,0,0)", $bord_width = 1, $tooltip = " onmousemove='ShowTooltips(this)' onmouseout='HideTooltips(this)' ") 
    {
      parent::__construct($fill, $border_color, $bord_width, $tooltip);
      if($type && $type != "undefined"){
        $this->type=$type;
      } else {
        $this->type="тип";
      }      
      $this->name=$name;
      $this->area_coords=$area_coords;
      $this->scaling=$scaling;
      $this->button_id=$button_id;
      $this->sider_plg=new SiderPolygon();     
      $this->number=false;
    }  
    function get_html()
    {
       $res=parent::get_html();
       if(!$this->area_coords) return $res;
       $a_c=  $this->area_coords;
       $x1=$a_c['x']-40;
       $y1=$a_c['y']-5;
       $room_id=$this->id;
       $font_size = 8 * 2.5;
       $square=$this->sider_plg->getSquare()/($this->scaling*$this->scaling);
       $square=  round($square, 1);
       /*$res=$res."<text id={$room_id}_t1 x='{$x1}' y='{$y1}' fill='#9D3B18' font-size='{$font_size}'  > № ".$this->name."</text>";*/
       $res=$res."<text id={$room_id}_t1 x='{$x1}' y='{$y1}' fill='#9D3B18' font-size='{$font_size}'>№".$this->name."/".$square."</text>";
      /* $x2=$a_c['x']-20;
       $y2=$a_c['y'];
       $square=$this->sider_plg->getSquare()/($this->scaling*$this->scaling);
       $square=  round($square, 1);
       $res=$res."<text id={$room_id}_t2 x='{$x2}' y='{$y2}' fill='#000000' font-size='{$font_size}' >".$square."</text>";  */   
       /*$x3=$a_c['x']-20;
       $y3=$a_c['y']+8;*/
       $x3=$a_c['x']-40;
       $y3=$a_c['y']+15;
       $res=$res."<text id={$room_id}_t2 x='{$x3}' y='{$y3}' fill='#9D3B18' font-size='{$font_size}' >".($this->type ? $this->type : 'нет типа')."</text>";   
       $x4=$a_c['x']-10;       
       $y4=$a_c['y']+8;
       if( $this->number)
       {
            $res=$res."<text id={$room_id}_t4 x='{$x4}' y='{$y4}' fill='#000000' font-size='{$font_size}' >№ "
            .$this->number."</text>";    
            $y3+=10;
       }      
       
      $room_button=new GSVGButton($x3,$y3-8,21,9);
    	$room_button->addProperty("id",$this->button_id);
    	$room_button->addProperty("onclick","check_walls_of_room(\"".$this->button_id."\")");
    	$room_button->addProperty("onmousemove","but_room_mouse_move(\"".$this->button_id."\")");    
      $room_button->addProperty("display","none");
       
       return $res.$room_button->get_html();
    }
    function addSide($side,$correct_len=false)
    {
        $this->sider_plg->addSide($side,$correct_len);
    }
    function modifPoints($dx=0, $dy=0)
    {
        parent::modifPoints($dx, $dy);
        if($this->area_coords)
        {
			$this->area_coords['x']+=$dx;
			$this->area_coords['y']+=$dy;
		}
    }
    function scale($base_x,$base_y,$koef)
    {
        parent::scale($base_x,$base_y,$koef);
         if($this->area_coords)
        {
			$dist_x=($this->area_coords['x']-$base_x)*$koef;
			$dist_y=($this->area_coords['y']-$base_y)*$koef;
			$this->area_coords['x']=$base_x+$dist_x;
			$this->area_coords['y']=$base_y+$dist_y;
		}
    }
    
}
?>
