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
  //===============================================================
  //
  //
  //
  //
  //============= INITIAL BOOTSTRAP-TABLS =========================
  var tableData = current_Room.getInstance().getTableData();  
  var $bTable = $('#bTable').bootstrapTable({
      contextMenu: '#example1-context-menu',
      onContextMenuItem: function(row, $el){
          if($el.data("item") == "delete"){
            var curRowTable = row;
            console.log("remove_data");             
            current_Room.getInstance().removeElementFromTableData(curRowTable);  
            removeLampFromLocalData(curRowTable);
            $('#edit_data').prop('disabled', 'disabled');
            $('#remove_data').prop('disabled', 'disabled');
          }
      },      
      idField: 'name',
      source: tableData,      
      pagination: true,
      search: true,
      toolbar: "#toolbar",
      clickToSelect: true,
      singleSelect: true,
      checkboxHeader: false,      
      height: 400,
      pageSize: 10,
      pageList: [10,15,20],
      classes: "table table-condensed",          
      columns: [
      {
          field: 'state',          
          checkbox: true,
          class: "half",
          formatter: runningFormatter
      },
      {
          field: 'index',
          title: '№',
          titleTooltip: "№ по порядку",  
          class: "col-md-1 half-col-md forTooltip",         
          formatter: runningFormatter
      },
      {
          field: 'nameLamp',
          title: 'Наименование </br> светильника',
          sortable: true,        
          class: "col-md-3"
      }, {
          field: 'roomNumber',
          title: '№',
          sortable: true,          
          class: "col-md-1 forTooltip half-col-md",          
          tooltip: true,
          titleTooltip: "№ этажа / № комнаты"          
      }, {
          field: 'roomArea',
          title: 'Площадь</br>комнаты',
          container: 'body',          
          class: "col-md-1",
          editable: {
            type: 'number',
            min: 0.1,
            mode: 'popup',
            placement: 'right',
            step: 0.1
          }          
      }, {
          field: 'lampsCount',
          title: 'Кол-во.</br>свет-ков',
          container: 'body',         
          class: "col-md-1",
          editable: {
            type: 'number',
            min: 1,
            mode: 'popup',
            placement: 'right'
          } 

      }, {
          field: 'requiredIllumination',
          title: 'Треб. </br>освещ. лк',                    
          class: "col-md-1",
          editable: {
            type: 'number',
            min: 1,              
            mode: 'popup',
            placement: 'left'            
          }           
      }, {
          field: 'reflectionCoef',
          title: 'Коэф.</br>отражения',                   
          class: "col-md-1",
          editable: {
            type: 'select',
            source: [
              { value : "0,0,0" , text: "0,0,0"},            
              { value : "30,30,10" , text: "30,30,10"},
              { value : "50,30,10" , text: "50,30,10"},
              { value : "50,50,10" , text: "50,50,10"},
              { value : "70,50,20" , text: "70,50,20"},
              { value : "80,30,10" , text: "80,30,10"},
              { value : "80,50,30" , text: "80,50,30"},
              { value : "80,80,30" , text: "80,80,30"}
            ],
            mode: 'popup',
            placement: 'left'
          }                    
      }, {
          field: 'safetyFactor',
          title: 'Коэф.</br>запаса',         
          class: "col-md-1",
          editable: {
            type: 'select',
            source: [
              { value : 1.1 , text: "1.1"},
              { value : 1.4 , text: "1.4"},
              { value : 1.6 , text: "1.6"},
              { value : 1.7 , text: "1.7"}
            ],
            mode: 'popup',
            placement: 'left'            
          }            
      }, {
          field: 'allPowerLamps',
          title: 'Мощ-ть</br>1шт. Вт',
          titleTooltip: "Мощность 1 светильника",         
         class: "col-md-1 forTooltip"           
      }, {
          field: 'lampsWatt', 
          class: "col-md-1 forTooltip",
          title: 'Мощ-ть</br>всех Вт',
          titleTooltip: "Мощность всех светильников",           
      }]
  });

  $('#bTable').on('post-body.bs.table', function () {
      $('.forTooltip').attr("data-tooltip","true");
      $('[data-tooltip="true"]').tooltip({
          container: 'body'
      });
  });   

  $bTable.on('editable-save.bs.table', function (e, field, row, old, $el) {      
    if(field === "lampsCount") {
      console.log("chengeLampsCount");       
      var roomNumber = row.roomNumber;
      var roomParam = roomNumber.split("/");    
      var curFloor = parseInt(roomParam[0]) - 1;
      var curRoom = parseInt(roomParam[1]) - 1;         
      //var currentNameLamp = row.nameLamp;
      var currentNameLamp = row.typeLamp;
      var data = current_Room.getInstance().getTypeLamp();
      if(data.floors[curFloor].rooms[curRoom].hasOwnProperty('typeLamp')) {
        var typeLamp = data.floors[curFloor].rooms[curRoom].typeLamp;          
        typeLamp[currentNameLamp].resultCalc.lampsCount = row.lampsCount;
      }
      current_Room.getInstance().setTypeLamp(data);        
    } else {
      console.log("chengeCalcCount");
      if(field === "requiredIllumination") {
        row.customRequiredIllumination = row.requiredIllumination;
      }        
      var currentRoomObject = getCurrentRoomForEdit(row);
      //var curNameLamp = row.nameLamp;
      var curNameLamp = row.typeLamp;
      row.perimetr = getRoomPerimetr(currentRoomObject.walls);        
      if(currentRoomObject.hasOwnProperty('typeLamp')) {
        var ObjectTypeLamp = currentRoomObject.typeLamp;
        var chengeContent = {};
        $.each(ObjectTypeLamp, function(key, val) {
           if(key === curNameLamp) {
              chengeContent[curNameLamp] = row;  
           } else {
              chengeContent[key] = val;
           }
        });
        currentRoomObject.typeLamp = chengeContent;        
      }  
      var sendData = {
        calc_countLamp : true,
        parameters : row          
      };    
      sendAjaxForm(sendData,
                "calc_lighting.php",
                hideLoadingWraper,
                showLoadingWraper,
                viewEditCalcCountLamp,
                errorResponse,
                10000,
                'POST');  
      
    }
    
  });

  function runningFormatter(value, row, index) {
      return 1+index;
  } 
  //============= END INITIAL BOOTSTRAP-TABLS =====================
  //
  //
  //
  //
  //
  //================================================================

    defaultInit();          // Initial default properties for lamp
    init();                 // init properties lamp from LocalStorage      

    $('#edit_data').prop('disabled', 'disabled');
    $('#remove_data').prop('disabled', 'disabled');

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
    //==============================================================
    // 
    //  
    //   
    //    
    //================= BOOTSTRAP TOOLTIP ===========================    
    $('[data-toggle="tooltip"]').tooltip(); 
    //================= END BOOTSTRAP TOOLTIP ======================= 
    //
    //
    //
    //
    //    
    //================= AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============
    var selectLamp = current_Room.getInstance().getLampAutocomplit();    
    var selectLampKey = current_Room.getInstance().getLampAutocomplitKey();  
    var $input = $("#search_user_lamp");
    var $inputKey = $("#keyLamp");
    $input.typeahead({
      source: selectLamp,
      autoSelect: true
    });
    $input.change(function() {   
      var current = $input.typeahead("getActive");      
      var selectTypeLamp = $input.val();
      $('#nameLamp').val(current.id);        
      $('#nameLamp').valid();
      $('#nameLamp').trigger('change');      
    });

    $inputKey.typeahead({
      source: selectLampKey,
      autoSelect: true
    });
    $inputKey.change(function() {  
      console.log("changeTypeHead"); 
      var current = $inputKey.typeahead("getActive");       
      $('#nameLamp').val(current.id);        
      $('#nameLamp').valid();
      $('#nameLamp').trigger('change');      
    });
    //============= END AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============   
    //
    //
    //
    //
    //
    //
    //===============================================================    
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
        var $inputKey = $("#keyLamp");
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

$('#draw_plan').on('click', '.select_all', function() { 
  console.log("select_all");
  var floor = $(this).data('id');
  $div = $('div#' + floor);
  $tabContent = $('#draw_plan').find('.tab-content');
  $currentTab = $tabContent.find($div);

  // initial floor height for current room 
  $currentDraw = $currentTab.find('svg');
  var ceiling = $currentDraw.attr('data-ceiling');
  if(ceiling !== undefined && $('#heightRoom').val() !== ceiling) {    
    $('#heightRoom').val(ceiling);
    $('#heightRoom').trigger('change');
  } 
  // end initial floor height for current room
  
  if(!$currentTab.hasClass('selectAll')) {
    $currentTab.addClass("selectAll");
    $allRooms = $currentTab.find('polygon[id^=room]');
    var countActiveRoom = 0;   
    for (var i = 0; i < $allRooms.length; i++) {      
      var currentRoom = $allRooms[i];
      var currentId = currentRoom.getAttribute("id");      
      var curArray = currentId.split("_");    
      var curFloor = curArray[1];
      var curRoom = curArray[2];
      if(currentRoom.getAttribute("class") != "activePolygon") {
        countActiveRoom++;
        currentRoom.setAttribute("class","activePolygon");
        currentRoom.setAttribute("fill","rgb(92,184,92)");
        current_Room.getInstance().addElementCurrentRooms(curRoom, curFloor);        
      }       
    } 
    if(countActiveRoom > 0) {
      var currentRooms = current_Room.getInstance().getCurrentRoom();            
      if ($('#calcLightning').valid()) {              
        $('#set_data').prop('disabled', false);
      } else {            
        $('#set_data').prop('disabled', 'disabled');
      } 
    } else {
      $currentTab.removeClass("selectAll");
      for (var j = 0; j < $allRooms.length; j++) {      
        var currentRoom_active = $allRooms[j];
        var curId = currentRoom_active.getAttribute("id");       
        var currentArray = curId.split("_");    
        var currentFloorNumber = currentArray[1];
        var currentRoomNumber = currentArray[2];
        if(currentRoom_active.getAttribute("class") == "activePolygon") {          
          currentRoom_active.removeAttribute("class","activePolygon");
          currentRoom_active.setAttribute("fill","rgb(255,204,153)");          
          current_Room.getInstance().removeElementCurrentRooms(currentRoomNumber, currentFloorNumber);        
        }       
      } 
      var curRoomsLength = current_Room.getInstance().getCurrenRoomLength();
      var currentRooms_1 = current_Room.getInstance().getCurrentRoom();      
      if(curRoomsLength === 0) {
        $( "#set_data" ).prop( "disabled", 'disabled');
      }
    }          
  } else {
    $currentTab.removeClass("selectAll");
    $allRooms = $currentTab.find('polygon[id^=room]');    
    $allRooms.attr("class","");
    $allRooms.attr("fill","rgb(255,204,153)"); 
    removeElementsFromCurRoom(floor, $allRooms.length); 
    var currentRoom_2 = current_Room.getInstance().getCurrentRoom();    
    var curRoomsLength_2 = current_Room.getInstance().getCurrenRoomLength();
    if(curRoomsLength_2 === 0) {
      $( "#set_data" ).prop( "disabled", 'disabled');
    }    
  }
  
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
  console.log("onSelectRoom");
  // initial floor height for current room  
  var parentSVG = element.parentNode;
  var ceiling = parentSVG.getAttribute("data-ceiling");
  if(ceiling !== undefined && $('#heightRoom').val() !== ceiling) {    
    $('#heightRoom').val(ceiling);
    $('#heightRoom').trigger('change');
  }  
  // end initial floor height for current room
  
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

