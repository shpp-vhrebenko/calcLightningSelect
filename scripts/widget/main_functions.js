//================= FUNCTIONS MAIN WINDOW=====================================

// 1.defaultInit
// 2.setInputValue
// 3.init
// 3.initSelectorNameLamp
// 4.valid
// 5.sendResultForDrawPlan
// 6.viewDraw
// 7.sendAjaxForm
// 8.viewCalcCountLamp
// 9.viewEditCalcCountLamp
// 10.viewErrorResponse
// 11.errorResponse
// 12.hideLoadingWraper
// 13.showLoadingWraper


/**
 * [Initial default properties for lamp] 
 */
function defaultInit() {
    console.log("defaultInit");
    if (localDataLamp === undefined) {
        console.log("no localDataLamp");
        setInputValue("reflectionCoef", "70,50,20");
        setInputValue("safetyFactor", "1.4");
        setInputValue("lampsWorkHeight", 0.8);
        setInputValue("requiredIllumination", "300");
    } else {
        if (localDataLamp.reflectionCoef === undefined || localDataLamp.reflectionCoef === "") {
            setInputValue("reflectionCoef", "70,50,20");
        }
        if (localDataLamp.safetyFactor === undefined || localDataLamp.safetyFactor === "") {
            setInputValue("safetyFactor", "1.4");
        }
        if (localDataLamp.lampsWorkHeight === undefined || localDataLamp.lampsWorkHeight === 0) {
            setInputValue("lampsWorkHeight", 0.8);
        }
        if (localDataLamp.requiredIllumination === undefined || localDataLamp.requiredIllumination === "") {
            setInputValue("requiredIllumination", "300");
        }
    }

}

/**
 * [set Input Value]
 * @param {[string]} input [id input]
 * @param {[string or number]} value [value input]
 */
function setInputValue(input, value) {
    console.log("setInputValue");
    $input = $('#' + input);
    $input.val(value);
    localDataLamp[input] = value;    
    localStorage.setItem('typeLamp', JSON.stringify(localDataLamp));
    $input.trigger("change");
}

/**
 * [init properties lamp from LocalStorage] 
 */
function init() {
    console.log('init');
    $.each(localDataLamp, function(key, value) {

        if (key == "photoLink") {
            $('#js_photo_lamp').attr('src', value);
        }
        var $currentInput = $('form#calcLightning').find($('input#' + key));
        var $currentSelect = $('form#calcLightning').find($('select#' + key));
        var $currentText = $('svg#room_plan').find($('text#text_' + key));
        $currentInput.val(value);
        $currentSelect.val(value);
        $currentText.text(value);
    });
}

/**
 * [init select nameLamp]
 */
function initSelectorNameLamp() {
    console.log("initSelectorTypeLampMongodb");
    $.ajax({
        async: true,
        url: 'calc_lighting.php',
        type: 'GET',
        timeout: 15000,
        data: { select_type_lamp: true },
        beforeSend: function() {
            $(".js_loading_wraper").fadeIn("slow");
        },
        complete: function() {
            $(".js_loading_wraper").fadeOut("slow");
        },
        success: function(data) {
            var jsonResult = $.parseJSON(data);
            current_Room.getInstance().setLampSelect(jsonResult);
            $.each(jsonResult, function() {
               /* var tooltipLink = "<img src='" + this.photo_lamp + " ' height='120' widht='220'>";*/
                $option = $('<option></option>').text(this.nameLamp)
                    .val(this.nameLamp)
                    .attr('data-lumix', this.lumix)
                    .attr('data-power-lamp', this.powerLamp)
                    .attr('data-number-lamps', this.numberLamps)                    
                    .attr('data-producer', this.producer)
                    .attr('data-photo-link', this.photo_lamp)
                    .attr('data-type-lamp', this.typeLamp)
                    .attr('data-apply-lamp', this.application_area)
                    .attr('data-key', this.key)
                    .attr('data-price', this.price)                                      
                    /*.attr('data-title', tooltipLink)*/
                    .attr('data-content',"<span" + 
                        " data-apply-lamp='" + this.application_area + "'" +
                        " data-photo-link='" + this.photo_lamp + "'" +
                        " onmousemove='ShowTooltipOption(this)' " +
                        " onmouseout='HideTooltipOption(this)'>" + this.nameLamp + "</span>");                    
                $option.addClass('active-option-select');                                       
                $('#nameLamp').append($option);

            });
            if (localDataLamp.nameLamp) {
                $('#nameLamp').val(localDataLamp.nameLamp);
                $('#nameLamp').valid();
            }
            if (localDataLamp.photoLink) {
                $('#js_photo_lamp').attr('src', localDataLamp.photoLink);
            }
            if (localDataLamp.applyLamp) {
                $('#fieldset-lamp').css('visibility','visible');
                $('#info_lamp').text(localDataLamp.applyLamp);
            }    
            $('#nameLamp').selectpicker({              
              size: 10             
            });
       
             
        },
        error: function(response, status, error) { // Данные не отправлены
            viewErrorResponse(response.reresponseText);
        }
    });
}

/**
 * [valid form and procesing event disable button] 
 */
function valid() {
    console.log("valid");
    if ($('#calcLightning').valid()) {
        $('#calcButton').prop('disabled', false);
    }
}

/**
 * [send Result For Draw Plan]
 * @param  {[object]} jsonObject [json object draw] 
 */
function sendResultForDrawPlan(jsonObject) {
    console.log("sendResultForDrawPlan");
    $.ajax({
        async: true,
        url: "draw_plan.php",
        type: 'POST',
        timeout: 15000,
        data: { draw_plan: true, hourse: jsonObject },
        beforeSend: function() {
            $(".js_loading_wraper").fadeIn("slow");
        },
        complete: function() {
            $(".js_loading_wraper").fadeOut("slow");
            initSelectorNameLamp();
        },
        success: function(data) {
            var result = $.parseJSON(data);
            viewDraw(result);
        },
        error: function(response, status, error) {
            viewErrorResponse("Не полученно чертеж. Или полученные данные не коректны!");
        }
    });
}

/**
 * [view Draw]
 * @param  {[object]} resultDraw [object draw] 
 */
function viewDraw(resultDraw) {
    console.log("viewDraw");
    for (var i = 0; i < resultDraw.length; i++) {
        $li = $('<li>');
        if (i === 0) {
            $li.addClass("active");
        }
        $li.append($("<a>").attr({ "data-toggle": "tab", "href": "#" + i })
                            .html("<span data-i18n='tab_header.floor'>Этаж №</span>" + (i + 1)));
        $('#tabs_plan').append($li);
        $divTab = $('<div>').attr('id', i);
        if (i === 0) {
            // initial floor height for current room
            var ceiling = $(resultDraw[i]).attr('data-ceiling');
            if (ceiling !== undefined && $('#heightRoom').val() !== ceiling) {
                $('#heightRoom').val(ceiling);
                $('#heightRoom').trigger('change');
            }
            // end initial floor height for current room
            $divTab.addClass("tab-pane fade in active");
        } else {
            $divTab.addClass("tab-pane fade");
        }
         /*$footerDraw = $('<div>').addClass('draw-footer row');
        $checkboxLabel = $('<label>').addClass("col-md-12 checkbox-inline");
        $checkbox = $('<input>').attr({"type":"checkbox", "value":i, "class":"select_all col-md-2", "data-id": i,"name": "select_all_" + i});
        $checkboxLabel.append($checkbox).append($('<span>').addClass('checkboxTitle col-md-10').text("Все комнаты"));   
        $footerDraw.append($checkboxLabel);  */ 
        $drawPanel = $('<div>').addClass('btn-group draw-panel');
        $buttonAll = $('<button>').attr('data-id', i).addClass('btn btn-default btn-sm select_all col-md-5');        
        $buttonAll.append($('<span>').addClass('glyphicon glyphicon-th'));
        $buttonAll.append('&nbsp;Все комнаты');  
        $buttonRemoveAll = $('<button>').attr('data-id', i).addClass('btn btn-default btn-sm remove_all col-md-7');       
        $buttonRemoveAll.append('Сбросить выделенное');
        $drawPanel.append($buttonAll)
                    .append($buttonRemoveAll);              
        $divRow = $('<div>').addClass('row');        
        $divCol_1 = $('<div>').addClass('col-md-12');
        $divCol_1.append(resultDraw[i]);
        $divRow.append($divCol_1)
            .append($drawPanel);            
        $divTab.append($divRow);

        $('.tab-content').append($divTab);
    }
    /*var svgs = $('#draw_plan').find('svg');   
    var currentSVG = svgs[0];
    var curSVG = $(currentSVG);
    curSVG.trigger('load');*/

    /* console.log(polygonTooltip);*/
    /*.tooltip(); */
    //================= BOOTSTRAP TOOLTIP ===========================    
    $('.select_all').tooltip();
    //================= END BOOTSTRAP TOOLTIP =======================

}

/**
 * [sendAjaxForm description]
 * @param  {[object]} sendData           [description]
 * @param  {[string]} url                [description]
 * @param  {[name function]} beforeSendFunction [description]
 * @param  {[name function]} completeFunction   [description]
 * @param  {[name function]} successFunction    [description]
 * @param  {[name function]} errorFunction      [description]
 * @param  {[integer]} timeout            [description]
 * @param  {[string]} typeRequest        [description] 
 */
function sendAjaxForm(sendData,
    url,
    beforeSendFunction,
    completeFunction,
    successFunction,
    errorFunction,
    timeout,
    typeRequest) {
    $.ajax({
        async: true,
        url: url,
        type: typeRequest,
        timeout: timeout,
        data: sendData,
        beforeSend: beforeSendFunction,
        complete: completeFunction,
        success: function(response) {
            successFunction(response, sendData);
        },
        error: errorFunction
    });
}

/**
 * [view Error Response]
 * @param  {[string]} errorMessage [text error response] 
 */
function viewErrorResponse(errorMessage) {
    $('#error_message_request').text('');
    $('#error_message_request').text(errorMessage);
}

/**
 * [view result calc count lamp]
 * @param  {[json string]} result [result ajax responce] 
 */
function viewCalcCountLamp(result) {
    var resultResponse = $.parseJSON(result);
    console.group("RESULT CALC COUNT LAMP");
    console.log(resultResponse);
    console.groupEnd();
    if ('error' in resultResponse) {
        console.info("error code - " + resultResponse.error.code);
        console.info("file error - " + resultResponse.error.file);
        console.info("line error - " + resultResponse.error.line);
        viewErrorResponse(resultResponse.error.message);
        return false;
    } else {
        if ('calcLighting' in resultResponse) {
            $('#put_data').show();
            var calcLighting = resultResponse.calcLighting;
            addLampsInTableDataAfterCalc(calcLighting);
        } else {
            viewErrorResponse("Введенные данные некорректны");
        }
    }
}

/**
 * [view edit Calc Count Lamp]
 * @param  {[json string]} result [description] 
 */
function viewEditCalcCountLamp(result, sendData) {
    var parameters = sendData.parameters;
    //var nameLamp = parameters.nameLamp;
    var nameLamp = parameters.typeLamp;
    var resultResponse = $.parseJSON(result);
    console.group("RESULT EDIT CALC COUNT LAMP");
    console.log(resultResponse);
    console.groupEnd();
    if ('error' in resultResponse) {
        console.info("error code - " + resultResponse.error.code);
        console.info("file error - " + resultResponse.error.file);
        console.info("line error - " + resultResponse.error.line);
        viewErrorResponse(resultResponse.error.message);
        return false;
    } else {
        if ('calcCountLamp' in resultResponse) {
            $('#put_data').show();
            // console.log(resultResponse.calcCountLamp);
            var calcCountLamp = resultResponse.calcCountLamp;
            if (calcCountLamp) {
                var objectLamp = {};
                objectLamp = parameters;
                objectLamp.resultCalc = calcCountLamp;
                addLampInTableDataAfterEdit(objectLamp, nameLamp);
            }
        } else {
            viewErrorResponse("Введенные данные для редактирования некорректны");
        }
    }
}

/**
 * [view error response]
 * @param  {[xhtr object]} response [description]
 * @param  {[string]} status   [description]
 * @param  {[string]} error    [description] 
 */
function errorResponse(response, status, error) {
    viewErrorResponse(response.reresponseText);
}

/**
 * [ hide loading wraper] 
 */
function hideLoadingWraper() {
    $(".js_loading_wraper").fadeIn("slow");
}

/**
 * [ show loading wraper] 
 */
function showLoadingWraper() {
    $(".js_loading_wraper").fadeOut("slow");
}


function getRoomPerimetr(arrayWalls) {
    var perimetr = 0;
    for (var i = 0; i < arrayWalls.length; i++) {
        var currentWall = arrayWalls[i];
        var currentWallLength = round(currentWall.wall_length_mm / 1000, 2);
        perimetr = perimetr + currentWallLength;
    }
    return perimetr;
}

function ShowTooltipOption(element) {    
    var $curElement = $(element);
    var title = $curElement.attr('data-photo-link');    
    var applyLamp = $curElement.attr('data-apply-lamp');    
    $('#js_photo_lamp').attr('src', title);
    $('#info_lamp').text(applyLamp);   
}

function HideTooltipOption(element) {     
    if (localDataLamp.photoLink) {
        $('#js_photo_lamp').attr('src', localDataLamp.photoLink);
    } else {
        $('#js_photo_lamp').attr('src', "");
    }
    if (localDataLamp.applyLamp) {        
        $('#info_lamp').text(localDataLamp.applyLamp);
    }
}
//==============END FUNCTIONS MAIN WINDOW =====================================
