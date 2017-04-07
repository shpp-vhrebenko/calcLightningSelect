//=================== EVENTS MAIN FORM ================================

$(document).keydown(function(eventObject){
    if (eventObject.which == 27) {
      var parentURL = window.location.hash.slice(1);
      parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
    }            
});

$('#calcLightning').on('blur keyup change', 'input', function() { 
  var currentRoom = current_Room.getInstance().getCurrentRoom();         
  if ($('#calcLightning').valid() && (currentRoom.length >= 1)) {         
      $('#set_data').prop('disabled', false);
  } else {      
      $('#set_data').prop('disabled', 'disabled');
  }
});

$('#calcLightning').on('blur keyup change', 'select', function() { 
  var currentRoom = current_Room.getInstance().getCurrentRoom();     
  if ($('#calcLightning').valid()  && (currentRoom.length >= 1) ) {         
      $('#set_data').prop('disabled', false);
  } else {         
      $('#set_data').prop('disabled', 'disabled');
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
  console.log("heightRomm");
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
      if(key == "key") {
        var $inputKey = $("#key");
        var current = $inputKey.typeahead("getActive");
        if(current !== undefined) {
          if(parseInt(current.name) !== value) {                      
            $inputKey.val(value);
            $inputKey.typeahead("lookup");                       
          }
        } else {          
          $inputKey.val(value);
          $inputKey.typeahead("lookup");                   
        }                
      }
      localDataLamp.parameters[key]  = value;      
    });   
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
  }        
});

$('#requiredIllumination').change(function() {
  //console.log("chengeRequiredIllumination");
  var value = $(this).val();
  if(value != 1) {
    var valueCustomRequiredIllumination = $('#customRequiredIllumination').val();
    if(value != valueCustomRequiredIllumination) {
      $('#customRequiredIllumination').val(value);  
      $('#customRequiredIllumination').trigger('change');
    } 
  }     
});

$('#customRequiredIllumination').change(function() {
  //console.log("chengeCustomRequiredIllumination");
  var value = $(this).val();  
  var valueRequiredIllumination = $('#requiredIllumination').val();
  if(value != valueRequiredIllumination) {
    // First, get the elements into a list
    var requireOptions = $('#requiredIllumination option');
    // Next, translate that into an array of just the values
    var values = $.map(requireOptions, function(elt, i) {     
      return $(elt).val();
    });
    var searchValue;
    for (var i = 0; i < values.length; i++) {
      if(value == values[i]) { 
        searchValue = values[i];         
        break;     
      }
    }
    if(searchValue !== undefined) {      
      $('#requiredIllumination').val(searchValue);  
      $('#requiredIllumination').trigger('change');
    } else {     
      $('#requiredIllumination').val("1");
      $('#requiredIllumination').trigger('change');       
    }
  }
    
});

$('.room').change(function () { 
  //console.log("changeRoom");
  parameters[$(this).attr('id')] = $(this).val();
  localDataLamp.parameters = parameters;       
  localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
  var id = $(this).attr('id');  
});

//=================== END EVENTS MAIN FORM  ======================
//
//
//
//
//================================================================