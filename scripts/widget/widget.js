//
// DOCUMENT READY 
//=============DOCUMENT READY============
//1.INITIAL BOOTSTRAP-TABLЕS
//2.EVENTS BOOTSTRAP-TABLES
//3.FUNCTIONS BOOTSTRAP-TABLES
//4.DEFAULT INIT FUNCTION
//5.BOOTSTRAP TOOLTIP
//6.AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD
//===========END DOCUMENT READY =========
//
//
//==========================DOCUMENT READY======================================
//==============================================================================
if(localStorage.typeLamp) {
  var listDataLamp = JSON.parse(localStorage.getItem('typeLamp'));
}
/*var currentRoom = {};*/
var localDataLamp = listDataLamp || {};
console.group("LocalStorage");
console.log(localDataLamp);
console.groupEnd();

$(document).ready(function() {   
  //==========================================================
  //
  //
  //
  //
  //============= INITIAL BOOTSTRAP-TABLЕS ===================
  var initialTableHeight = getWindowHeight();
  var tableData = current_Room.getInstance().getTableData();  
  var $bTable = $('#bTable').bootstrapTable({
      contextMenu: '#example1-context-menu',
      onContextMenuItem: function(row, $el){
          if($el.data("item") == "delete"){
            var curRowTable = row;             
            var curLamps = current_Room.getInstance().getCurrentLamps();
            if(curLamps.length !== 0) {
              removeLampsFromTableData(curLamps);
            } else {              
              current_Room.getInstance().removeElementFromTableData(curRowTable);
            }                      
          }
      },      
  /*    idField: 'name',*/
      source: tableData,      
      /*pagination: true,  */   
      search: true,
      toolbar: "#toolbar",
      clickToSelect: true,
      singleSelect: false,
     /* checkboxHeader: true,*/      
      height: initialTableHeight,     
     /* pageSize: 5,
      pageList: [5,10,15],*/
      classes: "table table-condensed", 
      showFooter: true,                
      footerStyle:  function footerStyle(row, index) {                      
                      return {
                        css: { "font-weight": "bold"}
                      };
                    },         
      columns: [
      {
          field: 'state',          
          checkbox: true,
          class: "half"          
      },
      {
          field: 'index',
          title: '№',
          titleTooltip: "№ по порядку",  
          class: "col-md-1 half-col-md forTooltip",         
          formatter: runningFormatter
      },
      {
          field: 'key',
          title: '<span>Артикул</span>',           
          align: 'center',          
          class: "col-md-1 half-col-md forTooltip",
          footerFormatter: totalTextFormatter         
      },
      {
          field: 'nameLamp',
           /*jshint multistr: true */
          title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Наименование" + 
                  "&nbsp;&nbsp;&nbsp;&nbsp;<span onclick='showFieldSearch()' id='show-search'><i class='glyphicon glyphicon-search'></i></span>",
          sortable: true,        
          class: "col-md-3 ",
          formatter: starsFormatter          
      }, /*{
          field: 'roomNumber',
          title: '№',
          sortable: true,          
          class: "col-md-1",          
          tooltip: true,
          titleTooltip: "№ этажа / № комнаты",
          formatter: function(value) {
            var param = value.split('_');
            var floor = param[0];
            var room = param[1];
            var str =  floor + "/" +  room;
            return str;
          }          
      },*//* {
          field: 'roomArea',
          title: 'Площадь</br>комнаты',
          container: 'body',          
          class: "col-md-1",
          editable: {
            type: 'number',
            min: 0.1,
            mode: 'popup',
            placement: 'right',
            step: 0.1
          }          
      }*/ {
          field: 'lampsCount',
          title: 'Количество </br>светильников',
          container: 'body',         
          class: "col-md-1",
          editable: {
            type: 'number',
            min: 1,
            mode: 'popup',
            placement: 'right'
          },
          footerFormatter: totalFormatter 

      }, {
          field: 'requiredIllumination',
          title: 'Требуемое </br>освещение лк',                    
          class: "col-md-1",
          editable: {
            type: 'number',
            min: 1,              
            mode: 'popup',
            placement: 'left'            
          }           
      }, {
          field: 'reflectionCoef',
          title: 'Коэф.</br>отражения',                   
          class: "col-md-1",
          editable: {
            type: 'select',
            source: [
              { value : "0,0,0" , text: "0,0,0"},            
              { value : "30,30,10" , text: "30,30,10"},
              { value : "50,30,10" , text: "50,30,10"},
              { value : "50,50,10" , text: "50,50,10"},
              { value : "70,50,20" , text: "70,50,20"},
              { value : "80,30,10" , text: "80,30,10"},
              { value : "80,50,30" , text: "80,50,30"},
              { value : "80,80,30" , text: "80,80,30"}
            ],
            mode: 'popup',
            placement: 'left'
          }                    
      }, {
          field: 'safetyFactor',
          title: 'Коэф.</br>запаса',         
          class: "col-md-1",
          editable: {
            type: 'select',
            source: [
              { value : 1.1 , text: "1.1"},
              { value : 1.4 , text: "1.4"},
              { value : 1.6 , text: "1.6"},
              { value : 1.7 , text: "1.7"}
            ],
            mode: 'popup',
            placement: 'left'            
          }            
      }, {
          field: 'allPowerLamps',
          title: 'Мощность</br>1 шт., Вт',
          titleTooltip: "Мощность 1 светильника",         
          class: "col-md-1 forTooltip"           
      }, {
          field: 'lampsWatt', 
          class: "col-md-1 forTooltip",
          title: 'Общая</br>мощность, Вт',
          titleTooltip: "Мощность всех светильников",
          footerFormatter: totalFormatter           
      }]
  });
          //========== EVENTS BOOTSTRAP-TABLES ===========//
  $('#bTable').on('click', '.js_remove_button', function (e){
      var table = $('#bTable').data('bootstrap.table'),
          $current = $(this),
          $div = $current.parent(),
          $element = $div.parent(),
          $tr = $element.parent(),
          row = table.data[$tr.data('index')],
          cellIndex = $element[0].cellIndex,
          $headerCell = table.$header.find('th:eq(' + cellIndex + ')'),
          field = $headerCell.data('field'),
          value = row[field];              
          console.log(row);
          current_Room.getInstance().removeElementFromTableData(row);
         /* current_Room.getInstance().removeCurrentLamp(row);*/
          table.$el.trigger($.Event('uncheck.bs.table'), row);
  });   

  $bTable.on('post-body.bs.table', function () {
      $('.forTooltip').attr("data-tooltip","true");
      $('[data-tooltip="true"]').tooltip({
          container: 'body'
      });
  }).on('load-success.bs.table', function (e, data) {  
    console.log("========Data load success!!!=======");      
    /*console.log($(this).bootstrapTable('getData'));  */  
  }).on('load-error.bs.table', function (e, data) {  
    console.log("========Data load error!!!=======");      
    /*console.log($(this).bootstrapTable('getData'));  */  
  }).on('editable-save.bs.table', function (e, field, row, old, $el) {              
    if(field != "lampsCount") {
      console.log("chengeResultCalc");
      if(field === "requiredIllumination") {
        row.customRequiredIllumination = row.requiredIllumination;
      }  
      var currentRoomObject = getCurrentRoomForEdit(row);     
      row.perimetr = getRoomPerimetr(currentRoomObject.walls); 
      var sendData = {
        calc_countLamp : true,
        parameters : row          
      };    
      sendAjaxForm(sendData,
                "calc_lighting.php",
                hideLoadingWraper,
                showLoadingWraper,
                viewEditCalcCountLamp,
                errorResponse,
                10000,
                'POST');  
      
    } else {
      console.log("chengeLampsCount");      
      row.resultCalc.lampsCount = row.lampsCount;
      current_Room.getInstance().chengeElementInTableData(row); 
    }
    
  }).on('all.bs.table', function (e, name, args) {       
        if(name == "pre-body.bs.table") {
          console.group("PREBODYBSTABLE");          
          console.log('data:', args);   
          console.groupEnd(); 
        } else if (name == "post-body.bs.table") {
          console.group("POSTBODYBSTABLE");          
          console.log('data:', args);    
          console.groupEnd(); 
        }
    }); 
          //========== END EVENT BOOTSTRAP-TABLES ===========//
          //
          //========== FUNCTIONS BOOTSTRAP-TABLES ===========//
  function starsFormatter(value) {
      /*jshint multistr: true */
      return "<div class='relativeBox alignLeft' onmouseover='showRemoveButton(this)' onmouseout='hideRemoveButton(this)'>\
                <span>" + value + 
                "</span>\
                <button class='btn btn-circle btn-default js_remove_button'><i class='glyphicon glyphicon-remove'></i></button>\
              </div>";
  }

  function runningFormatter(value, row, index) {
      return 1+index;
  } 

  function totalFormatter(data) {    
    var total = 0;
    if (data.length > 0) {
      var field = this.field;         
      total = data.reduce(function(sum, row) {
        return sum + (+row[field]);
      }, 0);

      return total;
    }
    return '';
  }

  function totalTextFormatter(data) {
    return '<span class="totalValue">ИТОГИ:</span>';
  }

        //======== END FUNCTIONS BOOTSTRAP-TABLES =========//
        
    //============= END INITIAL BOOTSTRAP-TABLS ===================
    //
    //
    //
    //
    //
    //=============================================================
    //
    //
    //
    //
    //
    //============== DEFAULT INIT FUNCTION =========================

    defaultInit();          // Initial default properties for lamp
    init();                 // init properties lamp from LocalStorage
    
    //============== END DEFAULT INIT FUNCTION ======================
    //
    //    
    //        
    //       
    //================= BOOTSTRAP TOOLTIP ===========================    
    $('[data-toggle="tooltip"]').tooltip(); 
    //================= END BOOTSTRAP TOOLTIP ======================= 
    //
    //
    //
    //
    //    
    //================= AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============
    var selectLamp = current_Room.getInstance().getLampAutocomplit();    
    var $input = $("#search_user_lamp");    
    $input.typeahead({
      source: selectLamp,
      autoSelect: true
    });
    $input.change(function() {   
      var current = $input.typeahead("getActive");      
      var selectTypeLamp = $input.val();
      $('#nameLamp').val(current.id);        
      $('#nameLamp').valid();
      $('#nameLamp').trigger('change');      
    });

    /*var $inputKey = $("#key");
    var selectLampKey = current_Room.getInstance().getLampAutocomplitKey();  
    $inputKey.typeahead({
      source: selectLampKey,
      autoSelect: true
    });
    $inputKey.change(function() {  
      console.log("changeTypeHead"); 
      var current = $inputKey.typeahead("getActive");              
      $('#nameLamp').val(current.id);        
      $('#nameLamp').valid();
      $('#nameLamp').trigger('change');      
    });*/
    //============= END AUTOCOMPLIT BOOTSTRAP-TYPEAHEAD =============   
    //
    //
    //
    //
    //
    //
    //===============================================================    
    typeLampFormValidation();   
    $(window).resize(function() {
        var height = getWindowHeight(); 
        $bTable.bootstrapTable('resetView', {height: height});        
    }); 
     
});
//======================== END DOCUMENT READY =============================
//=========================================================================

function getWindowHeight() {
  var windowHeight = $(window).height(); 
  var headerBlock = 300;
  var buttonBlock = 40;
  var otherBlock = 50;     
  var curHeight = (windowHeight - (headerBlock + buttonBlock)) - otherBlock;     
  return curHeight;   
}  
