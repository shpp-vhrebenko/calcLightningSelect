<?php
  session_start();
       
      if(isset($_POST["viewPDF"])) { 
        $data = $_POST["local_data"];        
        post_redirect($data);        
     } 
  

  function post_redirect( $data) {
      $_SESSION['calcLightningModuleCad5d'] = $data;      
  }
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
      <div class="row">       
        <div class="col-xs-12 col-md-5 headerBlock" id="draw-plan"> 
          <div id="alert-tooltip">
            <p>Выберите комнату на чертеже, в которой нужно рассчитать освещение</p>
          </div>           
          <h3 class="draw-plan__header">Шаг 1. Выберите комнату на чертеже</h3>
          <ul class="nav nav-tabs " id="tabs_plan">                                
          </ul>
          <div class="tab-content">
          </div>                                
        </div>
        <div class="col-xs-12 col-md-7 headerBlock" id="select-box">          
          <h3 class="select-box__header">Шаг 2. Выберите светильник(и)</h3>
          <div class="row">
            <div class="col-xs-8 col-md-7 box-content">
              <!-- Form calcLightning  -->                 
              <form class="form-horizontal"
                id="calcLightning"
                role="form"
                name="calcLightning"
                method="post"
                action=""> 
                <!-- <div class="form-group">
                  <label for="key" class="col-sm-4 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="Выбирете артикул светильника" placeholder="артикул светильника">Артикул</label>
                  <div class="col-sm-8">                    
                    <input type="text" class="input-sm" name="key" data-provide="typeahead" id="key"/>
                  </div>
                </div> -->
                <div class="form-group">
                  <label for="search_user_lamp" class="col-sm-4 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="Выбирете наименование светильника">Поиск</label>
                  <div class="col-sm-8">                    
                    <input type="text" data-provide="typeahead" name="search_user_lamp"  class="form-control input-sm" id="search_user_lamp" placeholder="наименование светильника" /> 
                  </div>
                </div>                
                <div class="form-group">
                  <label for="nameLamp" class="col-sm-4 control-label">Cветильник</label>
                  <div class="col-sm-8">                    
                    <select name="nameLamp" id="nameLamp" class="room input-sm" required >
                      <option selected value="">Выберите тип светильника</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="heightRoom" class="col-sm-4 control-label">Высота помещения, м</label>
                  <div class="col-sm-8">                    
                    <input class="room input-sm" type="number" id="heightRoom" name="heightRoom" placeholder="2.5" min="0.0" step="0.1" required/>
                  </div>
                </div>
                <div class="form-group">
                  <label for="lampsWorkHeight" class="col-sm-4 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="Высота на которой необходимо обеспечить требуемое освещение">Рабочая поверхность, м</label>
                  <div class="col-sm-8">                    
                    <input  type="number" class="room input-sm" id="lampsWorkHeight" name="lampsWorkHeight" placeholder="0.8" min="0.0" step="0.1" required />
                  </div>
                </div> 
                <div class="form-group">
                  <label for="reflectionCoef" class="col-sm-4 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="Коэффициент отражения поверхностей">Коэф. отражения</label>
                  <div class="col-sm-8">                    
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
                  </div>
                </div>
                <div class="form-group">
                  <label for="safetyFactor" class="col-sm-4 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="Запас освещенности">Коэф. запаса</label>
                  <div class="col-sm-8">                    
                    <select class="room input-sm" id="safetyFactor" name="safetyFactor"  required>
                      <option selected value="">Выберите значение коэффициента запаса</option>      
                      <option value="1.1">1.1</option>
                      <option value="1.4">1.4</option>
                      <option value="1.6">1.6</option>
                      <option value="1.7">1.7</option>
                    </select>
                  </div>
                </div>  
                <div class="form-group">
                  <label for="requiredIllumination" class="col-sm-4 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="по ГОСТ">Треб. освещ. лк</label>
                  <div class="col-sm-8">                    
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
                  </div>
                </div> 
                <div class="form-group">
                  <label for="customRequiredIllumination" class="col-sm-4 control-label">Треб. освещ. лк</label>
                  <div class="col-sm-8">                    
                    <input class="room input-sm" type="number" id="customRequiredIllumination" name="customRequiredIllumination" min="0" step="1"/>
                  </div>
                </div>                            
              </form>
              <!-- End Form calcLightning  -->              
            </div>
            <div class="col-xs-4 col-md-5" id="image-box">
              <div class="row">
                <img src="" class="img-responsive animated fadeInDownBig image-animate col-md-12" id="js_photo_lamp" alt=""> 
              </div>
              <div class="row">
                <fieldset class="col-md-12">
                <legend>Область использования:</legend>
                <p id="info_lamp"></p>
              </fieldset> 
              </div>
              <div class="row">
                <button type="button" class="btn btn-sm btn-warning col-xs-12 col-md-12" id="set_data">              
               Шаг 3. Добавить светильник
              </button>               
              </div>                           
            </div>           
          </div>        
        </div>                     
      </div>      
      <div class="row relativeBox">
        <div class="col-xs-12 col-md-12" id="table-box">          
          <h3 class="table-box__header">Результаты расчета освещения</h3>
          <p id="error_message_request" class="error_message"></p> 
            <!--  Bootstrap-tables -->

          <div class="table-responsive">         
            <table id="bTable"  data-group-by="true" data-group-by-field="roomTitle"></table>     
          </div> 

          <!-- Bootstrap table context menu -->  
          <ul id="example1-context-menu" class="dropdown-menu">              
              <li data-item="delete"><a>Удалить</a></li>              
          </ul>
          <!-- End Bootstrap table context menu --> 

          <!-- End Bootstrap-tables -->  
          <!-- User Panel  --> 
          <div class="col-md-3 col-sm-6 col-xs-6" id="user-result-panel">
            <div class="row">
              <button type="button" class="btn btn-sm btn-default col-sm-2 col-md-3 col-xs-3" id="view_pdf">
              PDF
              </button>             
              <button type="button" class="btn btn-sm btn-primary col-sm-3 col-md-4 col-xs-3" id="put_data">
                Сохранить
              </button> 
              <button type="button" class="btn btn-sm btn-default col-sm-3 col-md-4 col-xs-3" id="cancel">
                Отмена
              </button> 
            </div>                       
          </div> 
          <!-- End User Panel  --> 
        </div>
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
    <script src="bower_components/bootstrap-table/dist/extensions/group-by-v2/bootstrap-table-group-by.js"></script>
    <!-- <script src="vendor/bootstrap-table-sortBy-v3.js"></script> -->
    <script src="bower_components/bootstrap-table/dist/locale/bootstrap-table-ru-RU.js"></script>
    <script src="bower_components/modernizr/modernizr.js"></script>
    <script src="bower_components/jquery-validation/dist/jquery.validate.js"></script>     
    <!-- endbuild -->       
    
    <script src="scripts/widget.js"></script>     
  </body>
</html>
