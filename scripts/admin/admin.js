var admin = {
    login: "admin@ml",
    password: "adminML"    
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
  $.ajax({
    async: true,
    url: "calc_lighting.php",
    type: 'POST',
    timeout: 300000,
    data: { upload_widget_data: true},
    beforeSend: function() {
        $(".js_loading_wraper").fadeIn("slow");
    },
    complete: function() {
        $(".js_loading_wraper").fadeOut("slow");        
    },
    success: function(data) {
        console.log(data);
    },
    error: function(response, status, error) {
        console.log(error);
        $('#error_submit_admin').text('Произошла ошибка при обновлении БД!');
    }
  }); 
});