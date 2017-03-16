var current_Room = (function () {
  var instance,
      curRoom = {};  

  var setCurrentRoom = function (numberRoom, numberFloor) {
    console.log("setCurrentRoom");    
    curRoom.room = numberRoom;
    curRoom.floor = numberFloor;
    console.log(curRoom);
  };

  var getCurrentRoom = function () {
    console.log("getCurrentRoom");
    console.log(curRoom);
    return curRoom;
  };

  var createInstance = function () {
    console.log("createInstance");
    return {
      setCurrentRoom: setCurrentRoom,
      getCurrentRoom: getCurrentRoom
    };
  };
  return {
    getInstance: function () {
      return instance || (instance = createInstance());
    }
  };
})();


if(localStorage.typeLamp) {
  var listDataLamp = JSON.parse(localStorage.getItem('typeLamp'));
}
/*var currentRoom = {};*/
var localDataLamp = listDataLamp || {};
console.group("LocalStorage");
console.log(localDataLamp);
console.groupEnd();
var parameters = {};
if(listDataLamp && listDataLamp.hasOwnProperty('parameters')) {
  parameters = listDataLamp.parameters; 
}
$(document).ready(function() {     
    defaultInit();          // Initial default properties for lamp
    init();                 // init properties lamp from LocalStorage 
    initSelectorNameLamp(); // init select nameLamp   
    setTimeout(function(){  // timeout for procesing function initSelectorNaneLamp
      valid();      
    }, 1500);  

    $('#calcLightning').on('blur keyup change', 'input', function() {
     /* console.log("changeInput");*/
      if ($('#calcLightning').valid()) {
          $('#calcButton').prop('disabled', false);
          $('#set_data').prop('disabled', false);
      } else {
          $('#calcButton').prop('disabled', 'disabled');
          $('#set_data').prop('disabled', 'disabled');
      }
    });

    $('#calcLightning').on('blur keyup change', 'select', function() {
      /*console.log("changeSelect");*/
      if ($('#calcLightning').valid()) {
          $('#calcButton').prop('disabled', false);
          $('#set_data').prop('disabled', false);
      } else {
          $('#calcButton').prop('disabled', 'disabled');
          $('#set_data').prop('disabled', 'disabled');
      }
    });

    $('#calcButton').click(
      function(){        
        sendAjaxForm( localDataLamp.jsonDrawing , 'calc_lighting.php');
        return false;
      }
    ); 

    typeLampFormValidation();    
});

$(document).keydown(function(eventObject){
    if (eventObject.which == 27) {
      var parentURL = window.location.hash.slice(1);
      parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
    }            
}); 


//==================POST MESSAGE===================================

/**
 * [ listener event 'message' from parent window (apply postMessage)] 
 */
window.addEventListener('message', function(event) {
  var a = event.data.message;
  window.location.hash = event.origin;
  if (a.cmd == 'put_data') {
    data = a.data;
    //var json_object = $.parseJSON(data);
    var json_object = data;
    var floor = json_object.floors[0];
    var room = floor.rooms[0];
    var room_space = room.room_area;    
    $('#text_room_space').text("S = " + room_space + "м.кв"); 
    localDataLamp.jsonDrawing = json_object;
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
    sendResultForDrawPlan(JSON.stringify(data));
    console.group("LOAD DATA");    
    console.log(json_object);
    console.groupEnd();
    // Выполняем далее необходимое с полученным джсон (если это нужно на показе Виджета)
  }
}, false);

/**
 * [get json data from parent window] 
 */
$('#put_data').on('click', function(event) {
  event.preventDefault();
  var parentURL = window.location.hash.slice(1); 
  //console.log(parentURL); 
  parent.window.postMessage({message: {cmd: 'return_data', data: localDataLamp.jsonResultDrawing }}, parentURL);
});

/**
 * [send message to parent window] 
 */
$('#cancel').on('click', function(event) {
  event.preventDefault();
  var parentURL = window.location.hash.slice(1);
  parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
});

//==========================================================================


//Processing of events=============================================
/**
 * [get json data from parent window] 
 */
$('#set_data').on('click', function(event) {
  console.log("set_data");
  event.preventDefault();    
  var curRoomObject = getCurrentRoom();  
  var data = getLocalTypeLamp();  
  var nameLamp = data.parameters.nameLamp; 
  calcCountLamp(data.parameters, curRoomObject, "calc_lighting.php"); 
}); 

$('#heightRoomlighting').change(function() {
  /*console.log("heightRoomlighting");*/
  var value = $(this).val();
  var heightRoom = $('#heightRoom').val();
  if(value < (heightRoom - 0.1)) {
    $('#text_heightRoomlighting').text(value);
    parameters.lampsWorkHeight = value;
    localDataLamp.parameters = parameters;   
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));  
  } else {
    if(heightRoom > 0){
      $('#lampsWorkHeight').val(heightRoom - 0.1);
      $('#text_heightRoomlighting').text(heightRoom - 0.1);
      parameters.lampsWorkHeight = (heightRoom - 0.1);
      localDataLamp.parameters = parameters;       
      localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));  
    } else {
      $('#lampsWorkHeight').val(0);
      $('#text_heightRoomlighting').text(0);
      parameters.lampsWorkHeight = 0;
      localDataLamp.parameters = parameters; 
      localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
    }    
  }   
});

$('#heightRoom').change(function() {
 /* console.log("heightRomm");*/
  var value = $(this).val();
  var lampsWorkHeight = $('#lampsWorkHeight').val();
  if(lampsWorkHeight !== 0) {
    var cur = round((value - 0.1),2);  
    $('#lampsWorkHeight').val(cur); 
    $('#text_heightRoomlighting').text(cur); 
    parameters.lampsWorkHeight = cur;
    localDataLamp.parameters = parameters;     
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));     
  }  
  parameters.heightRoom = value;
  localDataLamp.parameters = parameters;   
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));       
});

$('#nameLamp').change(function() {
  console.log("nameLamp");
  var value = $(this).val();
  var $option = $('option[value="'+value+'"]'); 
  var param = {};  
  $.each( $option.data(), function( key, value ) {   
    if(key == "photoLink") {
      $('#js_photo_lamp').attr('src',value);
    } 
    if(key == "applyLamp") {
      $('#info_lamp').text("Область использования - " + value);
    }
    localDataLamp.parameters[key]  = value;      
  });   
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));      
});

$('#requiredIllumination').change(function() {
  var value = $(this).val();
  parameters.customRequiredIllumination = value;
  localDataLamp.parameters = parameters;  
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
  $('#customRequiredIllumination').val(value);  
});

$('.room').change(function () { 
  /*console.log("changeRoom");*/
  parameters[$(this).attr('id')] = $(this).val();
  localDataLamp.parameters = parameters;       
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
  var id = $(this).attr('id');  
});

$('.room_param').change(function () { 
  var curentTextElement = "#text_" + $(this).attr('id');  
  $(curentTextElement).text($(this).val() + ' m');  
}); 

// FUNCTIONS HANDLER EVENTS =======================================
// 
/**
 * [hendler event onclick current room]
 * @param  {[DOM element]} element [element event oncklick]
 */
function onSelectRoom(element) { 
  if(element.getAttribute("class") == "activePolygon" ) {
    element.removeAttribute("class");
    element.setAttribute("fill", "rgb(255,204,153)");
    $('#info_type_lamp').empty();
    $('#set_data').fadeOut("slow");
  } else {
    var $activePolygon = $(".activePolygon");
    $('#info_type_lamp').empty();
    $('.tab-content').find($activePolygon).removeClass("activePolygon").attr("fill","rgb(255,204,153)");
    element.setAttribute("class", "activePolygon");
    element.setAttribute("fill", "rgb(92,184,92)");
    var currentId = element.getAttribute("id");
    var curArray = currentId.split("_");    
    var curFloor = curArray[1];
    var curRoom = curArray[2]; 
    current_Room.getInstance().setCurrentRoom(curRoom, curFloor);   
    var jsonDrawing = localDataLamp.jsonDrawing;
    var floor = jsonDrawing.floors[curFloor];
    var room = floor.rooms[curRoom];    
    if('typeLamp' in room) {
      //console.log(room.typeLamp);
      var roomTypeLamp = {};
      roomTypeLamp = room.typeLamp; 
      var currentRoomNumber = parseInt(currentRoom.room) + 1; 
      var $numberRoom = $('<p>').text("Комната № " + currentRoomNumber);
      var $infoTypeLamp = $('#info_type_lamp');
      $infoTypeLamp.empty();
      $infoTypeLamp.append($numberRoom);
      $.each(roomTypeLamp, function(key, val) {
            var currentLamp = val;
            var $infoLamp = $("<div>").attr("class","info_lamp"); 
            var $nameLamp = $('<p>').text("Название светильника: " + currentLamp.nameLamp);
            var $requiredIllumination = $('<p>').text("Требуемая освещенность: " + currentLamp.requiredIllumination);
            $infoLamp.append($nameLamp)
                  .append($requiredIllumination); 
            if(currentLamp.hasOwnProperty('resultCalc')) {
              var resultCalc = currentLamp.resultCalc;
              var $roomArea = $('<p>').text("Площадь помещения: " + resultCalc.roomArea + " м.кв");
              var $countLamp = $('<p>').text("Количество светильников: " + resultCalc.lampsCount + " шт");
              var $lampsWatt = $('<p>').text("Общая мощность светильников: " + resultCalc.lampsWatt + " Вт");
              $infoLamp.append($roomArea)
                        .append($countLamp)
                        .append($lampsWatt);

            }      
            $infoTypeLamp.append($infoLamp);             
      });

  
  
  


/*
      var $infoTypeLamp = $('#info_type_lamp');      
      var $numberRoom = $('<p>').text("Комната № " + currentRoomNumber);
      var $nameLamp = $('<p>').text("Название светильника: " + room.typeLamp.nameLamp);
      var $requiredIllumination = $('<p>').text("Требуемая освещенность: " + room.typeLamp.requiredIllumination + " лк");
      $infoTypeLamp.append($numberRoom)
                          .append($nameLamp)
                          .append($requiredIllumination);*/
      if('resultCalc' in room.typeLamp) {
        var resultCalc = room.typeLamp.resultCalc;
        var $countLamp = $('<p>').text("Количество светильников: " + resultCalc.lampsCount + " шт");
        var $lampsWatt = $('<p>').text("Общая мощность светильников: " + resultCalc.lampsWatt + " Вт");
        $infoTypeLamp.append($countLamp)
                     .append($lampsWatt);
      }                    
    }
    
    if ($('#calcLightning').valid()) { 
      $('#set_data').fadeIn("slow");        
      $('#set_data').prop('disabled', false);
    } else { 
      $('#set_data').fadeIn("slow");         
      $('#set_data').prop('disabled', 'disabled');
    }    
  }    
}


// FUNCTIONS ======================================================

// 1.defaultInit
// 2.init
// 3.initSelectorNameLamp
// 4.valid
// 5.setInputValue
// 6.viewDraw
// 7.sendAjaxForm
// 8.viewResult
// 9.viewErrorResponse
// 10.round

/**
 * [Initial default properties for lamp] 
 */
function defaultInit() {
  console.log("defaultInit");
  if(localDataLamp.parameters === undefined) {
    console.log("hi");
    setInputValue("reflectionCoef", "20,50,70"); 
    setInputValue("safetyFactor", "1.4"); 
    setInputValue("lampsWorkHeight", 0.8); 
  } else {
    console.log("iii");
    if(localDataLamp.parameters.reflectionCoef === undefined) {
    setInputValue("reflectionCoef", "20,50,70");   
    }
    if(localDataLamp.parameters.safetyFactor === undefined) {
      setInputValue("safetyFactor", "1.4");  
    }
    if(localDataLamp.parameters.lampsWorkHeight === undefined) {
      console.log("lampsWorkHeight");
      setInputValue("lampsWorkHeight", 0.8);    
    }
  }
  
}

/**
 * [set Input Value]
 * @param {[string]} input [id input]
 * @param {[string or number]} value [value input]
 */
function setInputValue(input, value) {  
  console.log("setInputValue");
  $input = $('#' + input); 
  console.log($input); 
  $input.val(value);
  parameters[input] = value;
  localDataLamp.parameters = parameters;  
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));  
}

/**
 * [init properties lamp from LocalStorage] 
 */
function init() {
  console.log('init');  
  $.each(localDataLamp.parameters, function(key, value) {  
    if(key == "photoLink") {
      $('#js_photo_lamp').attr('src',value);
    }        
    var $currentInput = $('form#calcLightning').find($('input#' + key)); 
    var $currentSelect = $('form#calcLightning').find($('select#' + key));
    var $currentText = $('svg#room_plan').find($('text#text_' + key));               
    $currentInput.val(value);
    $currentSelect.val(value);
    $currentText.text(value);
  });  
}

/**
 * [init select nameLamp]
 */
function initSelectorNameLamp() {
  console.log("initSelectorTypeLampMongodb");  
   $.ajax({
      url: 'calc_lighting.php',
      type: 'GET',  
      timeout: 10000,
      data: {select_type_lamp : true },
      beforeSend: function(){
         $(".js_loading_wraper").fadeIn("slow");
      },
      complete: function(){
         $(".js_loading_wraper").fadeOut("slow"); 
      },
      success: function(data) {         
          var jsonResult = $.parseJSON(data);   
          $.each(jsonResult, function() {            
              $('#nameLamp').append(
                  $('<option></option>').text(this.nameLamp)
                                        .val(this.nameLamp)                                       
                                        .attr('data-lumix', this.lumix)
                                        .attr('data-power-lamp', this.powerLamp)
                                        .attr('data-number-lamps', this.numberLamps)
                                        .attr('data-usagecoefficient', this.usagecoefficient)
                                        .attr('data-link', this.link)
                                        .attr('data-photo-link', this.photo_lamp)
                                        .attr('data-type-lamp', this.typeLamp)
                                        .attr('data-apply-lamp', this.application_area)
                  );

          }); 
          if(localDataLamp.parameters.nameLamp) {
             $('#nameLamp').val(localDataLamp.parameters.nameLamp);
             $('#nameLamp').valid();
          }  
          if(localDataLamp.parameters.photoLink) {
             $('#js_photo_lamp').attr('src', localDataLamp.parameters.photoLink);             
          }
          if(localDataLamp.parameters.applyLamp) {
             $('#info_lamp').text(localDataLamp.parameters.applyLamp);             
          }             
      },
      error: function(response, status, error) { // Данные не отправлены
        viewErrorResponse(response.reresponseText);     
      }
    });
}

/**
 * [valid form and procesing event disable button] 
 */
function valid() {
  console.log("valid");
  if( $('#calcLightning').valid()) {
    $('#calcButton').prop('disabled', false);
  }    
}

/**
 * [send Result For Draw Plan]
 * @param  {[object]} jsonObject [json object draw] 
 */
function sendResultForDrawPlan(jsonObject) {
  console.log("sendResultForDrawPlan");
  $.ajax({
      url:     "draw_plan.php", //url страницы (action_ajax_form.php)
      type:     'POST',
      timeout: 10000,
      data: {draw_plan : true, hourse: jsonObject},     
      success: function(data) { //Данные отправлены успешно
        var result = $.parseJSON(data);
        viewDraw(result);           
      },
      error: function(response, status, error) { // Данные не отправлены  
          viewErrorResponse("Не полученно чертеж. Или полученные данные не коректны!");   
      }      
  });
}

/**
 * [Processing the form of the calculation of lighting]
 * @param  {[object]} localData [localStorage object]
 * @param  {[string]} url       [url action script]
 * @return {[object]}           [result response]
 */
function sendAjaxForm(localData, url) {    
  $.ajax({
      url:     url, //url страницы (action_ajax_form.php)
      type:     'POST',
      timeout: 10000,
      data: {calc_lighting : true, draw_object: localData},        
      beforeSend: function(){
         $(".js_loading_wraper").fadeIn("slow");
      },
      complete: function(){ 
         $(".js_loading_wraper").fadeOut("slow");
      },
      success: function(data) { //Данные отправлены успешно
        var resultResponse = $.parseJSON(data); 
        console.group("RESULT CALC LIGHTNING");    
        console.log(resultResponse);
        console.groupEnd();             
        if('error' in resultResponse) {
          console.info("error code - " + resultResponse.error.code);
          console.info("file error - " + resultResponse.error.file);
          console.info("line error - " + resultResponse.error.line);
          viewErrorResponse(resultResponse.error.message);
        } else {
          if ('calcLighting' in resultResponse) {
            localDataLamp.jsonResultDrawing = resultResponse.calcLighting;
            localDataLamp.jsonDrawing = resultResponse.calcLighting;
            localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
            $('#info_type_lamp').empty(); 
            $('#put_data').show();
            //viewResult(resultResponse.calcLighting);
            //viewResultPDF();             
          } else {
            viewErrorResponse("Введенные данные некорректны");
          }          
        }
                
      },
      error: function(response, status, error) { // Данные не отправлены      
        viewErrorResponse(response.reresponseText);
      }      
  });
}

/**
 * [view Draw]
 * @param  {[object]} resultDraw [object draw] 
 */
function viewDraw(resultDraw) {
  for (var i = 0; i < resultDraw.length; i++) {
    $li = $('<li>');
    if(i === 0) {
      $li.addClass("active");
    }
    $li.append($("<a>").attr({"data-toggle":"tab","href": "#" + i}).text("Этаж №" + (i + 1)));
    $('#tabs_plan').append($li);
    $div = $('<div>').attr('id',i); 
    if(i === 0) {
      $div.addClass("tab-pane fade in active");
    } else {
      $div.addClass("tab-pane fade");
    }
    $div.append(resultDraw[i]);
    $('.tab-content').append($div);
  } 
}

/**
 * [view result response]
 * @param  {[object]} response [result response]
 */
function viewResult(response) {  
  var currentFloor = response.floors[0];
  var currentRoom = currentFloor.rooms[0];
  var calcLighting = currentRoom.typeLamp;
  var $result_calcLightning = $('#result_calcLightning');
  $result_calcLightning.empty();
  $result_calcLightning.append($('<table>').addClass('table table-striped')
                          .append($('<thead>')
                            .append($('<tr>')
                              .append($('<th>').text('Наименование'))
                              .append($('<th>').text('Тип'))
                              .append($('<th>').text('Количество'))
                              .append($('<th>').text('Общая мощность'))
                            )
                          )
                          .append($('<tbody>')
                            .append($('<tr>')
                              .append($('<td>').text('Светильник'))
                              .append($('<td>').text(calcLighting.lampName))
                              .append($('<td>').text(calcLighting.lampsCount))
                              .append($('<td>').text(calcLighting.lampsWatt))
                            )
                          )
                        );
}

/**
 * [view result calc lighting in PDF] 
 */
function viewResultPDF() {
  location.href = 'viewPDF.php';
  /*$.ajax({
    url: '#',
    type: 'POST',    
    data: {viewPDF: true},
  })
  .done(function() {
    console.log("success viewPDF");
  })
  .fail(function() {
    console.log("error viewPDF");
  }); */ 
}

/**
 * [view Error Response]
 * @param  {[string]} errorMessage [text error response] 
 */
function viewErrorResponse(errorMessage) {
  $('#error_message_request').text('');
  $('#error_message_request').text(errorMessage);
}

/**
 * [round number]
 * @param  {[number]} a [description]
 * @param  {[number]} b [description]
 * @return {[number]}   [description]
 */
function round(a,b) {
 b=b || 0;
 return Math.round(a*Math.pow(10,b))/Math.pow(10,b);
} 

function calcCountLamp(currentParameters, currentRoomObject, url) {   
   $.ajax({
      url:     url, //url страницы (action_ajax_form.php)
      type:     'POST',
      timeout: 10000,
      data: {calc_countLamp : true, parameters: currentParameters, currentRoom: currentRoomObject},        
      beforeSend: function(){
         $(".js_loading_wraper").fadeIn("slow");
      },
      complete: function(){ 
         $(".js_loading_wraper").fadeOut("slow");
      },
      success: function(data) { //Данные отправлены успешно
        var resultResponse = $.parseJSON(data); 
        console.group("RESULT CALC COUNT LAMP");    
        console.log(resultResponse);
        console.groupEnd();             
        if('error' in resultResponse) {
          console.info("error code - " + resultResponse.error.code);
          console.info("file error - " + resultResponse.error.file);
          console.info("line error - " + resultResponse.error.line);
          viewErrorResponse(resultResponse.error.message);
          return false;
        } else {
          if ('calcCountLamp' in resultResponse) {
            $('#put_data').show();
             console.log(resultResponse.calcCountLamp);
             var calcCountLamp = resultResponse.calcCountLamp;
            if(calcCountLamp) {
              var nameLamp = currentParameters.nameLamp;
              var objectLamp = {};
               console.log(objectLamp); 
              if(currentRoomObject.hasOwnProperty("typeLamp")) {                     
                $.each(currentRoomObject.typeLamp, function(key, val) {
                   objectLamp[key] = val;
                });                 
                objectLamp[nameLamp] = currentParameters; 
                objectLamp[nameLamp].resultCalc = calcCountLamp;  
              } else {              
                objectLamp[nameLamp] = currentParameters;                
                objectLamp[nameLamp].resultCalc = calcCountLamp;                  
              }                   
              addResultInLocalData(objectLamp, nameLamp);               
            }                     
          } else {            
            viewErrorResponse("Введенные данные некорректны");            
          }          
        }                
      },
      error: function(response, status, error) { // Данные не отправлены      
        viewErrorResponse(response.reresponseText);
       
      }      
  });
   
}

function getLocalTypeLamp() {
  var json_data = localStorage.getItem('typeLamp');
  var data = $.parseJSON(json_data); 
  return data;
}

function getCurrentRoom(currentRoom) {
   var data = getLocalTypeLamp(); 
   var curRoom = current_Room.getInstance().getCurrentRoom();   
   var roomObject = data.jsonDrawing.floors[curRoom.floor].rooms[curRoom.room];
   return roomObject;
}

function addResultInLocalData(objectLamp, nameLamp) {
  local_data = getLocalTypeLamp();
  var curRoom = current_Room.getInstance().getCurrentRoom();
  var room = curRoom.room;
  var floor = curRoom.floor;
  local_data.jsonDrawing.floors[floor].rooms[room].typeLamp = objectLamp;
  console.log(local_data);
  localStorage.setItem('typeLamp', JSON.stringify(local_data));
  var currentRoomNumber = parseInt(room) + 1;
  viewResultInTable(objectLamp[nameLamp], currentRoomNumber);   
}

function viewResultInTable(currentLamp, room_number) {
  var $tableBody = $('#data_table_body');
  var currentRoomNumber = room_number; 
  console.log(currentLamp);  
  $table_tr = $('<tr>');
  $table_tr.append(($('<td>').text(currentLamp.nameLamp)))
            .append(($('<td>').text(currentRoomNumber)))
            .append(($('<td>').text(currentLamp.resultCalc.roomArea))) 
            .append(($('<td>').text(currentLamp.resultCalc.lampsCount))) 
            .append(($('<td>').text(currentLamp.requiredIllumination))) 
            .append(($('<td>').text(currentLamp.reflectionCoef))) 
            .append(($('<td>').text(currentLamp.safetyFactor))) 
            .append(($('<td>').text(currentLamp.powerLamp)))
            .append(($('<td>').text(currentLamp.resultCalc.lampsWatt)));
$tableBody.append($table_tr);
 
  
 /* $.each(roomTypeLamp, function(key, val) {
      var currentLamp = val;
      var $infoLamp = $("<div>").attr("class","info_lamp"); 
      var $nameLamp = $('<p>').text("Название светильника: " + currentLamp.nameLamp);
      var $requiredIllumination = $('<p>').text("Требуемая освещенность: " + currentLamp.requiredIllumination);
      $infoLamp.append($nameLamp)
            .append($requiredIllumination); 
      $infoTypeLamp.append($infoLamp); */
}
