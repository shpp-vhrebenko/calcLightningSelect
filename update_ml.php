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
    <!-- build:js scripts/admin_head_vendor.js -->
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
    <div class="login-body">
        <article class="container-login center-block">
        <section>
          <ul id="top-bar" class="nav nav-tabs nav-justified">
            <li class="active"><a type="button">Админ панель</a></li>
            <li><a type="button" id="update_ml" class="update_ml" >Обновить БД</a></li>
          </ul>          
          <div class="tab-content tabs-login col-lg-12 col-md-12 col-sm-12 cols-xs-12">
            <div id="login-access" class="tab-pane fade active in">
              <h2><i class="glyphicon glyphicon-log-in"></i> Модуль освещения</h2>           
              <form class="form-horizontal" id="form_admin_panel">
                <div class="form-group ">
                  <label for="login" class="sr-only">Логин</label>
                    <input type="text" class="form-control" name="login" id="login" 
                      placeholder="Email" tabindex="1" required />
                </div>
                <div class="form-group ">
                  <label for="password" class="sr-only">Пароль</label>
                    <input type="password" class="form-control" name="password" id="password"
                      placeholder="Password" tabindex="2" required/>
                </div>                 
                <div class="form-group ">       
                    <button type="button" id="submit_admin" tabindex="5" class="btn btn-lg btn-primary" disabled>Войти</button>
                </div> 
                <div class="alert-box">
                  <p class="message_last_update" id="last_time_submit"></p>
                  <p class="message_last_update" id="time_update"></p> 
                  <p class="error_submit_admin" id="error_submit_admin"></p>                 
                  <p class="message_submit_admin" id="result_submit_admin"></p>
                </div>                
              </form>     
            </div>
          </div>
        </section>
      </article>
    </div>   

    <!-- build:js scripts/admin_vendor.js --> 
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>    
    <script src="bower_components/lodash/lodash.js"></script>    
    <script src="bower_components/modernizr/modernizr.js"></script>
    <script src="bower_components/jquery-validation/dist/jquery.validate.js"></script>     
    <!-- endbuild -->       
    
    <script src="scripts/admin.js"></script>     
  </body>
</html>
