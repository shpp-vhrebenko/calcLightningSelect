<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);  

?>

<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>calcLighting</title>

    <link rel="apple-touch-icon" href="apple-touch-icon.png">   
    <link rel="stylesheet" href="styles/css/main.css?<?php echo filemtime('styles/css/main.css');?>">      
  </head>
  <body>  
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->  
    <div class="js_loading_wraper">
      <div class="loading"></div>
    </div>    
    <div class="container-fluid">        
      <div class="header">
        <!-- <ul class="nav nav-pills pull-right">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul> -->
        <h3 class="text-muted">calcLighting</h3>
      </div>
      <div class="row content">
        <div class="row">
          <div class="col-xs-1 col-xs-offset-10  col-md-offset-10 col-md-1">
            <button type="button" id="cancel" class="btn btn-danger btn-circle "><i class="glyphicon glyphicon-remove"></i></button>                
          </div> 
        </div>
        <div class="col-xs-12 col-md-5">           
          <h3>План</h3>
          <ul class="nav nav-tabs " id="tabs_plan">
            <!-- <li class="active"><a href="#1">Этаж №1</a></li>  -->                      
          </ul>
          <div class="tab-content">
          </div>
          <p id="error_message_request" class="error_message" ></p>            
          <!-- <div class="col-sm-12 col-md-6 col-md-offset-3">
            <button id="calcButton" class="btn btn-success btn-lg btn-block" >Расчет</button>
          </div> -->
          <div class="col-sm-12 col-md-6 col-md-offset-3">
            <button id="put_data" type="button" class="btn btn-success btn-lg btn-block">Сохранить</button>   
          </div>         
                  
        
         <!--  <div class="table_specification" data-example-id="striped-table" id="result_calcLightning"></div> -->
                 
        </div>

        <div class="col-xs-12 col-md-7">                  
          <form class="form-horizontal"
            id="calcLightning"
            role="form"
            name="calcLightning"
            method="post"
            action="">
            <div class="row">
              <div class="col-xs-12 col-md-6 col-md-offset-4">
                <img src="" class="img-responsive" id="js_photo_lamp" alt="">                
              </div>             
              <p class="col-xs-12 col-md-12" id="info_lamp"></p>
            </div> 
            <table class="table table-bordered table-condensed">
              <thead>
                <tr>
                  <th>Выберите светильник</th>
                  <th>Высота помещения, м</th>
                  <th>Рабочая поверхность, м</th>
                  <th>Коэффициент отражения</th>
                  <th>Коэффициент запаса</th>
                  <th>Требуемая освещенность, лк</th>                  
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="input">
                    <select name="nameLamp" id="nameLamp" class="room input-sm" required >
                      <option selected value="">Выберите тип светильника</option>
                    </select>
                  </td> 
                  <td class="input"><input class="room_param room input-sm" type="number" id="heightRoom" name="heightRoom" placeholder="2.5" min="0.0" step="0.1" required/></td>
                  <td class="input"><input  type="number" class="room_param room input-sm" id="lampsWorkHeight" name="lampsWorkHeight" placeholder="0.8" min="0.0" step="0.1" required /></td>
                  <td class="input">
                    <select class="room input-sm" id="reflectionCoef" name="reflectionCoef" required>
                      <option value="" selected>Выберите значение коэффициента отражения</option>
                      <option value="0,0,0">Пол-0%, стены-0%, потолок-0%</option>
                      <option value="10,30,30">Пол-30%, стены-30%, потолок-10%</option>
                      <option value="10,30,50">Пол-50%, стены-30%, потолок-10%</option>
                      <option value="10,50,50">Пол-50%, стены-50%, потолок-10%</option>
                      <option value="20,50,70">Пол-70%, стены-50%, потолок-20%</option>
                      <option value="10,30,80">Пол-80%, стены-30%, потолок-10%</option>
                      <option value="30,50,80">Пол-80%, стены-50%, потолок-30%</option>
                      <option value="30,80,80">Пол-80%, стены-80%, потолок-30%</option>
                    </select>
                  </td> 
                  <td class="input">
                    <select class="room input-sm" id="safetyFactor" name="safetyFactor"  required>
                      <option selected value="">Выберите значение коэффициента запаса</option>       
                      <option value="1.1">1.1</option>
                      <option value="1.4">1.4</option>
                      <option value="1.6">1.6</option>
                      <option value="1.7">1.7</option>
                    </select>
                  </td>
                  <td class="input">
                    <select class="room input-sm" id="requiredIllumination" name="requiredIllumination" required>
                      <option value="" selected>Выберите значение освещенности</option>
                      <option value="5">Чердаки</option>
                      <option value="100">Лестницы</option>
                      <option value="50">Коридоры</option>
                      <option value="150">Вестибюли</option>
                      <option value="50">Склады в зоне хранения товара</option>
                      <option value="150">Вестибюли</option>
                      <option value="50">Склады в зоне хранения товара</option>
                      <option value="200">Склады в зоне приема товара</option>
                      <option value="200">Гаражи</option>
                      <option value="400">Парикмахерские</option>
                      <option value="200">Объединенные залы и буфеты</option>
                      <option value="400">Торговые залы магазинов</option>
                      <option value="200">Конференц-залы и залы заседаний</option>
                      <option value="500">Проектрные и конструкторские бюро</option>
                      <option value="300">Читальные залы</option>
                      <option value="300">Учебные аудитории и классы</option>
                      <option value="500">Офисные помещения</option>
                      <option value="500">Рабочий кабинет</option>                                   
                    </select>
                  </td>                                 
                </tr>
              </tbody>
            </table>                    
          </form>
          <div class="table-responsive"> 
            <div id="toolbar" class="btn-group">
                <button type="button" class="btn btn-default" id="set_data">
                    <i class="glyphicon glyphicon-plus"></i>
                </button>
                <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal" id="edit_data">
                    <i class="glyphicon glyphicon-pencil"></i>
                </button>
                <button type="button" class="btn btn-default" id="remove_data">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
            </div>
            <table class="table"
                    id="bTable"
                    data-toggle="table"
                    data-search="true"                                 
                    data-toolbar="#toolbar"
                    data-click-to-select="true"
                    data-single-select="true"                  
                    data-classes="table table-hover table-condensed"       
                    data-sort-order="desc"
                    data-sort-name="nameLamp"
                    data-locale="ru-RU">
                <thead>
                    <tr>
                        <th data-field="state" data-checkbox="true"></th>
                        <th data-field="nameLamp" data-sortable="true">Наименование </br> светильника</th>
                        <th data-field="roomNumber">№ комнаты </br> / №этажа</th>                        
                        <th data-field="roomArea">Площадь </br> комнаты</th>
                        <th data-field="lampsCount">Количество </br> светильников</th>
                        <th data-field="requiredIllumination">Требуемая </br> освещенность</th>
                        <th data-field="reflectionCoef">Коэффициэнт </br> отражения</th>
                        <th data-field="satefyFactor">Коэффициэнт </br> запаса</th>
                        <th data-field="powerLamp">Мощность </br> 1 светильника</th>
                        
                    </tr>
                </thead>
                <!-- <tbody id="data_table_body">
                    
                </tbody> -->
            </table>
          </div>          
          <!-- Modal -->
          <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
            
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Modal Header</h4>
                </div>
                <div class="modal-body">
                  <p>Some text in the modal.</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        

      <div class="footer">
        <p></p>
      </div>
    </div>

    
    <script src="bower_components/jquery/dist/jquery.js"></script>   
    <script type="text/javascript"  src="bower_components/bootstrap-less/js/tab.js"></script>
    <script type="text/javascript"  src="bower_components/bootstrap-less/js/modal.js"></script>
    <script type="text/javascript"  src="bower_components/bootstrap-table/src/bootstrap-table.js"></script> 
    <script type="text/javascript"  src="bower_components/bootstrap-table/src/locale/bootstrap-table-ru-RU.js"></script>
    <script src="bower_components/modernizr/modernizr.js"></script>
    <script src="bower_components/jquery-validation/dist/jquery.validate.js"></script>      

    
    <script src="scripts/form_validation.js?<?php echo filemtime('scripts/form_validation.js');?>"></script>      
    <script src="scripts/widget.js?<?php echo filemtime('scripts/widget.js');?>"></script>  
    
   
  </body>
</html>
