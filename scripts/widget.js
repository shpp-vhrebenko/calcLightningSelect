//===================== API LOCAL DATA =====================================
var current_Room = (function () {
  var instance, // object singleton
      curRoom = {}, // current active room object(number_room, number_floor)
      tableData = [], // object data bootstrap-table
      curLamp = {}, // current lamp in table
      typeLamp = {}, // object json drawing
      lampSelect = {}, // object has value for options name lamp select
      editLamp = {}; // object has parameter edit lamp

  var setEditLamp = function (inputObject) {           
    $.each(inputObject, function(key, value) {
       editLamp[key] = value;
    });        
  };

  var getEditLamp= function () {        
    return editLamp;       
  };    

  var setLampSelect = function (inputObject) {       
    $.each(inputObject, function(key, value) {
       lampSelect[key] = value;
    });      
  };

  var getLampSelect = function () {        
    return lampSelect;       
  };

  var setTypeLamp = function (inputObject) {   
    typeLamp = {};    
    $.each(inputObject, function(key, value) {
       typeLamp[key] = value;
    });            
  };
  
  var getTypeLamp = function () {       
    return typeLamp;
  };     

  var getTableData = function () {    
    return tableData;
  };  


  var addElementToTableData = function (element) {
    tableData.push(element);         
    $('#bTable').bootstrapTable('load', tableData);    
  };  

  var chengeElementInTableData = function (element, chengeElementName) {    
    /* jshint loopfunc:true */ 
    if(tableData.length > 0) {      
      for (var i = 0; i < tableData.length ; i++) {
         var curTableElement = tableData[i];
         if((curTableElement.roomNumber === element.roomNumber) && (curTableElement.nameLamp === chengeElementName)) {
            $.each(element, function(key, val) {
              curTableElement[key] = val;  
            });
         }      
      } 
    }
         
    $('#bTable').bootstrapTable('load', tableData);    
  };  

  var removeElementFromTableData = function (element) {    
    var nameLamp = element.nameLamp;    
    var roomNumber = element.roomNumber;   
    for (var i = 0; i < tableData.length ; i++) {     
       if(tableData[i].roomNumber === roomNumber && tableData[i].nameLamp === nameLamp) {
          tableData.splice(i, 1);               
       }
    } 
    $('#bTable').bootstrapTable('load', tableData);  
  }; 

  var setCurrentRoom = function (numberRoom, numberFloor) {      
    curRoom.room = numberRoom;
    curRoom.floor = numberFloor;   
  };  

  var getCurrentRoom = function () {      
    return curRoom;
  };

  var clearCurrentRoom = function () {
    curRoom = {};    
  };

  var setCurrentLamp = function (objectLamp) {      
    for (var key in objectLamp) {
      curLamp[key] = objectLamp[key];
    }   
  };

  var getCurrentLamp = function () {   
    return curLamp;
  };

  var createInstance = function () {   
    return {
      setCurrentLamp: setCurrentLamp,
      getCurrentLamp: getCurrentLamp,
      setCurrentRoom: setCurrentRoom,
      getCurrentRoom: getCurrentRoom,
      clearCurrentRoom: clearCurrentRoom,
      getTableData: getTableData,
      addElementToTableData: addElementToTableData,
      chengeElementInTableData: chengeElementInTableData,
      removeElementFromTableData: removeElementFromTableData,
      setTypeLamp: setTypeLamp,
      getTypeLamp: getTypeLamp,
      setLampSelect: setLampSelect,
      getLampSelect: getLampSelect,
      setEditLamp: setEditLamp,
      getEditLamp: getEditLamp
    };
  };
  return {
    getInstance: function () {
      return instance || (instance = createInstance());
    }
  };
})();

//================ END API LOCAL DATA ==========================================
//
//
//
//
//
//
//==========================DOCUMENT READY======================================
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

    $('#edit_data').prop('disabled', 'disabled');
    $('#remove_data').prop('disabled', 'disabled');

    $('#calcLightning').on('blur keyup change', 'input', function() { 
      var currentRoom = current_Room.getInstance().getCurrentRoom();    
      if ($('#calcLightning').valid() && (currentRoom.length === 2)) {         
          $('#set_data').prop('disabled', false);
      } else {      
          $('#set_data').prop('disabled', 'disabled');
      }
    });

    $('#calcLightning').on('blur keyup change', 'select', function() { 
      var currentRoom = current_Room.getInstance().getCurrentRoom();     
      if ($('#calcLightning').valid()  && (currentRoom.length === 2) ) {         
          $('#set_data').prop('disabled', false);
      } else {         
          $('#set_data').prop('disabled', 'disabled');
      }
    });   

    typeLampFormValidation();    
});

$(document).keydown(function(eventObject){
    if (eventObject.which == 27) {
      var parentURL = window.location.hash.slice(1);
      parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
    }            
}); 

//=====================END DOCUMENT READY==========================
//
//
//
//
//
//
//
//==================POST MESSAGE===================================

/**
 * [ listener event 'message' from parent window (apply postMessage)] 
 */
window.addEventListener('message', function(event) {
  var a = event.data.message;
  window.location.hash = event.origin;
  if (a.cmd == 'put_data') {
    data = a.data;    
    var json_object = data;
    current_Room.getInstance().setTypeLamp(json_object);
    console.group("LOAD DATA"); 
    console.log(current_Room.getInstance().getTypeLamp());
    console.groupEnd();
    /*localDataLamp.jsonDrawing = json_object;
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));*/
    sendResultForDrawPlan(JSON.stringify(data));    
    //initSelectorNameLamp();       
  } else {
    initSelectorNameLamp();
  }
}, false);

/**
 * [get json data from parent window] 
 */
$('#put_data').on('click', function(event) {
  event.preventDefault();
  var parentURL = window.location.hash.slice(1); 
  var local_data = current_Room.getInstance().getTypeLamp();
  parent.window.postMessage({message: {cmd: 'return_data', data: local_data }}, parentURL);
});

/**
 * [send message to parent window] 
 */
$('#cancel').on('click', function(event) {
  event.preventDefault();
  var parentURL = window.location.hash.slice(1);
  parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
});

//========================END POST MESSAGE ========================
//
//
//
//
//=====================EVENT BOOTSTRAP TABLE=======================
$('#bTable').on('check.bs.table', function (e, row) {    
    current_Room.getInstance().setCurrentLamp(row);
    $('#edit_data').prop('disabled', false);
    $('#remove_data').prop('disabled', false);
});

$('#bTable').on('uncheck.bs.table', function (e, row) {    
    $('#edit_data').prop('disabled', 'disabled');
    $('#remove_data').prop('disabled', 'disabled');
});

$('#set_data').on('click', function(event) {
 // console.log("set_data");
  event.preventDefault(); 
  var currentRoomObject = getCurrentRoom();  
  var json_data = localStorage.getItem('typeLamp');
  var local_data = $.parseJSON(json_data);  
  var currentParameters = local_data.parameters; 
  var nameLamp = local_data.parameters.nameLamp;
  var data = {
    calc_countLamp : true,
    parameters : currentParameters,
    currentRoom : currentRoomObject
  };  
  sendAjaxForm(data,
                "calc_lighting.php",
                hideLoadingWraper,
                showLoadingWraper,
                viewCalcCountLamp,
                errorResponse,
                10000,
                'POST'); 
});

$('#remove_data').on('click', function(event) {
  console.log("remove_data");
  event.preventDefault();    
  var curRowTable = current_Room.getInstance().getCurrentLamp();  
  current_Room.getInstance().removeElementFromTableData(curRowTable);  
  removeLampFromLocalData(curRowTable);
  $('#edit_data').prop('disabled', 'disabled');
  $('#remove_data').prop('disabled', 'disabled');   
});

$('#edit_data').on('click', function(event) {
  console.log("edit_data");
  event.preventDefault();     
});   
//====================== END EVENT BOOTSTRAP TABLE ================
//
//
//
//
//
//
//====================== MODAL WINDOW EVENT =======================
$('#myModal').on('shown.bs.modal', function () {
  console.log("OPEN MODAL WINDOW");
  var currentLamp = current_Room.getInstance().getCurrentLamp();
  initSelectNameLampForFormEditLamp();
  initFormEdit(currentLamp);
  editLampFormValidation();
  
  $('#editLamp').on('blur keyup change', 'input', function() { 
    if ($('#editLamp').valid()) {         
        $('#saveEdit').prop('disabled', false);
    } else {      
        $('#saveEdit').prop('disabled', 'disabled');
    }
  });

  $('#editLamp').on('blur keyup change', 'select', function() {      
    if ($('#editLamp').valid()) {         
        $('#saveEdit').prop('disabled', false);
    } else {         
        $('#saveEdit').prop('disabled', 'disabled');
    }
  }); 

  $('#editLamp').on('change', '#requiredIllumination', function() { 
    var value = $(this).val();    
    $('#editLamp').find('#customRequiredIllumination').val(value);
  });   

  $('#myModal').on('click', '#search_lamp',  function(event) {
    console.log("search_lamp");
    event.preventDefault(); 
    var search_lamp = $('#myModal').find('#search_user_lamp').val();
    search_lamp = search_lamp.toUpperCase();  
    var lampList = current_Room.getInstance().getLampSelect();
    $.each(lampList, function(key, val) {
       var curLamp = lampList[key].nameLamp;
       curLampUpperCase = curLamp.toUpperCase();
       /*console.log(curLamp);*/
       if (curLampUpperCase.indexOf(search_lamp) != -1) {
          var selectTypeLamp = curLamp;        
          $('#editLamp').find('#nameLamp').val(selectTypeLamp);        
          $('#editLamp').find('#nameLamp').valid();
          $('#editLamp').find('#nameLamp').trigger('change');  
          return false;
        }
    });     
  }); 

   $('#editLamp').on('change', '#nameLamp', function() {    
    var value = $(this).val();
    var $option = $('option[value="'+value+'"]');     
    var editLamp = current_Room.getInstance().getEditLamp(); 
    $.each( $option.data(), function( key, value ) {   
      if(key == "photoLink") {
        $('#myModal').find('#js_photo_lamp').attr('src',value);
      } 
      if(key == "applyLamp") {
        $('#myModal').find('#info_lamp').text(" ");
        $('#myModal').find('#info_lamp').text("Область использования - " + value);
      }
      editLamp[key]  = value;      
    });   
    current_Room.getInstance().setEditLamp(editLamp);        
  }); 

  $('#editLamp').on('change', '#lampsWorkHeight', function() {
    var editLamp = current_Room.getInstance().getEditLamp(); 
    var value = $(this).val();
    var heightRoom = $('#editLamp').find('#heightRoom').val();
    if(value < heightRoom) {
      if(value > 0) {     
        editLamp.lampsWorkHeight = value;        
      }     
    } else {    
      if(heightRoom > 0){
        $('#editLamp').find('#lampsWorkHeight').val(heightRoom - 0.1);      
        editLamp.lampsWorkHeight = (heightRoom - 0.1);          
      } else {
        $('#editLamp').find('#lampsWorkHeight').val(0);      
        editLamp.lampsWorkHeight = 0;        
      }    
    } 
    current_Room.getInstance().setEditLamp(editLamp);  
  });

  $('#editLamp').on('change', '#heightRoom', function() {
    var editLamp = current_Room.getInstance().getEditLamp();
    var value = $(this).val();
    var lampsWorkHeight = $('#editLamp').find('#lampsWorkHeight').val();
    var cur = round((value - 0.1),2); 
    if(lampsWorkHeight === value) { 
      if(cur > 0) {
        $('#editLamp').find('#lampsWorkHeight').val(cur);     
        editLamp.lampsWorkHeight = cur;        
      }         
    }  
    editLamp.heightRoom = value;
    current_Room.getInstance().setEditLamp(editLamp);       
  }); 

  $('#editLamp').on('change','.edit_lamp' , function () { 
    var editLamp = current_Room.getInstance().getEditLamp();
    editLamp[$(this).attr('id')] = $(this).val();
    current_Room.getInstance().setEditLamp(editLamp);   
  });  
  
});

$('body').on('click', '#saveEdit', function (event) {   
  event.preventDefault(); 
  var editLamp = current_Room.getInstance().getEditLamp();
  var currentRoomObject = getCurrentRoomForEdit();   
  var currentRowLamp = current_Room.getInstance().getCurrentLamp(); 
  var currentNameLamp = currentRowLamp.nameLamp;
  var copyCurrentRoomObject = {};
  $.each(currentRoomObject, function(key, val) {
    copyCurrentRoomObject[key] = val;
  });
  if(copyCurrentRoomObject.hasOwnProperty('typeLamp')) {
    var ObjectTypeLamp = currentRoomObject.typeLamp;
    var chengeContent = {};
    $.each(ObjectTypeLamp, function(key, val) {
       if(key === currentNameLamp) {
          chengeContent[editLamp.nameLamp] = editLamp;  
       } else {
          chengeContent[key] = val;
       }
    });
    copyCurrentRoomObject.typeLamp = chengeContent;
  } 
  var data = {
    calc_countLamp : true,
    parameters : editLamp,
    currentRoom : copyCurrentRoomObject
  };    
  sendAjaxForm(data,
            "calc_lighting.php",
            hideLoadingWraper,
            showLoadingWraper,
            viewEditCalcCountLamp,
            errorResponse,
            10000,
            'POST');   
});
//====================== END MODAL WINDOW EVENT ===================
//
//
//
//
//
//
//Processing of events=============================================

$('#search_lamp').on('click', function(event) {
  console.log("search_lamp");
  event.preventDefault(); 
  var search_lamp = $('#search_user_lamp').val();
  search_lamp = search_lamp.toUpperCase();  
  var lampList = current_Room.getInstance().getLampSelect();

  $.each(lampList, function(key, val) {
     var curLamp = lampList[key].nameLamp;
     curLampUpperCase = curLamp.toUpperCase();
     /*console.log(curLamp);*/
     if (curLampUpperCase.indexOf(search_lamp) != -1) {
        var selectTypeLamp = curLamp;        
        $('#nameLamp').val(selectTypeLamp);        
        $('#nameLamp').valid();
        $('#nameLamp').trigger('change');  
        return false;
      }
  });     
}); 

$('#lampsWorkHeight').change(function() {
  /*console.log("heightRoomlighting");*/
  var value = $(this).val();
  var heightRoom = $('#heightRoom').val();
  if(value < heightRoom) {
    if(value > 0) {     
      parameters.lampsWorkHeight = value;
      localDataLamp.parameters = parameters;   
      localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
    }     
  } else {    
    if(heightRoom > 0){
      $('#lampsWorkHeight').val(heightRoom - 0.1);      
      parameters.lampsWorkHeight = (heightRoom - 0.1);
      localDataLamp.parameters = parameters;       
      localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));  
    } else {
      $('#lampsWorkHeight').val(0);      
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
  var cur = round((value - 0.1),2); 
  if(lampsWorkHeight === value) { 
    if(cur > 0) {
      $('#lampsWorkHeight').val(cur);     
      parameters.lampsWorkHeight = cur;
      localDataLamp.parameters = parameters;     
      localStorage.setItem('typeLamp', JSON.stringify(localDataLamp)); 
    }         
  }  
  parameters.heightRoom = value;
  localDataLamp.parameters = parameters;   
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));       
});

$('#nameLamp').change(function() { 
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

/**
 * [hendler event onclick current room]
 * @param  {[DOM element]} element [element event oncklick]
 */
function onSelectRoom(element) { 
  if(element.getAttribute("class") == "activePolygon" ) {
    element.removeAttribute("class");
    element.setAttribute("fill", "rgb(255,204,153)");
    $('#info_type_lamp').empty();
   // $('#set_data').fadeOut("slow");
    $( "#set_data" ).prop( "disabled", 'disabled');
    current_Room.getInstance().clearCurrentRoom();
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
    if ($('#calcLightning').valid()) {              
      $('#set_data').prop('disabled', false);
    } else {            
      $('#set_data').prop('disabled', 'disabled');
    }               
  }     
}
//======END FUNCTIONS HANDLER EVENTS ==============================
//
//
//
//
//
//
//================= FUNCTIONS MAIN WINDOW=====================================

// 1.defaultInit
// 2.setInputValue
// 3.init
// 3.initSelectorNameLamp
// 4.valid
// 5.sendResultForDrawPlan
// 6.viewDraw
// 7.sendAjaxForm
// 8.viewCalcCountLamp
// 9.viewErrorResponse
// 10.viewResultInTable
// 11.errorResponse
// 12.hideLoadingWraper
// 13.showLoadingWraper


/**
 * [Initial default properties for lamp] 
 */
function defaultInit() {
  console.log("defaultInit");
  if(localDataLamp.parameters === undefined) {   
    setInputValue("reflectionCoef", "20,50,70"); 
    setInputValue("safetyFactor", "1.4"); 
    setInputValue("lampsWorkHeight", 0.8); 
  } else {    
    if(localDataLamp.parameters.reflectionCoef === undefined) {
    setInputValue("reflectionCoef", "20,50,70");   
    }
    if(localDataLamp.parameters.safetyFactor === undefined) {
      setInputValue("safetyFactor", "1.4");  
    }
    if(localDataLamp.parameters.lampsWorkHeight === undefined) {     
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
          current_Room.getInstance().setLampSelect(jsonResult);   
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
      url:     "draw_plan.php", 
      type:     'POST',
      timeout: 10000,
      data: {draw_plan : true, hourse: jsonObject},     
      success: function(data) { 
        var result = $.parseJSON(data);
        viewDraw(result);           
      },
      error: function(response, status, error) {  
          viewErrorResponse("Не полученно чертеж. Или полученные данные не коректны!");   
      },
      complete: initSelectorNameLamp      
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
 * [sendAjaxForm description]
 * @param  {[object]} sendData           [description]
 * @param  {[string]} url                [description]
 * @param  {[name function]} beforeSendFunction [description]
 * @param  {[name function]} completeFunction   [description]
 * @param  {[name function]} successFunction    [description]
 * @param  {[name function]} errorFunction      [description]
 * @param  {[integer]} timeout            [description]
 * @param  {[string]} typeRequest        [description] 
 */
function sendAjaxForm(sendData,
                      url,
                      beforeSendFunction,
                      completeFunction,
                      successFunction,
                      errorFunction,
                      timeout,
                      typeRequest) {    
  $.ajax({
      url:     url, 
      type:     typeRequest,
      timeout: timeout,
      data: sendData,        
      beforeSend: beforeSendFunction,
      complete: completeFunction,
      success: successFunction,
      error: errorFunction     
  });
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
 * [view result calc count lamp]
 * @param  {[json string]} result [result ajax responce] 
 */
function viewCalcCountLamp(result) {
  var currentRoomObject = getCurrentRoom();  
  var json_data = localStorage.getItem('typeLamp');
  var local_data = $.parseJSON(json_data);  
  var currentParameters = local_data.parameters; 
  var nameLamp = currentParameters.nameLamp;
  var resultResponse = $.parseJSON(result); 
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
      // console.log(resultResponse.calcCountLamp);
       var calcCountLamp = resultResponse.calcCountLamp;
      if(calcCountLamp) {        
        var objectLamp = {};        
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
        var room_data = current_Room.getInstance().getTypeLamp();                              
        addLampInLocalData(objectLamp, nameLamp);               
      }                     
    } else {            
      viewErrorResponse("Введенные данные некорректны");            
    }          
  } 
}

/**
 * View result calc caunt and choice lamp
 * @param  {[object]} currentLamp  [description]
 * @param  {[string]} room_number  [description]
 * @param  {[string]} floor_number [description]
 * @param  {[string]} chengeName   [description]
 */
function viewResultInTable(currentLamp, room_number, floor_number, chengeName) {
  console.log("viewResultInTable");   
  floor_number = parseInt(floor_number) + 1;
  room_number = parseInt(room_number) + 1;
  var objectRow = {
    nameLamp: currentLamp.nameLamp,
    roomNumber: floor_number + "/" + room_number,    
    roomArea: currentLamp.resultCalc.roomArea,
    lampsCount: currentLamp.resultCalc.lampsCount,
    requiredIllumination: currentLamp.requiredIllumination,
    reflectionCoef: currentLamp.reflectionCoef,
    safetyFactor: currentLamp.safetyFactor,
    powerLamp: currentLamp.powerLamp,
    lampsWatt: currentLamp.resultCalc.lampsWatt,
    heightRoom: currentLamp.heightRoom,
    lampsWorkHeight: currentLamp.lampsWorkHeight,
    photoLink: currentLamp.photoLink,
    customRequiredIllumination: currentLamp.customRequiredIllumination    
  };
  if(chengeName) {
    current_Room.getInstance().chengeElementInTableData(objectRow, chengeName); 
  } else {
    current_Room.getInstance().addElementToTableData(objectRow);
  }
   
}

/**
 * [view error response]
 * @param  {[xhtr object]} response [description]
 * @param  {[string]} status   [description]
 * @param  {[string]} error    [description] 
 */
function errorResponse(response, status, error) {
   viewErrorResponse(response.reresponseText);
}

/**
 * [ hide loading wraper] 
 */
function hideLoadingWraper() {
  $(".js_loading_wraper").fadeIn("slow");
} 

/**
 * [ show loading wraper] 
 */
function showLoadingWraper() {
  $(".js_loading_wraper").fadeOut("slow");
}

//==============END FUNCTIONS MAIN WINDOW =====================================
//
//
//
//
//
//
//
//================= FUNCTIONS MODAL WINDOW ===================================

//1. initFormEdit
//2. initSelectNameLampForFormEditLamp
//3. viewEditCalcCountLamp

/**
 * [init properties lamp from LocalStorage] 
 */
function initFormEdit(parameters) {
  console.log('initFormEdit');
  var editLamp = current_Room.getInstance().getEditLamp();    
  $.each(parameters, function(key, value) { 
    editLamp[key] = value;
    if(key == "photoLink") {
      var $photo_lamp = $('#myModal').find('img#js_photo_lamp');
        $photo_lamp.attr('src',value);
      }            
    var $currentInput = $('form#editLamp').find('input#' + key);     
    var $currentSelect = $('form#editLamp').find('select#' + key);                        
    $currentInput.val(value);
    $currentSelect.val(value);   
  });
  current_Room.getInstance().setEditLamp(editLamp);    
}


/**
 * [init Select Name Lamp For Form Edit Lamp] 
 */
function  initSelectNameLampForFormEditLamp() {
  console.log("initSelectNameLampForFormEditLamp");
  var objectSelectLamp = current_Room.getInstance().getLampSelect();  
  var formEditLamp = $('#editLamp').find('select#nameLamp');  
  $.each(objectSelectLamp, function() {
      formEditLamp.append(
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
}

/**
 * [view edit Calc Count Lamp]
 * @param  {[json string]} result [description] 
 */
function viewEditCalcCountLamp(result) {  
  var editLamp = current_Room.getInstance().getEditLamp();
  var nameLamp = editLamp.nameLamp;
  var resultResponse = $.parseJSON(result); 
  console.group("RESULT EDIT CALC COUNT LAMP");    
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
      // console.log(resultResponse.calcCountLamp);
       var calcCountLamp = resultResponse.calcCountLamp;
      if(calcCountLamp) {        
        var objectLamp = {}; 
        objectLamp = editLamp; 
        objectLamp.resultCalc = calcCountLamp;                                         
        addLampInLocalDataAfterEdit(objectLamp, nameLamp);               
      }                     
    } else {            
      viewErrorResponse("Введенные данные для редактирования некорректны");            
    }          
  } 
}
//================= END FUNCTIONS MODAL WINDOW ========================
//
//
//
//
//
//
//=============== FUNCTION FOR WORK WITH LOCAL DATA API ===============

// 1. getCurrentRoom
// 2. getCurrentRoomForEdit
// 3. addLampInLocalData
// 4. removeLampFromLocalData
// 5. addLampInLocalDataAfterEdit

/**
 * [get Current Room object from local data = current room in draw]
 * @return {[object]} [description]
 */
function getCurrentRoom() {   
   var data = current_Room.getInstance().getTypeLamp();
   var curRoom = current_Room.getInstance().getCurrentRoom();  
   var roomObject = {}; 
   var cur = data.floors[curRoom.floor].rooms[curRoom.room];
   $.each(cur, function(key, val) {      
      roomObject[key] = val;      
   });
   return roomObject;
}

/**
 * [get Current Room For Edit from local data = current row in table]
 * @return {[object]} [description]
 */
function getCurrentRoomForEdit() {   
   var data = current_Room.getInstance().getTypeLamp();
   var curRoom = current_Room.getInstance().getCurrentLamp(); 
   var param = curRoom.roomNumber.split('/');
   var floor = parseInt(param[0]) - 1;
   var room = parseInt(param[1]) - 1;
   var roomObject = {}; 
   var cur = data.floors[floor].rooms[room];
   $.each(cur, function(key, val) {      
      roomObject[key] = val;      
   });
   return roomObject;
}

/**
 * [add Lamp In LocalData after calc lamp]
 * @param {[object]} objectLamp [object serialize form calc lamp]
 */
function addLampInLocalData(objectLamp, nameLamp) {  
  var data = current_Room.getInstance().getTypeLamp();  
  var curRoom = current_Room.getInstance().getCurrentRoom();
  var room = curRoom.room;
  var floor = curRoom.floor;
  if(data.floors[floor].rooms[room].hasOwnProperty('typeLamp')) {    
    data.floors[floor].rooms[room].typeLamp = objectLamp;    
  } else {     
    data.floors[floor].rooms[room].typeLamp = {};    
    $.each(objectLamp, function(key, val) {      
      data.floors[floor].rooms[room].typeLamp[key] = val;      
    });       
  }  
  current_Room.getInstance().setTypeLamp(data);  
  viewResultInTable(objectLamp[nameLamp], room, floor);   
}

/**
 * [remove Lamp From Local Data]
 * @param  {[object]} curLamp [object current row in table] 
 */
function removeLampFromLocalData(curLamp) {
  var data = current_Room.getInstance().getTypeLamp();  
  var nameLamp = curLamp.nameLamp;
  var floorAndRoom =  curLamp.roomNumber.split('/');  
  var room = parseInt(floorAndRoom[1]) - 1 ;
  var floor = parseInt(floorAndRoom[0]) - 1;
  var objectTypeLamp = data.floors[floor].rooms[room].typeLamp; 
  if(objectTypeLamp.length === 1) {   
    var objectRoom = data.floors[floor].rooms[room];    
    var resultRooomObject = {};
     $.each(objectRoom, function(key, val) {
        if(key != "typeLamp") {
          resultRooomObject[key] = val;
        }
      });
     data.floors[floor].rooms[room] = resultRooomObject;     
  } else {    
    var resultObject = {};
    $.each(objectTypeLamp, function(key, val) {
      if(key != nameLamp) {
        resultObject[key] = val;
      }
    });
    data.floors[floor].rooms[room].typeLamp = resultObject;   
  }   
  current_Room.getInstance().setTypeLamp(data); 
}

/**
 * [add Lamp In Loca Data After Edit]
 * @param {[object]} objectLamp [object result serialize form edit and calc lamp]
 * @param {[string]} nameLamp   [name lamp for chenge]
 */
function addLampInLocalDataAfterEdit(objectLamp, nameLamp) {
  console.log("addLampInLocalDataAfterEdit");
  var data = current_Room.getInstance().getTypeLamp();   
  var curRoom= current_Room.getInstance().getCurrentLamp();
  var currentNameLamp = curRoom.nameLamp; 
  var param = curRoom.roomNumber.split('/');
  var floor = parseInt(param[0]) - 1;
  var room = parseInt(param[1]) - 1; 
  if(data.floors[floor].rooms[room].hasOwnProperty('typeLamp')) { 
    var currentTypeLamp = data.floors[floor].rooms[room].typeLamp;
    var chengeTypeLamp = {};
    $.each(currentTypeLamp, function(key, val) {
      if(key === currentNameLamp) {
        chengeTypeLamp[nameLamp] = objectLamp;
      } else {
        chengeTypeLamp[key] = val;
      }
    });  
    data.floors[floor].rooms[room].typeLamp = chengeTypeLamp;    
  }   
  current_Room.getInstance().setTypeLamp(data);
  viewResultInTable(objectLamp, room, floor, currentNameLamp);   
}

//=============== FUNCTION FOR WORK WITH LOCAL DATA API ===============
//
//
//
//
//
//=============== FUNCTIONS for FUNCTIONAL ===========================

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

/**
 * [get description]
 * @param  {[type]} ) {                   return Object.keys(this).length;    }} [description]
 * @return {[type]}   [description]
 */
Object.defineProperty(Object.prototype, "length", {
    enumerable: false,
    get: function() {
        return Object.keys(this).length;
    }
});
//=============== END FUNCTIONS for FUNCTIONAL ===========================








