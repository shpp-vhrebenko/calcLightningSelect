<?php
require_once "components/functions.php";
require_once "components/gdraft.php";
require_once "components/polygon.php";
require_once "components/Room.php";
require_once "components/vector.php";
require_once "components/gangle.php";
require_once "components/gbutton.php";
require_once "components/SiderPolygon.php";
require_once "components/vector.php";
require_once "components/svg_door.php";
require_once "components/Symbol.php";
require_once "components/SymbolLink.php";
//require_once "../config/config.php";

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

//header("Content-type: text/html; charset=utf-8;");
if(isset($_POST['draw_plan']) && isset($_POST['hourse'])){
    $hourse=$_POST['hourse'];
    $hourse = json_decode($hourse);
    if(property_exists($hourse,'floors')) {  
      $floors=$hourse->floors;  
      $countFloors = count((array)$floors);
      for ($i=0; $i < $countFloors; $i++) { 
        $arrayPlan[$i] = draw_floor($i, $hourse);
      }      
      echo json_encode($arrayPlan);      
    } 
}    




function draw_floor($numberFloor, $hourse) {
    $floor_number = $numberFloor;
    $scale=1;
    $wall_scale=1;
    $front_w_scale=2;
    $plan=new GDraft();
    $plan->id='plan'.$floor_number;
    /*if (!isset($_GET['datatype']) || $_GET['datatype'] == 'json') {
            $json_str=file_get_contents($_GET['json']);//$_POST['json']; ////
        }
        else {
            $json_str = $_POST['json'];
        }*/
    //print_r($hourse);
    /*var_dump($hourse);
    exit();*/
    if(property_exists($hourse,'floors'))
    {
      $floors=$hourse->floors;
      $rooms=$floors[$floor_number]->rooms;
      if(property_exists($floors[$floor_number],'floorData')) {
        $floorData = $floors[$floor_number]->floorData;
        if(property_exists($floorData,'ceiling')) {
          $ceiling = $floorData->ceiling;
          $plan->ceiling=$ceiling;
        }
      }      
    } else {
      $rooms=$hourse->rooms;
    } 
    $min_x=false;
    $min_y=false;
    $max_x=false;
    $max_y=false;
    $front_plgs=array();
    $viewing_plgs=array();
    $wall_index_list=array(); //массив r_0w_0, r_0w_1 ...
    $wall_plg_arr=array();
    $outer_wall_plg_arr=array();
    $wall_opening_arr=array();
    $paint_openings_index=array();
    ###$buttons_arr=array();
    //достанем предварительно иднексы внешних стен
    $outer_walls_inds=array();

    //============================================
    $predv=false;
    for($i=0;$i<count($rooms);$i++)
    {
      $room=$rooms[$i];
      //$plg_room=new Polygon((isset($_POST['room_'.$i.'_color']) ? $_POST['room_'.$i.'_color'] : 'rgb(255,204,153)'),'rgb(0,0,0)');
      if(property_exists($room,'area_coords'))  $a_c= json_decode(json_encode($room->area_coords),true);
      else $a_c=false;
      ###???$but_room_id="but_room_{$floor_number}_{$i}";
      $room_name = $i + 1;
      $room_type = $room->room_type;
      $plg_room=new Room($room_type,$room_name,$a_c,$floors[$floor_number]->scaling,"but_room_{$floor_number}_{$i}",'rgb(255,204,153)','rgb(0,0,0)');
      //$plg_room=new Polygon('rgb(255,204,153)','rgb(0,0,0)');
      $plg_room->number=$room->room_number;
      $plg_room->setId("room_{$floor_number}_".$i);
      $plg_room->addProperty('onclick',"onSelectRoom(this)");
      //$plg_room->addProperty('onmousemove',"onRoomMove(this)");
      //$plg_room->addProperty('onmouseout',"onRoomOut(this)");
      for($j=0;$j<count($room->walls);$j++)
      {
        $wall_index_list[]="f_".$floor_number."r_".$i."w_".$j;
        $jWall=$room->walls[$j];
      //    $mount_type = '';
        if (isset($jWall->mount_type)) {
          $mount_type = $jWall->mount_type;
        }
        else{
          $mount_type = '';
        }
      //    if(isset($mount_type))
        $inner=$jWall->inner;
        $outer=$jWall->outer;
        //1
        $wall_scale=1; //test 20.02.2017 (эта строка отключает отдельное масштаирование стен)
        if($mount_type == 'mount'){
          $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,255,0)','rgb(0,255,0)');
         //$wall_plg->addProperty('nativecolor','rgb(0,255,0)');
        }
        else if($mount_type == 'demount'){
          $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(255,0,0)','rgb(255,0,0)');
          //$wall_plg->addProperty('nativecolor','rgb(255,0,0)');
        }
        else{
          $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,0,0)','rgb(0,0,0)');
         // $wall_plg->addProperty('nativecolor','rgb(0,0,0)');
        }
        //$wall_plg=getRoomFrontWall($jWall,"wall_r_".$i."w_".$j,10,1,'rgb(234,234,234)','rgb(0,0,0)'); //getRoomFrontWall($jWall,"wall_r_".$i."w_".$j,20,1,'rgb(153,51,0)','rgb(0,0,0)');    //new Polygon((isset($_POST['wall_r_'.$i.'w_'.$j.'_color']) ? $_POST['wall_r_'.$i.'w_'.$j.'_color'] : 'rgb(234,234,234)'),'rgb(0,0,0)');
      //    $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,0,0)','rgb(0,0,0)');
        $scl=1;
        if(!$predv) //это отдельное масштабирование для стенок
        {
          $predv=$wall_plg->getMinBorderDist();
          if($predv<16)
          {
            $scl=9/$predv;
            $wall_scale*=$scl;
            $front_w_scale*=$scl;
            //2
            if($mount_type == 'mount'){
              $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,255,0)','rgb(0,255,0)');
              //$wall_plg->addProperty('nativecolor','rgb(0,255,0)');
            }
            else if($mount_type == 'demount'){
              $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(255,0,0)','rgb(255,0,0)');
              //$wall_plg->addProperty('nativecolor','rgb(255,0,0)');
            }
            else{
              $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,0,0)','rgb(0,0,0)');
              //$wall_plg->addProperty('nativecolor','rgb(0,0,0)');
            }
        //        $wall_plg=getRoomFrontWall($jWall,"wall_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,0,0)','rgb(0,0,0)');
          }
        }
        $front_plgs[]=getRoomFrontWall($jWall,"frontwall_f_".$floor_number."r_".$i."w_".$j,$front_w_scale); //накрывающая стена
        //$wall_plg->addProperty('dblclick',"onRoomClick(this,true)");
        $wall_plg->plg_type='wall';
        //$wall_plg->addProperty('wall_num',$jWall->room_wall_num); //'wall_num'.$i имя в пределах комнаты
        //$wall_plg->addProperty('guid',$jWall->id);
        $wall_plg_arr[]=$wall_plg;
        if($jWall->external_wall)
        {
          //дорисуем внешнюю стену
          //3
          //wall_f_".$floor_number."r_".$i
          $wall_index_list[]="outer_f_".$floor_number."r_".$i."w_".$j;
          if($mount_type == 'mount'){
            $ouw_plg=getRoomFrontWall($jWall,"wall_outer_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,255,0)','rgb(0,255,0)',-1);
            $ouw_plg->addProperty('nativecolor','rgb(0,255,0)');
          }
          elseif($mount_type == 'demount'){
            $ouw_plg=getRoomFrontWall($jWall,"wall_outer_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(255,0,0)','rgb(255,0,0)',-1);
            $ouw_plg->addProperty('nativecolor','rgb(255,0,0)');
          }
          else{
            $ouw_plg=getRoomFrontWall($jWall,"wall_outer_f_".$floor_number."r_".$i."w_".$j,$wall_scale,1,'rgb(0,0,0)','rgb(0,0,0)',-1);
            $ouw_plg->addProperty('nativecolor','rgb(0,0,0)');
          }

          if(property_exists($jWall,'outer_wall_num')) $ouw_plg->addProperty('wall_num',$jWall->outer_wall_num);
          $ouw_plg->addProperty('guid',$jWall->id);
          $outer_wall_plg_arr[]=$ouw_plg;
          $front_plgs[]=getRoomFrontWall($jWall,"frontwall_outer_f_".$floor_number."r_".$i."w_".$j,$front_w_scale,0, 'rgb(0,102,102)', 'rgb(153,102,102)',-1);
        }
        $plg_room->addPoint($inner->start->x,$inner->start->y);
        if(property_exists($jWall, 'wall_length_mm')) $plg_room->addSide(json_decode(json_encode($inner),true),$jWall->wall_length_mm*$floors[$floor_number]->scaling/1000);
        else $plg_room->addSide(json_decode(json_encode($inner),true));
        $wall_pmx=$wall_plg->getMinX();
        $wall_pmy=$wall_plg->getMinY();
        $wall_pmxx=$wall_plg->getMaxX();
        $wall_pmxy=$wall_plg->getMaxY();
        $min_x=(!$min_x || $min_x>$wall_pmx ? $wall_pmx : $min_x);
        $min_y=(!$min_y || $min_y>$wall_pmy ? $wall_pmy : $min_y);
        $max_x=(!$max_x || $max_x<$wall_pmxx ? $wall_pmxx : $max_x);
        $max_y=(!$max_y || $max_y<$wall_pmxy ? $wall_pmxy : $max_y);
        //  if(in_array($jWall->id,$paint_walls_index)) continue;
        $openings=$jWall->openings;
        $opn_index=0;
        foreach($openings as $windoor) //проемы
        {
          if(in_array($windoor->id,$paint_openings_index)) continue;
          $inner= $windoor->inner;
          $outer=$windoor->outer;
          $paint_openings_index[]=$windoor->id;
          $tek_opn_id="op_f_{$floor_number}r_".$i."w_".$j."i_".$opn_index;
          if($windoor->type=='floorWindow')
          {
            $wall_opening=getRoomFrontWall($windoor,$tek_opn_id,
              $wall_scale,1,'rgb(255,255,255)','rgb(255,255,255)',1,true);
            //new Polygon('rgb(255,255,255)','rgb(255,255,255)');
            //$wall_opening->addProperty('onmouseout','onOpeningOut(this,"rgb(255,255,255)")');
            //$wall_opening->addProperty('onclick','onOpeningClick(this,"rgb(255,255,255)")');
            $wall_opening->addProperty('uncheck_color','rgb(255,255,255)');
          }
          else
          {//двери
          //                $wall_opening=getRoomFrontWall($windoor,$tek_opn_id,
          //         $wall_scale,1,'rgb(255,204,153)','rgb(255,204,153)',1,true);
          //        $wall_opening->addProperty('fillcolor','rgb(255,204,153');
          //        $p1 = json_decode(json_encode($inner->start),true);
          //        $p2 = json_decode(json_encode($inner->end),true);
          //        $wall_opening->addPoint($p1,$p2);
          //        $wall_opening=new SVG_Door($p1,$p2);
            $wall_opening=getRoomFrontWall($windoor,$tek_opn_id,
              $wall_scale,1,'rgb(160,160,160)','rgb(160,160,160)',1,true);
           // $wall_opening->addProperty('onmouseout','onOpeningOut(this,"rgb(160,160,160)")');
           // $wall_opening->addProperty('onclick','onOpeningClick(this,"rgb(160,160,160)")');
            $wall_opening->addProperty('uncheck_color','rgb(160,160,160)');
          }
          $wall_opening->setId($tek_opn_id);
          $opn_index++;

          //$wall_opening->addProperty('onmousemove','onOpening_mMove(this)');


          $wall_opening->addPoint($inner->start->x,$inner->start->y);
          $wall_opening->addPoint($inner->end->x,$inner->end->y);
          $wall_opening->addPoint($outer->end->x,$outer->end->y);
          $wall_opening->addPoint($outer->start->x,$outer->start->y);
          $wall_opening_arr[]=$wall_opening;
          //$plan->add_wall($wall_opening);
        }

      }
      //$plg_room->del_angle_180('draw_plan');
      $plan->add_wall($plg_room);
      /*
        $room_button=new GSVGButton($plg_room->getMinX()+10,$plg_room->getMinY()+40);
        $room_button->addProperty("id","but_room_{$i}");
        $room_button->addProperty("onclick","check_walls_of_room($i)");
        $room_button->addProperty("onmousemove","but_room_mouse_move($i)");
        $buttons_arr[]= $room_button;*/
    }
    //foreach($viewing_plgs as $plgs) {$plan->add_wall($plgs);}
    foreach($wall_plg_arr as $plgs) {$plan->add_wall($plgs);}
    foreach($outer_wall_plg_arr as $plgs) {$plan->add_wall($plgs);}
    foreach($front_plgs as $plgs) {$plan->add_wall($plgs);}
    foreach($wall_opening_arr as $plgs) {$plan->add_wall($plgs);}
    //Cables
   /* if(property_exists($floors[$floor_number],'Cables'))
    {
      for($i=0;$i<count($floors[$floor_number]->Cables);$i++)
      {
        $d_cbl=$floors[$floor_number]->Cables[$i];
        for($c_i=0;$c_i<count($d_cbl->coordinates)-1;$c_i++)
        {
          $sl_cbl=new SymbolLink($d_cbl->coordinates[$c_i]->x,$d_cbl->coordinates[$c_i]->y,
            $d_cbl->coordinates[$c_i+1]->x,$d_cbl->coordinates[$c_i+1]->y);
          $sl_cbl->addProperty('cguid',$d_cbl->guid);
          $sl_cbl->addProperty('deviceGuid1',$d_cbl->deviceGuid1);
          $sl_cbl->addProperty('deviceGuid2',$d_cbl->deviceGuid2);
          $plan->add_wall($sl_cbl);
        }
      }           
    }*/
   /* if(property_exists($floors[$floor_number],'addElements'))
    {
      $symb_json=json_decode(file_get_contents('files/svg236.json'),true); //svg236.json
      //echo file_get_contents('../files/svg236.json');
      //echo "print_r = <pre>"; print_r($symb_json); echo "</pre>";
      foreach($floors[$floor_number]->addElements as $o_symbol)
      {
        //echo "width_end = {$sizes['width']}, height_end = {$sizes['height']} <br>";
        //echo "<pre>"; print_r($symb_json[$o_symbol->deviceType]); echo "</pre>";
        $plan->symboltemplates->addTemplate($o_symbol->deviceType,$symb_json[$o_symbol->deviceType]['markup'],$symb_json[$o_symbol->deviceType]['sizes'],$o_symbol->deviceType);
        $plan->add_wall(new Symbol($o_symbol->x,$o_symbol->y,$o_symbol->deviceType));
      }
    }*/
    
    //foreach($buttons_arr as $plgs) {$plan->add_wall($plgs);}
    $plan->scale($min_x,$min_y,$scale);
    $dx=25-$min_x;
    $dy=25-$min_y;
    $max_x+=$dx;
    $max_y+=$dy;
    $max_x*=$scale;
    $max_y*=$scale;
    $plan->modif_polygons($dx,$dy);
    $plan->setWidth($max_x+25);
    $plan->setHeight($max_y+25);
    //настройки
    /* $pln_settings[]="<label><input type=checkbox onchange='check_walls(wall_arr)' id=squareProem checked >проемы</label>
        <label><input type=checkbox onchange='check_walls(wall_arr)' id=squareOtkos >откосы</label>"; */
    // $plan->get_html();
    return $plan->get_html();    
}

?>