<?php
?>

<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Расчет освещения</title>
    <link rel="apple-touch-icon" href="apple-touch-icon.png">   
    <link rel="stylesheet" href="styles/css/main.css?<?php echo filemtime('styles/css/main.css');?>"> 
    <!-- build:js scripts/widget_head_vendor.js -->
    <script src="bower_components/jquery/dist/jquery.js"></script>         
    <!-- endbuild --> 
        
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
        <h3 class="animated fadeInLeft header_widget-header">Расчет освещения</h3>
      </div>
      <div class="row content">       
        <div class="col-xs-12 col-md-5" id="draw_plan">           
          <h3>План</h3>
          <ul class="nav nav-tabs " id="tabs_plan">                                
          </ul>
          <div class="tab-content">
          </div>
          <p id="error_message_request" class="error_message" ></p>                        
        </div>
        <div class="col-xs-12 col-md-7"> 
          <div class="row">
            <div class="col-xs-12 col-md-5 col-md-offset-4">
              <img src="" class="img-responsive animated fadeInDownBig image-animate" id="js_photo_lamp" alt=""> 
              <p  id="info_lamp"></p>               
            </div>             
            <p class="col-xs-12 col-md-12" id="info_lamp"></p>
            <div class="col-xs-12 col-md-5 col-md-offset-4"> 
              <div id="custom-search-input">
                <input type="text" data-provide="typeahead"  class="form-control input-sm" id="search_user_lamp" placeholder="Поиск светильника" />                
              </div>                           
              <!-- <div id="custom-search-input">
                  <div class="input-group col-md-12">
                      <input type="text" class="form-control input-sm" id="search_user_lamp" placeholder="Поиск светильника" />
                      <span class="input-group-btn">
                          <button class="btn btn-info btn-sm" id="search_lamp" type="button">
                              <i class="glyphicon glyphicon-search"></i>
                          </button>
                      </span>
                  </div>
              </div> -->
            </div>
          </div>
          <!-- Form calcLightning  -->                 
          <form class="form-horizontal"
            id="calcLightning"
            role="form"
            name="calcLightning"
            method="post"
            action="">          
            <table class="table table-bordered table-condensed">
              <thead>
                <tr>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Выберите артикул светильника">Артикул</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Выберите светильник">Cветильник</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Для изменения высоты введите в поле значение">Высота поме- </br> щения, м</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Высота на которой необходимо обеспечить требуемое освещение">Рабочая поверх- </br> ность, м</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Коэффициент отражения поверхностей">Коэф.</br> отражения</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Запас освещенности">Коэф. &nbsp;&nbsp;</br> запаса &nbsp;&nbsp;</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="по ГОСТ">Треб.</br> освещ. лк</th>
                  <th data-toggle="tooltip" data-placement="top" data-container="body" title="Требуемая освещенность">Треб. освещ. лк</th>                   
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="input col-md-1">
                    <input class="input-sm" type="text" class="input-sm" name="key" data-provide="typeahead" id="key"/>
                  </td>
                  <td class="input col-md-1">
                    <select name="nameLamp" id="nameLamp" class="room input-sm" required >
                      <option selected value="">Выберите тип светильника</option>
                    </select>
                  </td>
                  <td class="input col-md-1">
                    <input class="room input-sm" type="number" id="heightRoom" name="heightRoom" placeholder="2.5" min="0.0" step="0.1" required/>
                  </td>
                  <td class="input col-md-1">
                    <input  type="number" class="room input-sm" id="lampsWorkHeight" name="lampsWorkHeight" placeholder="0.8" min="0.0" step="0.1" required />
                  </td>
                  <td class="input col-md-2">
                    <select class="room input-sm" id="reflectionCoef" name="reflectionCoef" required>
                      <option value="" selected>Выберите значение коэффициента отражения</option>                      
                      <option value="0,0,0">Пол-0%, стены-0%, потолок-0%</option>            
                      <option value="30,30,10">Пол-30%, стены-30%, потолок-10%</option>
                      <option value="50,30,10">Пол-50%, стены-30%, потолок-10%</option>
                      <option value="50,50,10">Пол-50%, стены-50%, потолок-10%</option>
                      <option value="70,50,20">Пол-70%, стены-50%, потолок-20%</option>
                      <option value="80,30,10">Пол-80%, стены-30%, потолок-10%</option>
                      <option value="80,50,30">Пол-80%, стены-50%, потолок-30%</option>
                      <option value="80,80,30">Пол-80%, стены-80%, потолок-30%</option>
                    </select>
                  </td> 
                  <td class="input col-md-1">
                    <select class="room input-sm" id="safetyFactor" name="safetyFactor"  required>
                      <option selected value="">Выберите значение коэффициента запаса</option>       
                      <option value="1.1">1.1</option>
                      <option value="1.4">1.4</option>
                      <option value="1.6">1.6</option>
                      <option value="1.7">1.7</option>
                    </select>
                  </td>
                  <td class="input col-md-2">
                    <select class="room input-sm" id="requiredIllumination" name="requiredIllumination" required>
                      <option value="" selected>Выберите значение освещенности</option>
                      <option value="1">Значение пользователя</option>
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
                      <option value="500">Проектные и конструкторские бюро</option>
                      <option value="300">Читальные залы</option>
                      <option value="300">Учебные аудитории и классы</option>
                      <option value="500">Офисные помещения</option>
                      <option value="500">Рабочий кабинет</option>                                   
                    </select>
                  </td> 
                  <td class="input col-md-1">
                    <input class="room input-sm" type="number" id="customRequiredIllumination" name="customRequiredIllumination" min="0" step="1"/>                    
                  </td>                                 
                </tr>
              </tbody>
            </table>                    
          </form>
          <!-- End Form calcLightning  -->  
          <!--  Bootstrap-tables -->
          <div class="table-responsive"> 
            <div id="toolbar" class="btn-group">
                <button type="button" class="btn btn-default" id="set_data">
                    Добавить светильник
                </button>                                                          
            </div>
            <table id="bTable" ></table>            
          </div> 
          <!-- Bootstrap table context menu -->  
          <ul id="example1-context-menu" class="dropdown-menu">              
              <li data-item="delete"><a>Удалить</a></li>              
          </ul>
          <!-- End Bootstrap table context menu --> 
          <!-- End Bootstrap-tables -->  
          <div class="row user-result-panel">            
            <button type="button" class="btn btn-success col-sm-6 col-md-1 col-md-offset-8" id="put_data">
              ОК
            </button> 
            <button type="button" class="btn btn-default col-sm-6 col-md-2" id="cancel">
              Отмена
            </button>            
          </div>           
      </div>
      <div class="footer">
        <p></p>
      </div>
    </div>

    <!-- build:js scripts/widget_vendor.js --> 
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <script src="bower_components/lodash/lodash.js"></script>    
    <script type="text/javascript" src="bower_components/bootstrap3-typeahead/bootstrap3-typeahead.js"></script>              
    <script src="bower_components/bootstrap-table/dist/bootstrap-table.js"></script>
    <script src="bower_components/bootstrap-table-contextmenu/dist/bootstrap-table-contextmenu.min.js"></script> 
    <script src="bower_components/bootstrp3-editable/bootstrap3-editable/js/bootstrap-editable.js"></script> 
    <script src="bower_components/bootstrap-table/dist/extensions/editable/bootstrap-table-editable.js"></script> 
    <script src="bower_components/bootstrap-table/dist/locale/bootstrap-table-ru-RU.js"></script>
    <script src="bower_components/modernizr/modernizr.js"></script>
    <script src="bower_components/jquery-validation/dist/jquery.validate.js"></script> 
    <!-- endbuild -->   
    
    <script src="scripts/widget.js"></script>     
  </body>
</html>
