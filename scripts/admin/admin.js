var admin = {
    login: "admin@ml",
    password: "adminML",
    time: 0    
};

$(document).ready(function() {
	$('#form_admin_panel').validate({
    debug: true,
    rules:{
      login_value:{
          required: true            
      },
      password_value:{
          required: true,            
      }
    },
    messages:{
      login_value:{
          required: 'Это поле обязательно для заполнения'
      },
      password_value:{
          required: 'Это поле обязательно для заполнения'
      }
    },
      focusInvalid: false,
      errorPlacement: function (error, element) {
        return true;
      }
  });
	console.info($('#form_admin_panel').valid());
  getLastUpdateTime();
});

$('#form_admin_panel').on('blur keyup change', 'input', function() {          
  if ($('#form_admin_panel').valid()) {         
      $('#submit_admin').prop('disabled', false);           
  } else {      
      $('#submit_admin').prop('disabled', 'disabled');      
  }
});

$('#submit_admin').on('click', function(event) {
  console.log("submit_admin");
  event.preventDefault();
  var login = $('#login').val();
  var password = $('#password').val();
  if(login == admin.login && password == admin.password) {
    $('#update_ml').css('visibility','visible');
    $('#error_submit_admin').text(' ');
  } else {
    $('#error_submit_admin').text('Вы ввели не верно логин или пароль!');
  }  
});

$('#update_ml').on('click', function(event) {
  $('#error_submit_admin').text(' ');
  console.log("updateDB");
  startResponse();  
  var sendData = { upload_widget_data: true};  
  sendAjaxForm(sendData,
    "auto_update_ml.php",    
    hideLoadingWraper,
    showLoadingWraper,
    viewResultUpdate,
    viewErrorResponse,
    600000,
    'POST');  
});

function getLastUpdateTime() {  
  var sendData = { get_time_last_update: true};
  sendAjaxForm(sendData,
    "auto_update_ml.php",    
    hideLoadingWraper,
    showLoadingWraper,
    viewLastUpdateTime,
    viewErrorResponse,
    3000,
    'POST');  
}

function viewResultUpdate(data) {
  var result = $.parseJSON(data);
  var time = (parseInt(result.time) * 1000); 
  console.log("viewResultUpdate");
  console.log(time);  
  var dt = new Date(time);
  var month = dt.getMonth()+1;
  if(month < 10){
    month = "0" + month;
  }
  var day = dt.getDate();
  if(day < 10){
    day = "0" + day;
  }
  var year = dt.getFullYear();     
  $('#result_submit_admin').html('Обновление данных прошло успешно.<br/> Дата обновления:' + 
    day + '-' + month + '-' + year);
  endResponse(); 
}

function viewLastUpdateTime(data) {
  var result = $.parseJSON(data);
  var time = (parseInt(result.time) * 1000); 
  console.log("viewLastUpdateTime");
  console.log(time);  
  var dt = new Date(time);
  var month = dt.getMonth()+1;
  if(month < 10){
    month = "0" + month;
  }
  var day = dt.getDate();
  if(day < 10){
    day = "0" + day;
  }
  var year = dt.getFullYear(); 
  $('#last_time_submit').text('Дата последнего обновления:' + day + '-' + month + '-' + year);  
}

function viewErrorResponse(response, status, error) {
  console.log(error);
  console.log(status);
  console.log(response);
  $('#error_submit_admin').text('Произошла ошибка при обновлении БД!');
}

function sendAjaxForm(sendData,
    url,
    beforeSendFunction,
    completeFunction,
    successFunction,
    errorFunction,
    timeout,
    typeRequest) {
    $.ajax({
        async: true,
        url: url,
        type: typeRequest,
        timeout: timeout,
        data: sendData,
        beforeSend: beforeSendFunction,
        complete: completeFunction,
        success: function(response) {
            successFunction(response, sendData);
        },
        error: errorFunction
    });
}

function startResponse() {
  /*Data = new Date();
  Hour = Data.getHours();
  Minutes = Data.getMinutes();
  Seconds = Data.getSeconds();*/
  var date = new Date();
  admin.time = date.getTime();
 /* $('#time_update').text('');
  $('#time_update').text("Время начала обновления: "+Hour+":"+Minutes+":"+Seconds);*/
}

function endResponse() {
  /*var curText = $('#time_update').text();
  Data = new Date();
  Hour = Data.getHours();
  Minutes = Data.getMinutes();
  Seconds = Data.getSeconds();*/
  var date = new Date();
  var curTime = date.getTime();
  var resultTime = (curTime - admin.time)/1000;
  var result = "";
  if(resultTime > 60) {
    var min  = parseInt(resultTime/60);
    var sec = parseInt(resultTime%60);
    result = min + "мин. " + sec + " сек."; 
  } else {
    result = parseInt(resultTime) + " сек.";
  }
  $('#time_update').text('');
  /*$('#time_update').html(curText + ".<br/> Время конца обновления: "+Hour+":"+Minutes+":"+Seconds);*/
  $('#time_update').html("Продолжительность обновления: " + result);
}

/**
 * [ show loading wraper] 
 */
function hideLoadingWraper() {  
  $(".js_loading_wraper").fadeIn("slow");
}

/**
 * [ hide loading wraper] 
 */
function showLoadingWraper() {  
  $(".js_loading_wraper").fadeOut("slow");
}