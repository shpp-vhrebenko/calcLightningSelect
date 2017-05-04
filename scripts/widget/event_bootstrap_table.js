//================== EVENT BOOTSTRAP TABLE========================
//  FUNCTIONS TABLE DATA
      //1.viewResultInTable
      //2.addLampsInTableDataAfterCalc
      //3.addLampsInTableDataAfterCalc
      //4.addLampsToTableData
      //5.addLampToTableData
      //6.removeLampsFromTableData  
//  FUNCTIONS HANDLER EVENTS BOOTSTRAP-TABLES
      //1.showRemoveButton
      //2.hideRemoveButton

//=====================EVENT BOOTSTRAP TABLE=======================
$('#bTable').on('check.bs.table', function (e, row) {    
    current_Room.getInstance().addCurrentLamp(row);    
});

$('#bTable').on('uncheck.bs.table', function (e, row) {     
    current_Room.getInstance().removeCurrentLamp(row);
});

$('#set_data').on('click', function(event) {
  console.log("set_data");
  event.preventDefault();
  var currentRooms = current_Room.getInstance().getCurrentRoom();
  if(currentRooms.length >= 1) {
    var json_data = localStorage.getItem('typeLamp');
    var local_data = $.parseJSON(json_data);  
    var currentParameters = local_data;   
    var currentRoomsArray = getCurrentRooms(currentParameters);     
    var data = {
      calc_lighting : true,    
      currentRooms : currentRoomsArray
    };   
    sendAjaxForm(data,
                  "calc_lighting.php",
                  hideLoadingWraper,
                  showLoadingWraper,
                  viewCalcCountLamp,
                  errorResponse,
                  15000,
                  'POST'); 
  } else {    
    $('#alert-tooltip').fadeIn();
  }  
});
  
//====================== END EVENT BOOTSTRAP TABLE ================
//
//
//
//
//
//
//==================== FUNCTIONS TABLE DATA =======================

/**
 * View result in table after calc lamps
 * @param  {[object]} calcLighting  [description]
 */
function viewResultInTable(calcLighting) {
  console.log("viewResultInTable");
  var floorsArray = calcLighting.floors;  
  for (var f = 0; f < floorsArray.length; f++) {
    var currentFloor = floorsArray[f];
    var rooms = currentFloor.rooms;    
    for (var r = 0; r < rooms.length; r++) {
      var currentRoom = rooms[r];     
      if(currentRoom.typeLamp !== undefined ) {        
        var typeLamp = _.cloneDeep(currentRoom.typeLamp);
        var typeRoom = undefined;
        if(currentRoom.room_type !== undefined && currentRoom.room_type !== "undefined") {
          console.log(currentRoom.room_type);
          typeRoom = currentRoom.room_type;
        }
        addLampsToTableData(typeLamp, f, r, typeRoom);
      }
    }   
  }      
}

/**
 * [add Lamps In Table Data After Calc]
 * @param {[array]} objectLamp [array object lamps]
 */
function addLampsInTableDataAfterCalc(arrayLamps) {
    console.log("addLampsInTableDataAfterCalc");   
    for (var i = 0; i < arrayLamps.length; i++) {
        var currentLamp = arrayLamps[i];
        var room = currentLamp.room;
        var floor = currentLamp.floor;       
        addLampToTableData(currentLamp, room, floor, false);
    }  

}

/**
 * [add Lamp In Loca Data After Edit]
 * @param {[object]} objectLamp [object result serialize form edit and calc lamp]
 * @param {[string]} nameLamp   [name lamp for chenge]
 */
function addLampInTableDataAfterEdit(objectLamp, nameLamp) {
    console.log("addLampInTableDataAfterEdit");        
    var param = objectLamp.roomNumber.split('_');
    var floor = parseInt(param[0]) - 1;
    var room = parseInt(param[1]) - 1;    
    addLampToTableData(objectLamp, room, floor, true);
}

/**
 * [add Elements To Table Data]
 * @param {[object]} typeLamp [description]
 * @param {[string]} floor    [description]
 * @param {[string]} room     [description]
 */
function addLampsToTableData(typeLamp , floor, room, typeRoom) {
  console.log("addLampsToTableData");   
  $.each(typeLamp, function(key, val) { 
    addLampToTableData(val, room, floor, false, typeRoom);       
  });
}

/**
 * [view Result In Table After Edit ]
 * @param  {[object]} currentLamp [description]
 * @param  {[integer]} room        [description]
 * @param  {[integer]} floor       [description]
 * @param  {[string]} chengeName  [description]
 */
function addLampToTableData(currentLamp, room, floor, edit, typeRoom) { 
  console.log("addLampToTableData"); 
  console.log(currentLamp); 
  if(typeRoom !== undefined && typeRoom !== "undefined") {
    currentLamp.typeRoom = typeRoom;
  } else {
    currentLamp.typeRoom = undefined;
  }  
  var floor_number = parseInt(floor) + 1;
  var room_number = parseInt(room) + 1;
  var requiredIllumination = 0;  
  if(customRequiredIllumination !== undefined && customRequiredIllumination !== "undefined") {
    requiredIllumination = currentLamp.customRequiredIllumination;
  } 
  var title = "";  
  if(floor_number != 1) {
    title = title + "Этаж №" + floor_number + ". ";
    title = title + "Помещение №" + room_number + ". ";    
   /* title = title + "Площадь: " + currentLamp.resultCalc.roomArea + " м2. ";*/
   title = title + "-" + "  " + currentLamp.resultCalc.roomArea + "  " + " м2. ";
    if(currentLamp.typeRoom !== undefined && currentLamp.typeRoom !== "undefined"){
      console.log(currentLamp.typeRoom);
      title = title + " Тип помещения: " + currentLamp.typeRoom;
    }      
  } else {
    title = title + "Помещение №" + room_number + ". ";    
    /*title = title + "Площадь: " + currentLamp.resultCalc.roomArea + " м2. ";*/
    title = title + "-" + "  " + currentLamp.resultCalc.roomArea + "  " + " м2. ";
    if(currentLamp.typeRoom !== undefined && currentLamp.typeRoom !== "undefined"){
      console.log(currentLamp.typeRoom);
      title = title + " Тип помещения: " + currentLamp.typeRoom;
    }  
  } 
 
  var objectRow = {    
    nameLamp: currentLamp.nameLamp,
    roomNumber: floor_number + "_" + room_number, 
    roomTitle: title,  
    typeRoom: currentLamp.typeRoom,    
    requiredIllumination: requiredIllumination,
    reflectionCoef: currentLamp.reflectionCoef,
    safetyFactor: currentLamp.safetyFactor,
    powerLamp: currentLamp.powerLamp,    
    heightRoom: currentLamp.heightRoom,
    lampsWorkHeight: currentLamp.lampsWorkHeight,  
    customRequiredIllumination: currentLamp.customRequiredIllumination,
    lumix: currentLamp.lumix,
    typeLamp: currentLamp.typeLamp,
    numberLamps: currentLamp.numberLamps, 
    allPowerLamps: (currentLamp.powerLamp * currentLamp.numberLamps),
    key: currentLamp.key,
    producer: currentLamp.producer,
    price: currentLamp.price,
    roomArea: currentLamp.resultCalc.roomArea,
    photoLink: currentLamp.photoLink,
    lampsCount: currentLamp.resultCalc.lampsCount, 
    lampsWatt: currentLamp.resultCalc.lampsWatt,   
    resultCalc: currentLamp.resultCalc   
  };
  if(edit) {
    current_Room.getInstance().chengeElementInTableData(objectRow);  
  } else {
    current_Room.getInstance().addElementToTableData(objectRow);
  }  
}

/**
 * [remove Lamps From Table Data]
 * @param  {[array]} arrayLamps [description] 
 */
function removeLampsFromTableData(arrayLamps) {
  _.times(arrayLamps.length, function(index) {
    current_Room.getInstance().removeElementFromTableData(arrayLamps[index]);
  });
  current_Room.getInstance().clearCurrentLamps();
}

//==================== END FUNCTIONS TABLE DATA =====================
//
//
//
//
//=============== FUNCTIONS HANDLER EVENTS BOOTSTRAP-TABLES =========

/**
 * [show remove button for cell data table]
 * @param  {[jquery object]} element [description] 
 */
function showRemoveButton(element) {  
  var $curElement = $(element); 
  var $parent = $curElement.parent();  
  var $button = $parent.find('.js_remove_button'); 
  var height = $parent.height();
  var parentWidth = $parent.width(); 
  var width = $button.width();
  var top = 0;
  if(height > width) {
    top = (height-width)/2;
  } else {
    top = -2;
  } 
  var left = parentWidth - width;
  $button.css({'visibility':'visible','top': top ,'left': left}); 
}

/**
 * [hide Remove Button]
 * @param  {[jquery object]} element [description] 
 */
function hideRemoveButton(element) {    
  var $curElement = $(element); 
  var $parent = $curElement.parent();  
  var $button = $parent.find('.js_remove_button');
  $button.css('visibility','hidden');
}

/**
 * [show Field Search in tool panel table data]
 */
function showFieldSearch() {
   var $toolbar = $('.fixed-table-toolbar');
   var $searchBox = $toolbar.find('div.search');
   if($searchBox.css('visibility') == 'hidden') {
     $searchBox.css('visibility', 'visible');
   } else {
     $searchBox.css('visibility', 'hidden'); 
   }
}

//=============== END FUNCTIONS HANDLER EVENTS BOOTSTRAP-TABLES =====
//
//
//
//
//===================================================================