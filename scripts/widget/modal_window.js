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
    //console.log("chengeRequiredIllumination_modalWindow");
    var value = $(this).val();
    if(value != 1) {
      var valueCustomRequiredIllumination = $('#editLamp').find('#customRequiredIllumination').val();
      if(value != valueCustomRequiredIllumination) {
        $('#editLamp').find('#customRequiredIllumination').val(value);
        $('#editLamp').find('#customRequiredIllumination').trigger('change');
      }  
    }       
  });   

  $('#editLamp').on('change', '#customRequiredIllumination', function() { 
    //console.log("chengeCustomRequiredIllumination_modalWindow");
    var value = $(this).val(); 
    var valueRequiredIllumination = $('#editLamp').find('#requiredIllumination').val();
    if(value != valueRequiredIllumination) {
      // First, get the elements into a list
      var requireOptions = $('#editLamp').find('#requiredIllumination option');
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
        $('#editLamp').find('#requiredIllumination').val(searchValue);  
        $('#editLamp').find('#requiredIllumination').trigger('change');
      } else {  
        $('#editLamp').find('#requiredIllumination').val("1");        
        $('#editLamp').find('#requiredIllumination').trigger('change');       
      }              
    }     
  }); 

 /* $('#myModal').on('click', '#search_lamp',  function(event) {
    console.log("search_lamp");
    event.preventDefault(); 
    var search_lamp = $('#myModal').find('#search_user_lamp').val();
    search_lamp = search_lamp.toUpperCase();  
    var lampList = current_Room.getInstance().getLampSelect();
    $.each(lampList, function(key, val) {
       var curLamp = lampList[key].nameLamp;
       curLampUpperCase = curLamp.toUpperCase();      
       if (curLampUpperCase.indexOf(search_lamp) != -1) {
          var selectTypeLamp = curLamp;        
          $('#editLamp').find('#nameLamp').val(selectTypeLamp);        
          $('#editLamp').find('#nameLamp').valid();
          $('#editLamp').find('#nameLamp').trigger('change');  
          return false;
        }
    });     
  });*/ 

  $('#editLamp').on('change', '#nameLamp', function() {    
    var value = $(this).val();
    if(value !== null) {
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
    }           
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
  
  //================= BOOTSTRAP TOOLTIP ===========================    
  $('[data-toggle="tooltip"]').tooltip(); 
  //================= END BOOTSTRAP TOOLTIP =======================

  //================= AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============
  var selectLamp = current_Room.getInstance().getLampAutocomplit();  
  var $input = $("#search_lamp");
  $input.typeahead({
    source: selectLamp,
    autoSelect: true
  });
  $input.change(function() {    
    var selectTypeLamp = $input.val();
    $('#editLamp').find('#nameLamp').val(selectTypeLamp);        
    $('#editLamp').find('#nameLamp').valid();
    $('#editLamp').find('#nameLamp').trigger('change');      
  });
  //============= END AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD ============= 
  
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
//================== FUNCTIONS MODAL WINDOW =======================

//1. initFormEdit
//2. initSelectNameLampForFormEditLamp
//3. viewEditCalcCountLamp

/**
 * [init properties lamp from LocalStorage] 
 */
function initFormEdit(parameters) {
  console.log('initFormEdit');
  var editLamp = current_Room.getInstance().getEditLamp(); 
  console.log(editLamp);   
  $.each(parameters, function(key, value) { 
    editLamp[key] = value;
    if(key == "photoLink") {
      var $photo_lamp = $('#myModal').find('img#js_photo_lamp');
      $photo_lamp.attr('src',value);
    } else if(key == "requiredIllumination") {
      var requireOptions = $('#editLamp').find('#requiredIllumination option');
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
        $('#editLamp').find('#requiredIllumination').val(searchValue);        
      } else {  
        $('#editLamp').find('#requiredIllumination').val("1");                
      } 
    } else {
      var $currentInput = $('form#editLamp').find('input#' + key);     
      var $currentSelect = $('form#editLamp').find('select#' + key);                        
      $currentInput.val(value);
      $currentSelect.val(value);  
    }               
     
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