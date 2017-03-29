//===================== API LOCAL DATA =====================================
var current_Room = (function () {
  var instance, // object singleton     
      curRoom = [], // current active rooms array
      tableData = [], // object data bootstrap-table ( object have all data table)
      curLamp = {}, // current lamp in table ( current active lamp in table)
      typeLamp = {}, // object json drawing (we take it from post message)
      //lampSelect = {}, // object has value for options name lamp select in form edit modal_window
      lampAutocomplit = [], // array for initial lamp autocomplit
      lampAutocomplitKey = []; // array for initial lamp autocomplit for key  
 
  var setLampSelect = function (inputObject) {       
    $.each(inputObject, function(key, value) {
      //lampSelect[key] = value;  
      lampAutocomplit.push({id: value.nameLamp, name: value.nameLamp});   
      lampAutocomplitKey.push({id: value.nameLamp, name: value.key});               
    });               
  };

  var getLampAutocomplit = function () {       
    return lampAutocomplit;       
  };

  var getLampAutocomplitKey = function () {       
    return lampAutocomplitKey;       
  };
  

  var setTypeLamp = function (inputObject) { 
    console.log("setTypeLamp");  
    typeLamp = {};    
    $.each(inputObject, function(key, value) {
       typeLamp[key] = value;
    }); 
    console.log(typeLamp);      
  };
  
  var getTypeLamp = function () {       
    return typeLamp;
  };     

  var getTableData = function () {    
    return tableData;
  }; 

  var setTableData = function (inputArray) {
    tableData = inputArray;
  }; 


  var addElementToTableData = function (element) {   
    
    if(tableData.length === 0) {      
      tableData.push(element);
    } else {     
      proTableData = [];
      for (var i = 0; i < tableData.length; i++) {
        var curElTableData = tableData[i];        
        if(curElTableData.roomNumber === element.roomNumber) {
          if(curElTableData.nameLamp != element.nameLamp) {
            proTableData.push(curElTableData);
          }          
        } else {
          proTableData.push(curElTableData);         
        }        
      }
      proTableData.push(element);     
      
      setTableData(proTableData);
    }             
    $('#bTable').bootstrapTable('load', tableData);   

  };  

  var chengeElementInTableData = function (element) {    
    /* jshint loopfunc:true */     
    if(tableData.length > 0) {      
      for (var i = 0; i < tableData.length ; i++) {
         var curTableElement = tableData[i];
         if((curTableElement.roomNumber === element.roomNumber) && (curTableElement.nameLamp === element.nameLamp)) {
            $.each(element, function(key, val) {
              curTableElement[key] = val;  
            });
         }      
      } 
    }         
    $('#bTable').bootstrapTable('load', tableData);    

  };  

  var removeElementFromTableData = function (element) {       
    var nameLamp = element.nameLamp;    
    var roomNumber = element.roomNumber;   
    for (var i = 0; i < tableData.length ; i++) {     
       if(tableData[i].roomNumber === roomNumber && tableData[i].nameLamp === nameLamp) {
          tableData.splice(i, 1);               
       }
    } 
    $('#bTable').bootstrapTable('load', tableData);  
  };   

  var setCurrentRoom = function (inputArray) {     
    curRoom = inputArray;        
    /*curRoom.room = numberRoom;
    curRoom.floor = numberFloor; */  
  };  

  var addElementCurrentRooms = function (numberRoom, numberFloor) {    
    curRoom.push({room: numberRoom, floor: numberFloor});    
  };

  var removeElementCurrentRooms = function (numberRoom, numberFloor) {    
    var proCurRoom = [];
    for (var i = 0; i < curRoom.length; i++) {
      var currentRoom = curRoom[i];     
      if(currentRoom.floor == numberFloor &&  currentRoom.room != numberRoom) {      
        proCurRoom.push(currentRoom);        
      } else if( currentRoom.floor != numberFloor) {        
        proCurRoom.push(currentRoom);       
      }
    }
    setCurrentRoom(proCurRoom);
  };

  var getCurrentRoom = function () {      
    return curRoom;
  };

  var getCurrenRoomLength = function () {
    return curRoom.length;
  };

  var clearCurrentRoom = function () {
   // curRoom = {};   
    curRoom = []; 
  };

  var setCurrentLamp = function (objectLamp) {      
    for (var key in objectLamp) {
      curLamp[key] = objectLamp[key];
    }   
  };

  var getCurrentLamp = function () {   
    return curLamp;
  };

  var createInstance = function () {   
    return {

      setCurrentLamp: setCurrentLamp,
      getCurrentLamp: getCurrentLamp,
      
      getCurrentRoom: getCurrentRoom,
      getCurrenRoomLength: getCurrenRoomLength,      
      addElementCurrentRooms: addElementCurrentRooms,
      removeElementCurrentRooms: removeElementCurrentRooms,     

      getTableData: getTableData,
      addElementToTableData: addElementToTableData,
      chengeElementInTableData: chengeElementInTableData,
      removeElementFromTableData: removeElementFromTableData,

      setTypeLamp: setTypeLamp,
      getTypeLamp: getTypeLamp,     

      getLampAutocomplit: getLampAutocomplit,
      getLampAutocomplitKey: getLampAutocomplitKey,

      setLampSelect: setLampSelect
    };
  };
  return {
    getInstance: function () {
      return instance || (instance = createInstance());
    }
  };
})();

//================ END API LOCAL DATA ==========================================
//
//
//
//
//
//
////=============== FUNCTION FOR WORK WITH LOCAL DATA API ===============

// 1. getCurrentRooms
// 2. getCurrentRoomForEdit
// 3. addLampInLocalDataAfterEdit
// 4. addLampInLocalData
// 4. removeLampFromLocalData

/**
 * [get Current Room object from local data = current room in draw]
 * @return {[object]} [description]
 */
/*function getCurrentRoom() {   
   var data = current_Room.getInstance().getTypeLamp();
   var curRoom = current_Room.getInstance().getCurrentRoom();  
   var roomObject = {}; 
   var cur = data.floors[curRoom.floor].rooms[curRoom.room];
   $.each(cur, function(key, val) {      
      roomObject[key] = val;      
   });
   return roomObject;
}*/

/**
 * [get Current Rooms objects from local data]
 * @return {[object]} [description]
 */
function getCurrentRooms(nameLamp, parameters) {   
   var data = current_Room.getInstance().getTypeLamp();   
   var currentRooms = current_Room.getInstance().getCurrentRoom();
   var resultArray = []; 
   for (var i = 0; i < currentRooms.length; i++) {
      var proObject = _.cloneDeep(parameters);      
      var currentRoom = currentRooms[i];      
      var floor = parseInt(currentRoom.floor);      
      var room = parseInt(currentRoom.room);      
      var currentDataRoom =  data.floors[floor].rooms[room];    
      proObject.floor = floor;
      proObject.room = room;      
      proObject.roomArea = currentDataRoom.room_area;
      proObject.perimetr = getRoomPerimetr(currentDataRoom.walls); 
      resultArray.push(proObject);     
    }    
   return resultArray;
}

/**
 * [get Current Room For Edit from local data = current row in table]
 * @return {[object]} [description]
 */
function getCurrentRoomForEdit(curRoom) {   
   var data = current_Room.getInstance().getTypeLamp();  
   var param = curRoom.roomNumber.split('/');
   var floor = parseInt(param[0]) - 1;
   var room = parseInt(param[1]) - 1;
   var roomObject = {}; 
   var cur = data.floors[floor].rooms[room];
   $.each(cur, function(key, val) {      
      roomObject[key] = val;      
   });
   return roomObject;
}

/**
 * [add Lamp In LocalData after calc lamp]
 * @param {[object]} objectLamp [object serialize form calc lamp]
 */
function addLampsInLocalData(arrayLamps) {   
  var currentData = current_Room.getInstance().getTypeLamp();  
  for (var i = 0; i < arrayLamps.length; i++) {
    var currentLamp = arrayLamps[i];
    var room = currentLamp.room;    
    var floor = currentLamp.floor;    
    var nameLamp = currentLamp.nameLamp;         
    if(currentData.floors[floor].rooms[room].hasOwnProperty('typeLamp')) {             
      currentData.floors[floor].rooms[room].typeLamp[nameLamp] = currentLamp;         
    } else { 
      proObject = {};
      proObject[nameLamp] = currentLamp;
      currentData.floors[floor].rooms[room].typeLamp = proObject;                  
    }
    addElementToTableData(currentLamp, room, floor, false); 
  } 
  current_Room.getInstance().setTypeLamp(currentData);     
    
}

/**
 * [add Lamp In Loca Data After Edit]
 * @param {[object]} objectLamp [object result serialize form edit and calc lamp]
 * @param {[string]} nameLamp   [name lamp for chenge]
 */
function addLampInLocalDataAfterEdit(objectLamp, nameLamp) {    
  var data = current_Room.getInstance().getTypeLamp();  
  var param = objectLamp.roomNumber.split('/');
  var floor = parseInt(param[0]) - 1;
  var room = parseInt(param[1]) - 1; 
  if(data.floors[floor].rooms[room].hasOwnProperty('typeLamp')) { 
    var currentTypeLamp = data.floors[floor].rooms[room].typeLamp;
    var chengeTypeLamp = {};
    $.each(currentTypeLamp, function(key, val) {
      if(key != nameLamp) {
        chengeTypeLamp[key] = val;
      } 
    });  
    chengeTypeLamp[nameLamp] = objectLamp;
    data.floors[floor].rooms[room].typeLamp = chengeTypeLamp;    
  }   
  current_Room.getInstance().setTypeLamp(data);
  addElementToTableData(objectLamp, room, floor, true);   
}

/**
 * [remove Lamp From Local Data]
 * @param  {[object]} curLamp [object current row in table] 
 */
function removeLampFromLocalData(curLamp) {
  var data = current_Room.getInstance().getTypeLamp();  
  var nameLamp = curLamp.nameLamp;
  var floorAndRoom =  curLamp.roomNumber.split('/');  
  var room = parseInt(floorAndRoom[1]) - 1 ;
  var floor = parseInt(floorAndRoom[0]) - 1;
  var objectTypeLamp = data.floors[floor].rooms[room].typeLamp; 
  if(objectTypeLamp.length === 1) {   
    var objectRoom = data.floors[floor].rooms[room];    
    var resultRooomObject = {};
     $.each(objectRoom, function(key, val) {
        if(key != "typeLamp") {
          resultRooomObject[key] = val;
        }
      });
     data.floors[floor].rooms[room] = resultRooomObject;     
  } else {    
    var resultObject = {};
    $.each(objectTypeLamp, function(key, val) {
      if(key != nameLamp) {
        resultObject[key] = val;
      }
    });
    data.floors[floor].rooms[room].typeLamp = resultObject;   
  }   
  current_Room.getInstance().setTypeLamp(data); 
}

function addElementsToCurRoom (floor, lengthRooms) {  
  for (var i = 0; i < lengthRooms; i++) {
    current_Room.getInstance().addElementCurrentRooms(i, floor);
  }
}

function removeElementsFromCurRoom (floor, lengthRooms) {  
  for (var i = 0; i < lengthRooms; i++) {
    current_Room.getInstance().removeElementCurrentRooms(i, floor);
  }
}
//=============== FUNCTION FOR WORK WITH LOCAL DATA API ===============