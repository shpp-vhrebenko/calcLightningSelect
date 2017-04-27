(function($) {
 /*   i18next.   
    init({
      lng: 'en',
      fallbackLng: "ru",     
      debug: false,
      resources: {        
        ru: {
          translation: {
            draw: "чертеж"
          }
        },
        en: {
          translation: {
            draw: "draw"
          }
        }
        
      }     
    });

   jqueryI18next.init(i18nextInstance, $, {
    tName: 't', // --> appends $.t = i18next.t
    i18nName: 'i18n', // --> appends $.i18n = i18next
    handleName: 'localize', // --> appends $(selector).localize(opts);
    selectorAttr: 'data-i18n', // selector for translating elements
    targetAttr: 'data-i18n-target', // element attribute to grab target element to translate (if diffrent then itself)
    optionsAttr: 'data-i18n-options', // element attribute that contains options, will load/set if useOptionsAttr = true
    useOptionsAttr: false, // see optionsAttr
    parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
   });

   i18next.on('loaded', function(loaded) {
    $('[data-i18n]').localize();
    console.log("loaded ---------------------------------------------");
    /*$('input[name=email]').attr('placeholder',i18next.t('regFormemail'));
     $('input[name=password]').attr('placeholder',i18next.t('regFormpassword'));
     $('input[name=username]').attr('placeholder',i18next.t('regFormname'));*/
   /* $('input[name=phoneNumber]').attr('placeholder',i18next.t('phoneNumber'));
    $('#log_in_id').attr('value',i18next.t('regFormlogIn'));
    $('#sign_up_id').attr('value',i18next.t('regFormsignUp'));*/
  /* });
   $(".chooseLanguage").change(function() {
    i18next.changeLanguage(this.value, function() {
     $("[data-i18n]").localize();
    });
   });*/

    /* i18next.init({
        lng: 'ru',
        resources: {
          en: {
            translation: {
              header: {
                draw: 'Step 1. Select a room in the drawing'
              }
            }
          },
          ru: {
            translation: {
              header: {
                draw: 'Шаг 1. Выберите комнату на чертеже'
              }
            }
          },
          ua: {
            translation: {
              header: {
                draw: 'Крок 1. Виберіть кімнату на кресленні'
              }
            }
          }
        }
      }, function(err, t) {
        jqueryI18next.init(i18next, $);        
        $("[data-i18n]").localize();

        $('.lang-select').click(function() {
          i18next.changeLanguage(this.innerHTML);         
          $("[data-i18n]").localize();
        });
      });*/

      i18next
      .use(i18nextXHRBackend)      
      .init({
          lng: 'ru',
          backend: {
              loadPath: 'scripts/localization/locales/{{lng}}/{{ns}}.json'
          }
        }, function(err, t) {
          jqueryI18next.init(i18next, $);
          $("[data-i18n]").localize();

          $('.lang-select').click(function() {
            console.log("hi");
            i18next.changeLanguage(this.innerHTML, function() {
              $("[data-i18n]").localize();
            });
          });
      });
  }(jQuery));