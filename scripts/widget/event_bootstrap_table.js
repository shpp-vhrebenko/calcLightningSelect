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
  console.log("set_data");
  event.preventDefault(); 
  var json_data = localStorage.getItem('typeLamp');
  var local_data = $.parseJSON(json_data);  
  var currentParameters = local_data.parameters; 
  var nameLamp = local_data.parameters.nameLamp;
  var currentRoomsObject = getCurrentRooms(nameLamp, currentParameters);     
  var data = {
    calc_lighting : true,    
    currentRooms : currentRoomsObject
  }; 
  console.log(data);   
  sendAjaxForm(data,
                "calc_lighting.php",
                hideLoadingWraper,
                showLoadingWraper,
                viewCalcCountLamp,
                errorResponse,
                15000,
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
      if(currentRoom.hasOwnProperty('typeLamp')) {
        var typeLamp = currentRoom.typeLamp;
        addElementsToTableData(typeLamp, f, r);
      }
    }   
  }      
}

/**
 * [view Result In Table After Edit ]
 * @param  {[object]} currentLamp [description]
 * @param  {[integer]} room        [description]
 * @param  {[integer]} floor       [description]
 * @param  {[string]} chengeName  [description]
 */
function viewResultInTableAfterEdit(currentLamp, room, floor) {
  console.log("addElementsToTableData"); 
  var floor_number = floor + 1;
  var room_number = room + 1;
  var requiredIllumination = 0;  
  if(customRequiredIllumination !== undefined) {
    requiredIllumination = currentLamp.customRequiredIllumination;
  }   
  var objectRow = {    
    nameLamp: currentLamp.nameLamp,
    roomNumber: floor_number + "/" + room_number,    
    roomArea: currentLamp.resultCalc.roomArea,
    lampsCount: currentLamp.resultCalc.lampsCount,
    requiredIllumination: requiredIllumination,
    reflectionCoef: currentLamp.reflectionCoef,
    safetyFactor: currentLamp.safetyFactor,
    powerLamp: currentLamp.powerLamp,
    lampsWatt: currentLamp.resultCalc.lampsWatt,
    heightRoom: currentLamp.heightRoom,
    lampsWorkHeight: currentLamp.lampsWorkHeight,
    photoLink: currentLamp.photoLink,
    customRequiredIllumination: currentLamp.customRequiredIllumination,
    lumix: currentLamp.lumix,
    typeLamp: currentLamp.typeLamp,
    numberLamps: currentLamp.numberLamps, 
    allPowerLamps: (currentLamp.powerLamp * currentLamp.numberLamps),
    key: currentLamp.key   
  };
  current_Room.getInstance().chengeElementInTableData(objectRow);  
}

/**
 * [add Elements To Table Data]
 * @param {[object]} typeLamp [description]
 * @param {[string]} floor    [description]
 * @param {[string]} room     [description]
 */
function addElementsToTableData(typeLamp , floor, room) {
  console.log("addElementsToTableData");  
  var floor_number = floor + 1;
  var room_number = room + 1;  
  $.each(typeLamp, function(key, val) { 
    var currentLamp = val;   
    var requiredIllumination = 0;  
    if(customRequiredIllumination !== undefined) {
      requiredIllumination = currentLamp.customRequiredIllumination;
    }  
    var objectRow = {      
      nameLamp: currentLamp.nameLamp,
      roomNumber: floor_number + "/" + room_number,    
      roomArea: currentLamp.resultCalc.roomArea,
      lampsCount: currentLamp.resultCalc.lampsCount,
      requiredIllumination: requiredIllumination,
      reflectionCoef: currentLamp.reflectionCoef,
      safetyFactor: currentLamp.safetyFactor,
      powerLamp: currentLamp.powerLamp,
      lampsWatt: currentLamp.resultCalc.lampsWatt,
      heightRoom: currentLamp.heightRoom,
      lampsWorkHeight: currentLamp.lampsWorkHeight,
      photoLink: currentLamp.photoLink,
      customRequiredIllumination: currentLamp.customRequiredIllumination,
      lumix: currentLamp.lumix,
      typeLamp: currentLamp.typeLamp,
      numberLamps: currentLamp.numberLamps, 
      allPowerLamps: (currentLamp.powerLamp * currentLamp.numberLamps),
      key: currentLamp.key    
    };
    current_Room.getInstance().addElementToTableData(objectRow);
  });
}


//==================== END FUNCTIONS TABLE DATA =====================