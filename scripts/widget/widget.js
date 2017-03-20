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
//=================== EVENTS MAIN WIDGET WINDOW =====================

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
//=============== END EVENTS MAIN WIDGET WINDOW ===================

//=============== FUNCTIONS HANDLER EVENTS ========================

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

