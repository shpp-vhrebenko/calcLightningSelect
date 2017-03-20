//===================== API LOCAL DATA =====================================
var current_Room = (function () {
  var instance, // object singleton
      curRoom = {}, // current active room object(number_room, number_floor)
      tableData = [], // object data bootstrap-table
      curLamp = {}, // current lamp in table
      typeLamp = {}, // object json drawing
      lampSelect = {}, // object has value for options name lamp select
      editLamp = {}; // object has parameter edit lamp

  var setEditLamp = function (inputObject) {           
    $.each(inputObject, function(key, value) {
       editLamp[key] = value;
    });        
  };

  var getEditLamp= function () {        
    return editLamp;       
  };    

  var setLampSelect = function (inputObject) {       
    $.each(inputObject, function(key, value) {
       lampSelect[key] = value;
    });      
  };

  var getLampSelect = function () {        
    return lampSelect;       
  };

  var setTypeLamp = function (inputObject) {   
    typeLamp = {};    
    $.each(inputObject, function(key, value) {
       typeLamp[key] = value;
    });            
  };
  
  var getTypeLamp = function () {       
    return typeLamp;
  };     

  var getTableData = function () {    
    return tableData;
  };  


  var addElementToTableData = function (element) {
    tableData.push(element);         
    $('#bTable').bootstrapTable('load', tableData);    
  };  

  var chengeElementInTableData = function (element, chengeElementName) {    
    /* jshint loopfunc:true */ 
    if(tableData.length > 0) {      
      for (var i = 0; i < tableData.length ; i++) {
         var curTableElement = tableData[i];
         if((curTableElement.roomNumber === element.roomNumber) && (curTableElement.nameLamp === chengeElementName)) {
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

  var setCurrentRoom = function (numberRoom, numberFloor) {      
    curRoom.room = numberRoom;
    curRoom.floor = numberFloor;   
  };  

  var getCurrentRoom = function () {      
    return curRoom;
  };

  var clearCurrentRoom = function () {
    curRoom = {};    
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
      setCurrentRoom: setCurrentRoom,
      getCurrentRoom: getCurrentRoom,
      clearCurrentRoom: clearCurrentRoom,
      getTableData: getTableData,
      addElementToTableData: addElementToTableData,
      chengeElementInTableData: chengeElementInTableData,
      removeElementFromTableData: removeElementFromTableData,
      setTypeLamp: setTypeLamp,
      getTypeLamp: getTypeLamp,
      setLampSelect: setLampSelect,
      getLampSelect: getLampSelect,
      setEditLamp: setEditLamp,
      getEditLamp: getEditLamp
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

// 1. getCurrentRoom
// 2. getCurrentRoomForEdit
// 3. addLampInLocalData
// 4. removeLampFromLocalData
// 5. addLampInLocalDataAfterEdit

/**
 * [get Current Room object from local data = current room in draw]
 * @return {[object]} [description]
 */
function getCurrentRoom() {   
   var data = current_Room.getInstance().getTypeLamp();
   var curRoom = current_Room.getInstance().getCurrentRoom();  
   var roomObject = {}; 
   var cur = data.floors[curRoom.floor].rooms[curRoom.room];
   $.each(cur, function(key, val) {      
      roomObject[key] = val;      
   });
   return roomObject;
}

/**
 * [get Current Room For Edit from local data = current row in table]
 * @return {[object]} [description]
 */
function getCurrentRoomForEdit() {   
   var data = current_Room.getInstance().getTypeLamp();
   var curRoom = current_Room.getInstance().getCurrentLamp(); 
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
function addLampInLocalData(objectLamp, nameLamp) {  
  var data = current_Room.getInstance().getTypeLamp();  
  var curRoom = current_Room.getInstance().getCurrentRoom();
  var room = curRoom.room;
  var floor = curRoom.floor;
  if(data.floors[floor].rooms[room].hasOwnProperty('typeLamp')) {    
    data.floors[floor].rooms[room].typeLamp = objectLamp;    
  } else {     
    data.floors[floor].rooms[room].typeLamp = {};    
    $.each(objectLamp, function(key, val) {      
      data.floors[floor].rooms[room].typeLamp[key] = val;      
    });       
  }  
  current_Room.getInstance().setTypeLamp(data);  
  viewResultInTable(objectLamp[nameLamp], room, floor);   
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

/**
 * [add Lamp In Loca Data After Edit]
 * @param {[object]} objectLamp [object result serialize form edit and calc lamp]
 * @param {[string]} nameLamp   [name lamp for chenge]
 */
function addLampInLocalDataAfterEdit(objectLamp, nameLamp) {
  console.log("addLampInLocalDataAfterEdit");
  var data = current_Room.getInstance().getTypeLamp();   
  var curRoom= current_Room.getInstance().getCurrentLamp();
  var currentNameLamp = curRoom.nameLamp; 
  var param = curRoom.roomNumber.split('/');
  var floor = parseInt(param[0]) - 1;
  var room = parseInt(param[1]) - 1; 
  if(data.floors[floor].rooms[room].hasOwnProperty('typeLamp')) { 
    var currentTypeLamp = data.floors[floor].rooms[room].typeLamp;
    var chengeTypeLamp = {};
    $.each(currentTypeLamp, function(key, val) {
      if(key === currentNameLamp) {
        chengeTypeLamp[nameLamp] = objectLamp;
      } else {
        chengeTypeLamp[key] = val;
      }
    });  
    data.floors[floor].rooms[room].typeLamp = chengeTypeLamp;    
  }   
  current_Room.getInstance().setTypeLamp(data);
  viewResultInTable(objectLamp, room, floor, currentNameLamp);   
}

//=============== FUNCTION FOR WORK WITH LOCAL DATA API ===============