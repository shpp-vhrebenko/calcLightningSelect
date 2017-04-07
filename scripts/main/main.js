window.addEventListener('message', function(event) {
    {
         if (event.data.message.cmd == 'get_data')
        {   
            var win = window.frames.fr1;
            $.ajax({
                url: 'calc_lighting.php',
                type: 'GET',   
                data: {properties_for_CalcLightning: true},
              })
              .done(function(data) {        
                var json_object1 = $.parseJSON(data);
                json_mess = {
                    data:  json_object1,
                    cmd: 'put_data'
                };
                win.postMessage({message: json_mess}, event.origin);          
              })
              .fail(function(response, status, error) {
                console.log(response.reresponseText);
              });           
        }  
        if (event.data.message.cmd == 'return_data')
        {   
            var return_data = event.data.message.data;   
            console.group("RETURN DATA"); 
            console.log(return_data);
            console.groupEnd();             
            $('#iframeid').remove();                                
        }     
        if (event.data.message.cmd == 'cancel')
        {
            console.log("cancel");
            $('#iframeid').remove();
        }
         if (event.data.message.cmd == 'viewPDF')
        {
            console.log("viewPDF");
            $('#iframeid').attr('src','viewPDF.php');
        }
    }
}, false);

function load() {
    console.log("loadPostMessage");     
    var win = window.frames.fr1;   
    $.ajax({
        url: 'calc_lighting.php',
        type: 'GET',   
        data: {properties_for_CalcLightning: true},
      })
      .done(function(data) {        
        var json_object = $.parseJSON(data);
        win.postMessage({message: {cmd: 'put_data', data: json_object}}, '*');           
      })
      .fail(function(response, status, error) {
        console.log(response.reresponseText);
      });
}

function postYourAdd () {
    var iframe = $("#iframeid");
    iframe.attr("src", iframe.data("src")); 
    load(iframe);
}
