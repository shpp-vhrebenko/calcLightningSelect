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
 // console.log("set_data");
  event.preventDefault(); 
  var currentRoomObject = getCurrentRoom();  
  var json_data = localStorage.getItem('typeLamp');
  var local_data = $.parseJSON(json_data);  
  var currentParameters = local_data.parameters; 
  var nameLamp = local_data.parameters.nameLamp;
  var data = {
    calc_countLamp : true,
    parameters : currentParameters,
    currentRoom : currentRoomObject
  };  
  sendAjaxForm(data,
                "calc_lighting.php",
                hideLoadingWraper,
                showLoadingWraper,
                viewCalcCountLamp,
                errorResponse,
                10000,
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