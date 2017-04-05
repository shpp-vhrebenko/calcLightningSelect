//===================== API LOCAL DATA =====================================
var current_Room = (function() {
    var instance, // object singleton     
        curRoom = [], // current active rooms array
        tableData = [], // object data bootstrap-table ( object have all data table)
        curLamp = {}, // current lamp in table ( current active lamp in table)
        typeLamp = {}, // object json drawing (we take it from post message)
        instanceTypeLamp = {},
        //lampSelect = {}, // object has value for options name lamp select in form edit modal_window
        lampAutocomplit = [], // array for initial lamp autocomplit
        instanceCount = 0,
        lampAutocomplitKey = []; // array for initial lamp autocomplit for key  

    var setLampSelect = function(inputObject) {
        $.each(inputObject, function(key, value) {
            //lampSelect[key] = value;  
            lampAutocomplit.push({ id: value.nameLamp, name: value.nameLamp });
            lampAutocomplitKey.push({ id: value.nameLamp, name: value.key });
        });
    };

    var getLampAutocomplit = function() {
        return lampAutocomplit;
    };

    var getLampAutocomplitKey = function() {
        return lampAutocomplitKey;
    };


    var setTypeLamp = function(inputObject) {
        console.log("setTypeLamp");
        if (typeof(inputObject) === "object") {
            typeLamp = _.cloneDeep(inputObject);
            if(instanceCount === 0) {
                instanceTypeLamp = _.cloneDeep(inputObject);
                instanceCount++;
            }            
            console.log(typeLamp);
        } else {
            console.log(typeof(inputObject));
            console.error("inputObject is not object!!! Type: " + typeof(inputObject));
        }

    };

    var getTypeLamp = function() {
        return typeLamp;
    };

    var getTableData = function() {
        return tableData;
    };

    var getResultTypeLamp = function() {
        var currentData = _.cloneDeep(instanceTypeLamp);
        _.times(tableData.length, function(i) {
            var currentLamp = tableData[i];
            var roomNumber = currentLamp.roomNumber;
            var roomParam = roomNumber.split("_");    
            var floor = parseInt(roomParam[0]) - 1;
            var room = parseInt(roomParam[1]) - 1;           
            var nameLamp = currentLamp.typeLamp;
            var currentRoom = currentData.floors[floor].rooms[room];
            if (currentRoom.typeLamp !== undefined) {
                /*console.log("has TypeLamp");*/
                var proTypeLamp = {};
                proTypeLamp = _.cloneDeep(currentData.floors[floor].rooms[room].typeLamp);
                proTypeLamp[nameLamp] = {};
                proTypeLamp[nameLamp] = currentLamp;
                currentData.floors[floor].rooms[room].typeLamp = proTypeLamp;             
            } else {
                /*console.log("not has TypeLamp");*/
                proObject = {};
                proObject[nameLamp] = {};
                proObject[nameLamp] = currentLamp;
                currentData.floors[floor].rooms[room].typeLamp = {};
                currentData.floors[floor].rooms[room].typeLamp = proObject;            
            }
        });
        console.log(instanceTypeLamp);
        console.log(currentData);
        return currentData;
    };

    var setTableData = function(inputArray) {        
        tableData = inputArray;
        console.group("SET TABLE DATA");         
        console.log(tableData);   
        console.groupEnd(); 
    };


    var addElementToTableData = function(element) {
        console.log("addElementToTableData");
        if (tableData.length === 0) {
            tableData.push(element);
            console.group("SET TABLE DATA");         
            console.log(tableData);   
            console.groupEnd(); 
            $('#bTable').bootstrapTable('load', tableData);
        } else {
            proTableData = [];
            for (var i = 0; i < tableData.length; i++) {
                var curElTableData = tableData[i];
                if (curElTableData.roomNumber === element.roomNumber) {
                    if (curElTableData.nameLamp != element.nameLamp) {
                        proTableData.push(curElTableData);
                    }
                } else {
                    proTableData.push(curElTableData);
                }
            }
            proTableData.push(element);
            setTableData(proTableData);
            $('#bTable').bootstrapTable('load', proTableData);
        }
        

    };

    var chengeElementInTableData = function(element) {
        console.log("chengeElementInTableData");
        /* jshint loopfunc:true */
        if (tableData.length > 0) {
            for (var i = 0; i < tableData.length; i++) {
                var curTableElement = tableData[i];
                if ((curTableElement.roomNumber === element.roomNumber) && (curTableElement.nameLamp === element.nameLamp)) {
                    $.each(element, function(key, val) {
                        curTableElement[key] = val;
                    });
                }
            }
        }
        $('#bTable').bootstrapTable('load', tableData);

    };

    var removeElementFromTableData = function(element) {
        console.log("removeElementFromTableData");
        //var nameLamp = element.nameLamp; 
        var nameLamp = element.typeLamp;
        var roomNumber = element.roomNumber;
        for (var i = 0; i < tableData.length; i++) {
            if (tableData[i].roomNumber === roomNumber && tableData[i].typeLamp === nameLamp) {
                tableData.splice(i, 1);
            }
        }
        console.group("SET TABLE DATA");         
        console.log(tableData);   
        console.groupEnd();
        $('#bTable').bootstrapTable('load', tableData);
    };

    var setCurrentRoom = function(inputArray) {
        curRoom = inputArray;
        /*curRoom.room = numberRoom;
        curRoom.floor = numberFloor; */
    };

    var addElementCurrentRooms = function(numberRoom, numberFloor) {
        curRoom.push({ room: numberRoom, floor: numberFloor });
    };

    var removeElementCurrentRooms = function(numberRoom, numberFloor) {
        var proCurRoom = [];
        for (var i = 0; i < curRoom.length; i++) {
            var currentRoom = curRoom[i];
            if (currentRoom.floor == numberFloor && currentRoom.room != numberRoom) {
                proCurRoom.push(currentRoom);
            } else if (currentRoom.floor != numberFloor) {
                proCurRoom.push(currentRoom);
            }
        }
        setCurrentRoom(proCurRoom);
    };

    var getCurrentRoom = function() {
        return curRoom;
    };

    var getCurrenRoomLength = function() {
        return curRoom.length;
    };

    var clearCurrentRoom = function() {
        // curRoom = {};   
        curRoom = [];
    };

    var setCurrentLamp = function(objectLamp) {
        for (var key in objectLamp) {
            curLamp[key] = objectLamp[key];
        }
    };

    var getCurrentLamp = function() {
        return curLamp;
    };

    var createInstance = function() {
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
            getResultTypeLamp: getResultTypeLamp,

            getLampAutocomplit: getLampAutocomplit,
            getLampAutocomplitKey: getLampAutocomplitKey,

            setLampSelect: setLampSelect
        };
    };
    return {
        getInstance: function() {
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
function getCurrentRooms(parameters) {
    var data = current_Room.getInstance().getTypeLamp();
    var currentRooms = current_Room.getInstance().getCurrentRoom();
    var resultArray = [];
    for (var i = 0; i < currentRooms.length; i++) {
        var proObject = _.cloneDeep(parameters);
        var currentRoom = currentRooms[i];
        var floor = parseInt(currentRoom.floor);
        var room = parseInt(currentRoom.room);
        var currentDataRoom = data.floors[floor].rooms[room];
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
    var param = curRoom.roomNumber.split('_');
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
 * [add elements to current room object]
 * @param {[type]} floor       [number]
 * @param {[type]} lengthRooms [number]
 */
function addElementsToCurRoom(floor, lengthRooms) {
    for (var i = 0; i < lengthRooms; i++) {
        current_Room.getInstance().addElementCurrentRooms(i, floor);
    }
}

/**
 * [remove elements from current room ]
 * @param  {[type]} floor       [number]
 * @param  {[type]} lengthRooms [number] 
 */
function removeElementsFromCurRoom(floor, lengthRooms) {
    for (var i = 0; i < lengthRooms; i++) {
        current_Room.getInstance().removeElementCurrentRooms(i, floor);
    }
}
//=============== FUNCTION FOR WORK WITH LOCAL DATA API ===============
