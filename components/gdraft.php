<?php
class GDraft
{
	protected $width;
	protected $height;
	protected $field_width; //ширина полей
	protected $client_width;
	protected $client_height;
	protected $isBackground; //наличие подложки
	protected $fill; //заливка
	protected $wall_polygons;  
	protected $opening_polygons;
	protected $properties;
	public $id;
	public $symboltemplates;
	function __construct($width=800, $height=600,$field_width=25, $isBackground=true, $fill='rgb(255,255,255)')
	{
		$this->width=$width;
		$this->height=$height;
		$this->field_width=$field_width;
		$this->isBackground=$isBackground;
		$this->fill=$fill;
		$this->client_width=$this->width-2*$field_width;
		$this->client_height=$this->height-2*$field_width;
		$this->wall_polygons=array();
		$this->opening_polygons=array();
		$this->id=false;
		$this->ceiling=2.5;
		$this->properties=array();
		$this->symboltemplates=new SymbolTemplates();
	}
	function setWidth($width)
	{
		$this->width=$width;
		$this->symboltemplates->set_svg_sizes($this->width,$this->height);
	}
	function addProperty($name,$value)
	{
		$this->properties[$name]=$value;
	}
	function setHeight($height)
	{
		$this->height=$height;		
		$this->symboltemplates->set_svg_sizes($this->width,$this->height);
	}
	function add_wall($wall)
	{
		$this->wall_polygons[]=$wall;
	}
	function add_opening($opening)
	{
		$this->opening_polygons[]=$opening;
	}
	function getWallPolygons() //возращаем полигоны с типом wall
	{
		$res=array();
		foreach($this->wall_polygons as $plg)
		{
			if($plg->plg_type=='wall') $res[]=$plg;
		}
		return $res;
	}
	function get_width() {return $this->width;}
	function get_height() {return $this->height;}
	function get_html($caption='',$css_style='',$css_class='',$ceiling='')
	{	
		$properties="";
		foreach($this->properties as $npr=>$vpr)
		$properties=$properties." $npr='$vpr'";
		
		$res="<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' ".($this->id ? "id=".$this->id : "")." $properties ".(!empty($css_style) ? "style='$css_style'" : ' ').
		(!empty($css_class) ? "class='$css_class'" : ' ')." width='100%' height='300px' "." viewBox='0 0 {$this->width} {$this->height}' data-ceiling='{$this->ceiling}' >";
		if($this->isBackground)
			$res=$res."<rect width={$this->width} height={$this->height} fill='{$this->fill}' stroke-width=1 stroke='#ffffff' />";
		$res=$res.$this->symboltemplates->get_html();		
		foreach($this->wall_polygons as $w_plg)	 $res=$res.$w_plg->get_html();
		foreach($this->opening_polygons as $w_plg)	 $res=$res.$w_plg->get_html();
		$res=$res." ";	
		return $res;	
	}
	function modif_polygons($dx=0,$dy=0)
	{
		for($i=0;$i<count($this->wall_polygons);$i++)
		{
			$this->wall_polygons[$i]->modifPoints($dx,$dy);
		}		
		for($i=0;$i<count($this->opening_polygons);$i++)
		{
			$this->opening_polygons[$i]->modifPoints($dx,$dy);
		}
	}
	function scale($base_x,$base_y,$koef)
	{
		for($i=0;$i<count($this->wall_polygons);$i++)
		{
			$this->wall_polygons[$i]->scale($base_x,$base_y,$koef);
		}
		for($i=0;$i<count($this->opening_polygons);$i++)
		{
			$this->opening_polygons[$i]->scale($base_x,$base_y,$koef);
		}	
	}
	function avg_wall_width()
	{
		$cnt=0;
		$sum=0;
		foreach($this->wall_polygons as $plg)
		{
			if($plg->plg_type=='wall')
			{
				$cnt++;
				$sum+=$plg->getMinBorderDist();
			}
		}
		return ($sum/$cnt);
	}
}
?>
