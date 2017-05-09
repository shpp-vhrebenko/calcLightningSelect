<?php
session_start();

if (isset($_POST["viewPDF"])) {
    if (isset($_POST["viewListInRooms"])) {
        $data = $_POST["local_data"];
        initialSessionParam($data, "viewListInRooms");
    } else if (isset($_POST["viewList"])) {
        $data = $_POST["local_data"];
        initialSessionParam($data, "viewList");
    }

}


function initialSessionParam($data, $type_view)
{
    $_SESSION['calcLightningModuleCad5d'] = $data;
    $_SESSION['calcLMCad5dTypeView'] = $type_view;
}

?>

<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Расчет освещения</title>
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="stylesheet" href="styles/css/main.css?<?php echo filemtime('styles/css/main.css'); ?>">
    <!--  build:js scripts/localization/localization_vendort.js -->
    <script src="bower_components/jquery-i18next/jquery-i18next.js"></script>
    <!-- endbuild -->
    <!--  build:js scripts/localization/i18next.js -->
    <script src="bower_components/i18next/i18next.js"></script>
    <!-- endbuild -->
    <!--  build:js scripts/localization/i18nextXHRBackend.js -->
    <script src="bower_components/i18next-xhr-backend/i18nextXHRBackend.js"></script>
    <!-- endbuild -->
    <!--  build:js scripts/widget_head_vendor.js -->
    <script src="bower_components/jquery/dist/jquery.js"></script>
    <!-- endbuild -->
</head>
<body>

<!--[if lt IE 10]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> to improve your experience.</p>
<![endif]-->
<div class="js_loading_wraper">
    <div class="loading"></div>
</div>
<div class="container-fluid">
    <nav class="local_panel">
        <a href="#" class="lang-select">en</a>
        <a href="#" class="lang-select">ru</a>
        <a href="#" class="lang-select">ua</a>
    </nav>
    <div class="row">
        <div class="col-xs-12 col-md-5 headerBlock draw-plan" id="draw-plan">
            <div id="alert-tooltip" class="alert-tooltip">
                <p>Выберите комнату на чертеже, в которой нужно рассчитать освещение</p>
            </div>
            <h3 class="draw-plan__header" data-i18n="header.draw">Шаг 1. Выберите комнату на чертеже</h3>
            <ul class="nav nav-tabs " id="tabs_plan">
            </ul>
            <div class="tab-content">
            </div>
        </div>
        <div class="col-xs-12 col-md-7 headerBlock select-box" id="select-box">
            <h3 class="select-box__header" data-i18n="header.select_lamp">Шаг 2. Выберите светильник(и)</h3>

            <div class="row">
                <div class="col-xs-8 col-md-7 box-content">
                    <!-- Form calcLightning  -->
                    <form class="form-horizontal"
                          id="calcLightning"
                          role="form"
                          name="calcLightning"
                          method="post"
                          action="">
                        <!-- <div class="form-group">
                          <label for="key" class="col-sm-5 control-label" data-toggle="tooltip" data-placement="left" data-container="body" title="Выбирете артикул светильника" placeholder="артикул светильника">Артикул</label>
                          <div class="col-sm-7">
                            <input type="text" class="input-sm" name="key" data-provide="typeahead" id="key"/>
                          </div>
                        </div> -->
                        <div class="form-group">
                            <label for="search_user_lamp" class="col-sm-5 control-label" data-toggle="tooltip"
                                   data-placement="left" data-container="body" title="Выбирете наименование светильника"
                                   data-i18n="form.label_1">Поиск</label>

                            <div class="col-sm-7">
                                <input type="text" data-provide="typeahead" name="search_user_lamp"
                                       class="form-control search_lamp" id="search_user_lamp"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="nameLamp" class="col-sm-5 control-label"
                                   data-i18n="form.label_2">Cветильник</label>

                            <div class="col-sm-7">
                                <select name="nameLamp" id="nameLamp" class="room nameLamp" required>
                                    <option value="" selected disabled>Выберите светильник</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="heightRoom" class="col-sm-5 control-label" data-i18n="form.label_3">Высота
                                помещения, м</label>

                            <div class="col-sm-7">
                                <input class="room input-sm" type="number" id="heightRoom" name="heightRoom"
                                       placeholder="2.5" min="0.0" step="0.1" required/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lampsWorkHeight" class="col-sm-5 control-label" data-toggle="tooltip"
                                   data-placement="left" data-container="body"
                                   title="Высота на которой необходимо обеспечить требуемое освещение"
                                   data-i18n="form.label_4">Рабочая поверхность, м</label>

                            <div class="col-sm-7">
                                <input type="number" class="room input-sm" id="lampsWorkHeight" name="lampsWorkHeight"
                                       placeholder="0.8" min="0.0" step="0.1" required/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="reflectionCoef" class="col-sm-5 control-label" data-toggle="tooltip"
                                   data-placement="left" data-container="body"
                                   title="Коэффициент отражения поверхностей" data-i18n="form.label_5">Коэф.
                                отражения</label>

                            <div class="col-sm-7">
                                <select class="room input-sm select-sm" id="reflectionCoef" name="reflectionCoef"
                                        required>
                                    <!-- <option value="" selected>Выберите значение коэффициента отражения</option>   -->
                                    <option data-i18n="selectRCoef.opt_1" value="0,0,0">Пол-0%, стены-0%, потолок-0%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_2" value="30,30,10">Пол-30%, стены-30%,
                                        потолок-10%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_3" value="50,30,10">Пол-50%, стены-30%,
                                        потолок-10%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_4" value="50,50,10">Пол-50%, стены-50%,
                                        потолок-10%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_5" value="70,50,20">Пол-70%, стены-50%,
                                        потолок-20%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_6" value="80,30,10">Пол-80%, стены-30%,
                                        потолок-10%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_7" value="80,50,30">Пол-80%, стены-50%,
                                        потолок-30%
                                    </option>
                                    <option data-i18n="selectRCoef.opt_8" value="80,80,30">Пол-80%, стены-80%,
                                        потолок-30%
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="safetyFactor" class="col-sm-5 control-label" data-toggle="tooltip"
                                   data-placement="left" data-container="body" title="Запас освещенности"
                                   data-i18n="form.label_6">Коэф. запаса</label>

                            <div class="col-sm-7">
                                <select class="room input-sm select-sm" id="safetyFactor" name="safetyFactor" required>
                                    <!-- <option selected value="">Выберите значение коэффициента запаса</option>    -->
                                    <option value="1.1">1.1</option>
                                    <option value="1.4">1.4</option>
                                    <option value="1.6">1.6</option>
                                    <option value="1.7">1.7</option>
                                    <!-- end dsfdsfsdf -->
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="requiredIllumination" class="col-sm-5 control-label" data-toggle="tooltip"
                                   data-placement="left" data-container="body" title="по ГОСТ" data-i18n="form.label_7">Треб.
                                освещ. лк</label>

                            <div class="col-sm-7">
                                <select class="room input-sm select-sm" id="requiredIllumination"
                                        name="requiredIllumination" required>
                                    <!-- <option value="" selected>Выберите значение освещенности</option> -->
                                    <option data-i18n="selectRILum.opt_1" value="1">Значение пользователя</option>
                                    <option data-i18n="selectRILum.opt_2" value="5">Чердаки</option>
                                    <option data-i18n="selectRILum.opt_3" value="100">Лестницы</option>
                                    <option data-i18n="selectRILum.opt_4" value="50">Коридоры</option>
                                    <option data-i18n="selectRILum.opt_5" value="150">Вестибюли</option>
                                    <option data-i18n="selectRILum.opt_6" value="50">Склады в зоне хранения товара
                                    </option>
                                    <option data-i18n="selectRILum.opt_7" value="200">Склады в зоне приема товара
                                    </option>
                                    <option data-i18n="selectRILum.opt_8" value="200">Гаражи</option>
                                    <option data-i18n="selectRILum.opt_9" value="400">Парикмахерские</option>
                                    <option data-i18n="selectRILum.opt_10" value="200">Объединенные залы и буфеты
                                    </option>
                                    <option data-i18n="selectRILum.opt_11" value="400">Торговые залы магазинов</option>
                                    <option data-i18n="selectRILum.opt_12" value="200">Конференц-залы и залы заседаний
                                    </option>
                                    <option data-i18n="selectRILum.opt_13" value="500">Проектные и конструкторские
                                        бюро
                                    </option>
                                    <option data-i18n="selectRILum.opt_14" value="300">Читальные залы</option>
                                    <option data-i18n="selectRILum.opt_15" value="300">Учебные аудитории и классы
                                    </option>
                                    <option data-i18n="selectRILum.opt_16" value="500">Офисные помещения</option>
                                    <option data-i18n="selectRILum.opt_17" value="500">Рабочий кабинет</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="customRequiredIllumination" class="col-sm-5 control-label"
                                   data-i18n="form.label_8">Треб. освещ. лк</label>

                            <div class="col-sm-7">
                                <input class="room input-sm" type="number" id="customRequiredIllumination"
                                       name="customRequiredIllumination" min="0" step="1"/>
                            </div>
                        </div>
                        div
                    </form>
                    <!-- End Form calcLightning  -->
                </div>
                <div class="col-xs-4 col-md-5 image-box" id="image-box">
                    <div class="row image-lamp">
                        <img src="" class="img-responsive animated fadeInDownBig image-animate col-md-12"
                             id="js_photo_lamp" alt="">
                    </div>
                    <div class="row fieldset-lamp" id="fieldset-lamp">
                        <fieldset class="col-md-12">
                            <legend data-i18n="label.legend">Область использования:</legend>
                            <p class="info_lamp" id="info_lamp"></p>
                        </fieldset>
                    </div>
                    <div class="row">
                        <button type="button" class="btn btn-sm btn-warning col-xs-12 col-md-12 set_data" id="set_data"
                                data-i18n="header.add_lamp">
                            Шаг 3. Добавить светильник
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row relativeBox">
        <div class="col-xs-12 col-md-12 table-box" id="table-box">
            <h3 class="table-box__header" data-i18n="header.table_lamp">Результаты расчета освещения</h3>

            <p id="error_message_request" class="error_message"></p>
            <!--  Bootstrap-tables -->

            <div class="table-responsive">
                <table id="bTable" data-group-by="true" data-group-by-field="roomTitle"></table>
            </div>

            <!-- Bootstrap table context menu -->
            <ul id="example1-context-menu" class="dropdown-menu">
                <li data-item="delete"><a>Удалить</a></li>
            </ul>
            <!-- End Bootstrap table context menu -->

            <!-- End Bootstrap-tables -->
            <!-- User Panel  -->
            <div class="row user-result-panel" id="user-result-panel">
                <div class="dropup col-md-1 half-col-md view-pdf">
                    <button class="btn btn-sm btn-default dropdown-toggle" type="button" data-toggle="dropdown"
                            data-i18n="button.pdf">PDF
                        <span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li><a type="button" class="view-pdf__item" id="view_pdf_listLightingDevicesInRooms"
                               data-i18n="doc.doc_1">Ведомость осветительных приборов по помещениям</a></li>
                        <li><a type="button" class="view-pdf__item" id="view_pdf_listLightingDevices"
                               data-i18n="doc.doc_2">Ведомость осветительных приборов</a></li>
                    </ul>
                </div>
                <button type="button" class="btn btn-sm btn-space btn-primary col-sm-3 put_data" id="put_data"
                        data-i18n="button.save">
                    Расставить светильники на чертеже
                </button>
                <button type="button" class="btn btn-sm btn-space btn-default col-sm-1 cancel" id="cancel"
                        data-i18n="button.cancel">
                    Отмена
                </button>
            </div>
            <!-- End User Panel  -->
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="admin_panel" tabindex="-1" role="dialog" aria-labelledby="admin_panel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>

<!-- build:js scripts/widget_vendor.js -->
<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
<script src="bower_components/lodash/lodash.js"></script>
<script type="text/javascript" src="bower_components/bootstrap3-typeahead/bootstrap3-typeahead.js"></script>
<script src="bower_components/bootstrap-table/dist/bootstrap-table.js"></script>
<script src="bower_components/bootstrap-table-contextmenu/dist/bootstrap-table-contextmenu.min.js"></script>
<script src="bower_components/bootstrp3-editable/bootstrap3-editable/js/bootstrap-editable.js"></script>
<script src="bower_components/bootstrap-table/dist/extensions/editable/bootstrap-table-editable.js"></script>
<script src="bower_components/bootstrap-table/dist/extensions/group-by-v2/bootstrap-table-group-by.js"></script>
<script src="bower_components/bootstrap-select/dist/js/bootstrap-select.js"></script>
<script src="bower_components/bootstrap-table/dist/locale/bootstrap-table-ru-RU.js"></script>
<script src="bower_components/modernizr/modernizr.js"></script>
<script src="bower_components/jquery-validation/dist/jquery.validate.js"></script>
<!-- endbuild -->

<script src="scripts/widget.js"></script>
<script src="scripts/localization/localization.js"></script>

</body>
</html>
