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
    
    //================= AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============
    var selectLamp = current_Room.getInstance().getLampAutocomplit();   
    var $input = $("#search_user_lamp");
    $input.typeahead({
      source: selectLamp,
      autoSelect: true
    });
    $input.change(function() {    
      var selectTypeLamp = $input.val();
      $('#nameLamp').val(selectTypeLamp);        
      $('#nameLamp').valid();
      $('#nameLamp').trigger('change');      
    });
    //============= END AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============
    
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

/*$('#search_lamp').on('click', function(event) {
  console.log("search_lamp");
  event.preventDefault(); 
  var search_lamp = $('#search_user_lamp').val();
  search_lamp = search_lamp.toUpperCase();  
  var lampList = current_Room.getInstance().getLampSelect();

  $.each(lampList, function(key, val) {
     var curLamp = lampList[key].nameLamp;
     curLampUpperCase = curLamp.toUpperCase();     
     if (curLampUpperCase.indexOf(search_lamp) != -1) {
        var selectTypeLamp = curLamp;        
        $('#nameLamp').val(selectTypeLamp);        
        $('#nameLamp').valid();
        $('#nameLamp').trigger('change');  
        return false;
      }
  });     
}); */

$('#draw_plan').on('click', '.select_all', function() { 
  var floor = $(this).data('id');
  $div = $('div#' + floor);
  $tabContent = $('#draw_plan').find('.tab-content');
  $currentTab = $tabContent.find($div);
  if(!$currentTab.hasClass('selectAll')) {
    $currentTab.addClass("selectAll");
    $allRooms = $currentTab.find('polygon[id^=room]');       
    $allRooms.attr("class","activePolygon");
    $allRooms.attr("fill","rgb(92,184,92)");
    addElementsToCurRoom(floor, $allRooms.length); 
    var currentRoom = current_Room.getInstance().getCurrentRoom();       
    if ($('#calcLightning').valid()) {              
      $('#set_data').prop('disabled', false);
    } else {            
      $('#set_data').prop('disabled', 'disabled');
    }     
  } else {
    $currentTab.removeClass("selectAll");
    $allRooms = $currentTab.find('polygon[id^=room]');    
    $allRooms.attr("class","");
    $allRooms.attr("fill","rgb(255,204,153)"); 
    removeElementsFromCurRoom(floor, $allRooms.length); 
    var currentRoom_2 = current_Room.getInstance().getCurrentRoom();
    console.log(currentRoom_2);
    var curRoomsLength = current_Room.getInstance().getCurrenRoomLength();
    if(curRoomsLength === 0) {
      $( "#set_data" ).prop( "disabled", 'disabled');
    }    
  }
  
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
  if(value !== null) {    
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
  }        
});

$('#requiredIllumination').change(function() {
  var value = $(this).val();
  parameters.customRequiredIllumination = value;
  localDataLamp.parameters = parameters;  
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
  $('#customRequiredIllumination').val(value);  
  $('#customRequiredIllumination').trigger('change');
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
//
//
//
//
//
//=============== FUNCTIONS HANDLER EVENTS MAIN WINDOW========================

/**
 * [hendler event onclick current room]
 * @param  {[DOM element]} element [element event oncklick]
 */
function onSelectRoom(element) { 
  var currentId = element.getAttribute("id");
  var curArray = currentId.split("_");    
  var curFloor = curArray[1];
  var curRoom = curArray[2]; 
  if(element.getAttribute("class") == "activePolygon" ) {
    element.removeAttribute("class");
    element.setAttribute("fill", "rgb(255,204,153)"); 
    current_Room.getInstance().removeElementCurrentRooms(curRoom, curFloor);
    var curRoomsLength = current_Room.getInstance().getCurrenRoomLength();
    if(curRoomsLength === 0) {
      $( "#set_data" ).prop( "disabled", 'disabled');
    }     
  } else {
    //var $activePolygon = $(".activePolygon");   
    //$('.tab-content').find($activePolygon).removeClass("activePolygon").attr("fill","rgb(255,204,153)");
    element.setAttribute("class", "activePolygon");
    element.setAttribute("fill", "rgb(92,184,92)");    
    current_Room.getInstance().addElementCurrentRooms(curRoom, curFloor);     
    if ($('#calcLightning').valid()) {              
      $('#set_data').prop('disabled', false);
    } else {            
      $('#set_data').prop('disabled', 'disabled');
    }               
  }     
}
//======END FUNCTIONS HANDLER EVENTS ==============================

