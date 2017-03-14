<?php

class SymbTemplate
{
	protected $width_start;
	protected $width_end;
	protected $height_start;
	protected $height_end;
	public $svg_width;
	public $svg_height;
	protected $kfc_width;
	protected $kfc_height;
	protected $markup;
	public $id;
	function __construct($markup,$width_end,$height_end,$width_start=100,$height_start=100)
	{
		$this->width_start=$width_start;
		$this->height_start=$height_start;
		$this->markup=$markup;
		$this->set_size($width_end,$height_end);
		
	}	
	function set_size($width_end,$height_end)
	{
		//if(!$width_end) $width_end=20;
		//if(!$height_end) $height_end=20;
		$this->width_end=$width_end;
		$this->height_end=$height_end;		
		$this->kfc_width=$width_end/$this->width_start;
		$this->kfc_height=$height_end/$this->height_start;
	}
	function get_html()
	{
		$w = $this->svg_width/$this->kfc_width;
		$h = $this->svg_height/$this->kfc_height;
		$res = "<symbol id={$this->id} viewbox='0 0 $w $h' >";
		$res =$res.$this->markup."</symbol>";	
		return $res;	
	}	
}

class SymbolTemplates
{
	protected $templates;
	function __construct() {$this->templates=array();}
	function addTemplate($deviceType,$templ,$sizes,$id)
	{
		if(array_key_exists($deviceType,$this->templates)) return;
		$templ=str_replace('\\n','',$templ);
		$templ=str_replace('\\','',$templ);
		$pos = strpos($templ,'<');
		$templ=substr($templ,$pos);		
		$symb=new SymbTemplate($templ, $sizes['width'],$sizes['height']);		
		$symb->id=$id;
		$this->templates[$deviceType]=$symb;
	}
	function set_svg_sizes($w,$h)
	{
         foreach ($this->templates as $i=>$d)
		{
			$this->templates[$i]->svg_width=$w;
			$this->templates[$i]->svg_height=$h;
		}
	}
	function get_html()
	{
		$res='';
		foreach($this->templates as $symb)
		{
			$res=$res.$symb->get_html();
		}
		return $res;
	}
}
class Symbol extends GSVGButton {
    
    protected $deviceId;
    function __construct($x, $y,$deviceId) {
        parent::__construct($x, $y);
        $this->deviceId=$deviceId;
    }
    function get_html()
    {
		$x=$this->x-10; //если считать, что х,y -- координаты центра, а не ЛВК
		$y=$this->y-10;
        return "<use xlink:href='#{$this->deviceId}' x={$x} y={$y} />";
    }
}
