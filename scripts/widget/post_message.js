//==================POST MESSAGE===================================

/**
 * [ listener event 'message' from parent window (apply postMessage)] 
 */
/*window.addEventListener('message', function(event) {
  var a = event.data.message;
  window.location.hash = event.origin;
  if (a.cmd == 'put_data') {
    var data = a.data; 
    console.group("LOAD DATA"); 
    console.log(typeof(data));
    console.log(data);   
    console.groupEnd(); 
    var parentURL = window.location.hash.slice(1);   
    current_Room.getInstance().setInstanceParentUrl(parentURL);
    current_Room.getInstance().setTypeLamp(data);      
    viewResultInTable(data);*/
    /*localDataLamp.jsonDrawing = json_object;
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));*/
/*    sendResultForDrawPlan(JSON.stringify(data));           
  } else {
    initSelectorNameLamp();   
  }
}, false);*/

/**
 * [get json data from parent window] 
 */
$('#put_data').on('click', function(event) {
  event.preventDefault();
  /*var parentURL = window.location.hash.slice(1);*/ 
  var parentURL = current_Room.getInstance().getInstanceParentUrl();
  console.log(parentURL);
  var local_data = current_Room.getInstance().getResultTypeLamp();   
  parent.window.postMessage({message: {cmd: 'return_data', data: local_data }}, parentURL);
});

/**
 * [get json data from parent window] 
 */
$('#view_pdf_listLightingDevicesInRooms').on('click', function(event) {
  event.preventDefault();  
  var local_data = current_Room.getInstance().getResultTypeLamp();
  var json_object = local_data;    
  $.ajax({
    url: 'widget.php',
    type: 'POST',    
    data: {viewPDF: true, viewListInRooms: true , local_data: json_object},
  })
  .done(function() {
    console.log("success");    
    window.open('viewPDF.php', 'Ведомость осветительных приборов');    
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });  
});

$('#view_pdf_listLightingDevices').on('click', function(event) {
  event.preventDefault();  
  var listDevices = getListLightingDevices();   
  console.log(listDevices); 
  $.ajax({
    url: 'widget.php',
    type: 'POST',    
    data: {viewPDF: true, viewList: true,  local_data: listDevices},
  })
  .done(function() {       
    window.open('viewPDF.php', 'Ведомость осветительных приборов');    
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {   
  });  
});

/**
 * [send message to parent window] 
 */
$('#cancel').on('click', function(event) {
  event.preventDefault();
  console.log(window.location);
  /*var parentURL = window.location.hash.slice(1);*/
  var parentURL = current_Room.getInstance().getInstanceParentUrl();
  console.log(parentURL);
  parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
});

//========================END POST MESSAGE ========================