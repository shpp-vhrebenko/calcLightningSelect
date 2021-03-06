

    function typeLampFormValidation() {
        console.log("typeLampFormValidation");             

        $.validator.addMethod('greaterThanZero', function(value, element) {
            return this.optional(element) || (parseFloat(value) > 0);
        }, '');

        $('#calcLightning').validate({
          debug: true,
          rules:{
            widthRoom:{
                required: true,
                greaterThanZero: true
            },
            lengthRoom:{
                required: true,
                greaterThanZero: true
            },
            heightRoom:{
                required: true,
                greaterThanZero: true
            },        
            lampsWorkHeight:{
                required: true,           
                greaterThanZero: true
            },
            reflectionCoef:{
                required: true
            },
            safetyFactor:{
                required: true
            },
            requiredIllumination: {
                required: true,
                greaterThanZero: true
            },
            customRequiredIllumination: {
                required: true,
                greaterThanZero: true
            },
            nameLamp: {
                required: true
            },
            luminousFlux: {
                required: true,
                greaterThanZero: true
            },
            keyLamp: {},
            search_user_lamp: {}
          },

          messages:{

            widthRoom:{
                required: 'Это поле обязательно для заполнения'
            },
            lengthRoom:{
                required: 'Это поле обязательно для заполнения'
            },
            heightRoom:{
                required: 'Это поле обязательно для заполнения'
            },
            heightRoomlighting:{
                required: 'Это поле обязательно для заполнения'
            },
            reflectionCoef:{
                required: 'Это поле обязательно для заполнения'
            },
            safetyFactor:{
                required: 'Это поле обязательно для заполнения'
            },
            requiredIllumination:{
                required: 'Это поле обязательно для заполнения'
            },
            customRequiredIllumination:{
                required: 'Это поле обязательно для заполнения'
            },
            nameLamp:{
                required: 'Это поле обязательно для заполнения'
            },
            luminousFlux:{
                required: 'Это поле обязательно для заполнения'
            }
          },
            focusInvalid: false,
            errorPlacement: function (error, element) {
              return true;
            }
        });

        console.info($('#calcLightning').valid());
       /* if ($('#calcLightning').valid()) {            
            $('#set_data').prop('disabled', false);
            $('#set_data').addClass('active');
        } else {           
            $('#set_data').prop('disabled', 'disabled');
            $('#set_data').addClass('active');
        }*/
    }    

   
    


   

