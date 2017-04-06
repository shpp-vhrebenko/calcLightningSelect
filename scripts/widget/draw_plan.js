// DRAW PLAN
//1.HANDLER EVENTS
//2.FUNCTION HANDLER EVENTS

//=============== HANDLER EVENTS DRAW PLAN =====================

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

$('#draw_plan').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {  
  var id = e.target.getAttribute("href"); 
  var $curDiv = $(id);  
  if($curDiv.hasClass('active in')) {
    var svgs = $curDiv.find('svg');
    var curSVG = $(svgs[0]);
    var ceiling = curSVG.attr('data-ceiling');
    // initial floor height for current room  
    if(ceiling !== undefined && $('#heightRoom').val() !== ceiling) {    
      $('#heightRoom').val(ceiling);
      $('#heightRoom').trigger('change');
    }  
    // end initial floor height for current room
  }  
});

//============ END HANDLER EVENTS DRAW PLAN =======================
//
//
//
//
//=============== FUNCTIONS HANDLER EVENTS DRAW PLAN ==============

/**
 * [hendler event onclick current room]
 * @param  {[DOM element]} element [element event oncklick]
 */
function onSelectRoom(element) { 
  console.log("onSelectRoom");
  // initial floor height for current room  
  /*var parentSVG = element.parentNode;
  var ceiling = parentSVG.getAttribute("data-ceiling");
  if(ceiling !== undefined && $('#heightRoom').val() !== ceiling) {    
    $('#heightRoom').val(ceiling);
    $('#heightRoom').trigger('change');
  }  */
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

function HideTooltips(element) {   
  var $curElement = $(element);  
  $curElement.tooltip('hide');
}

function ShowTooltips(element) { 
  var $curElement = $(element);   
  $curElement.tooltip({
      container: 'body',      
      trigger: 'manual',
      html: true,
      animation: false,
      offset: '0 75%',
      delay: { "show": 1000, "hide": 2000 },
      title:  function() {
          var currentId = $(this).attr('id');
          var curArray = currentId.split("_");    
          var curFloor = parseInt(curArray[1]) + 1;
          var curRoom = parseInt(curArray[2]) + 1;
          var tableData = current_Room.getInstance().getTableData();
          var roomNumber = curFloor + '_' + curRoom;                        
          var resultArray = [];
          for (var i = 0; i < tableData.length; i++) {
            var curLamp = tableData[i];
            if(roomNumber === curLamp.roomNumber) {                                        
              resultArray.push({name : curLamp.nameLamp, countLamp: curLamp.lampsCount});
            }
          }                   
          var resultStr = "<нет светильников>";
          if(resultArray.length !== 0) {
            resultStr = "<ol>";
            for (var j = 0; j < resultArray.length; j++) {
              resultStr = resultStr + "<li>" + resultArray[j].name + "-" + resultArray[j].countLamp + " шт.</li>";
            }
            resultStr = resultStr + "</ol>";
            /*resultStr = resultArray.join('<br/>');  */                                                  
          }           
          return resultStr;
      },
      placement: 'top'
  });
  $curElement.tooltip('show');  
}

//============ END FUNCTIONS HANDLER EVENTS DRAW PLAN ==============
//
//
//
//
//==================================================================