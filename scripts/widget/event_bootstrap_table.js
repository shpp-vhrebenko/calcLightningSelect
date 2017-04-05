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
  //var nameLamp = local_data.parameters.nameLamp;
  //var nameLamp = local_data.parameters.typeLamp;
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
        console.group("=======TYPE LAMP=======");       
        console.log(currentRoom.typeLamp);
        console.groupEnd(); 
        var typeLamp = currentRoom.typeLamp;
        addElementsToTableData(typeLamp, f, r, false);
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
function addElementToTableData(currentLamp, room, floor, edit) { 
  var floor_number = parseInt(floor) + 1;
  var room_number = parseInt(room) + 1;
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
    key: currentLamp.key,
    producer: currentLamp.producer   
  };
  if(edit) {
    current_Room.getInstance().chengeElementInTableData(objectRow);  
  } else {
    current_Room.getInstance().addElementToTableData(objectRow);
  }  
}

/**
 * [add Elements To Table Data]
 * @param {[object]} typeLamp [description]
 * @param {[string]} floor    [description]
 * @param {[string]} room     [description]
 */
function addElementsToTableData(typeLamp , floor, room) {
  console.log("addElementsToTableData");  
  var floor_number = parseInt(floor) + 1;
  var room_number = parseInt(room) + 1;  
  $.each(typeLamp, function(key, val) { 
    addElementToTableData(val, room, floor, false);       
  });
}


//==================== END FUNCTIONS TABLE DATA =====================