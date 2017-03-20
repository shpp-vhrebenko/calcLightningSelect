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