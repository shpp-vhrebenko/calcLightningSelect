//=====================EVENT BOOTSTRAP TABLE=======================
$('#bTable').on('check.bs.table', function (e, row) {  
    console.log(row);  
    current_Room.getInstance().setCurrentLamp(row);
    $('#edit_data').prop('disabled', false);
    $('#remove_data').prop('disabled', false);
});

$('#bTable').on('uncheck.bs.table', function (e, row) {    
    $('#edit_data').prop('disabled', 'disabled');
    $('#remove_data').prop('disabled', 'disabled');
});

$('#set_data').on('click', function(event) {
  console.log("set_data");
  event.preventDefault(); 
  var json_data = localStorage.getItem('typeLamp');
  var local_data = $.parseJSON(json_data);  
  var currentParameters = local_data.parameters;   
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
});
  
//====================== END EVENT BOOTSTRAP TABLE ================
//
//
//
//
//
//
//==================== FUNCTIONS TABLE DATA =======================
//
//1.viewResultInTable
//2.initialAddLampsInTableData
//3.addLampInTableDataAfterEdit
//4.addLampsToTableData
//5.addLampToTableData

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
      if(currentRoom.typeLamp !== undefined) {        
        var typeLamp = currentRoom.typeLamp;
        addLampsToTableData(typeLamp, f, r, false);
      }
    }   
  }      
}

/**
 * []
 * @param {[object]} objectLamp [object serialize form calc lamp]
 */
function AddLampsInTableDataAfterCalc(arrayLamps) {
    console.log("AddLampsInTableDataAfterCalc");   
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
    var data = current_Room.getInstance().getTypeLamp();
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
function addLampsToTableData(typeLamp , floor, room) {
  console.log("addLampsToTableData");   
  $.each(typeLamp, function(key, val) { 
    addLampToTableData(val, room, floor, false);       
  });
}

/**
 * [view Result In Table After Edit ]
 * @param  {[object]} currentLamp [description]
 * @param  {[integer]} room        [description]
 * @param  {[integer]} floor       [description]
 * @param  {[string]} chengeName  [description]
 */
function addLampToTableData(currentLamp, room, floor, edit) { 
  console.log("addLampToTableData");
  var floor_number = parseInt(floor) + 1;
  var room_number = parseInt(room) + 1;
  var requiredIllumination = 0;  
  if(customRequiredIllumination !== undefined) {
    requiredIllumination = currentLamp.customRequiredIllumination;
  }   
  var objectRow = {    
    nameLamp: currentLamp.nameLamp,
    roomNumber: floor_number + "_" + room_number,    
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
    usagecoefficient: currentLamp.usagecoefficient,
    roomArea: currentLamp.resultCalc.roomArea,
    lampsCount: currentLamp.resultCalc.lampsCount,    
    resultCalc: currentLamp.resultCalc   
  };
  if(edit) {
    current_Room.getInstance().chengeElementInTableData(objectRow);  
  } else {
    current_Room.getInstance().addElementToTableData(objectRow);
  }  
}

//==================== END FUNCTIONS TABLE DATA =====================