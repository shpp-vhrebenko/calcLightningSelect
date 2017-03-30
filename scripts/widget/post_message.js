//==================POST MESSAGE===================================

/**
 * [ listener event 'message' from parent window (apply postMessage)] 
 */
window.addEventListener('message', function(event) {
  var a = event.data.message;
  window.location.hash = event.origin;
  if (a.cmd == 'put_data') {
    var data = a.data; 
    console.group("LOAD DATA"); 
    console.log(typeof(data));
    console.log(data);   
    console.groupEnd();   
    current_Room.getInstance().setTypeLamp(data);    
    viewResultInTable(data);
    /*localDataLamp.jsonDrawing = json_object;
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));*/
    sendResultForDrawPlan(JSON.stringify(data));           
  } else {
    initSelectorNameLamp();
  }
}, false);

/**
 * [get json data from parent window] 
 */
$('#put_data').on('click', function(event) {
  event.preventDefault();
  var parentURL = window.location.hash.slice(1); 
  var local_data = current_Room.getInstance().getTypeLamp();
  parent.window.postMessage({message: {cmd: 'return_data', data: local_data }}, parentURL);
});

/**
 * [send message to parent window] 
 */
$('#cancel').on('click', function(event) {
  event.preventDefault();
  var parentURL = window.location.hash.slice(1);
  parent.window.postMessage({message: {cmd: 'cancel'}}, parentURL);
});

//========================END POST MESSAGE ========================