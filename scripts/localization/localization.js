(function($) {
      i18next
      .use(i18nextXHRBackend)      
      .init({
          lng: 'ru',
          backend: {
              loadPath: 'scripts/localization/locales/{{lng}}/{{ns}}.json'
          }
      });

      i18next.on('loaded', function(loaded) {
        $('[data-i18n]').localize();
        console.log("on loaded i18next");        
      });

      jqueryI18next.init(i18next, $, {
        tName: 't', // --> appends $.t = i18next.t
        i18nName: 'i18n', // --> appends $.i18n = i18next
        handleName: 'localize', // --> appends $(selector).localize(opts);
        selectorAttr: 'data-i18n', // selector for translating elements
        targetAttr: 'data-i18n-target', // element attribute to grab target element to translate (if diffrent then itself)
        optionsAttr: 'data-i18n-options', // element attribute that contains options, will load/set if useOptionsAttr = true
        useOptionsAttr: false, // see optionsAttr
        parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
      });

      $('.lang-select').click(function() {
        console.log("change locales");
        i18next.changeLanguage(this.innerHTML, function() {
          $("[data-i18n]").localize();
        });
      });
      
  }(jQuery));