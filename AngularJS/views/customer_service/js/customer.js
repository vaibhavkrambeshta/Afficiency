    $(document).ready(function () {
        $(window).bind('scroll', function () {
            var navHeight = $(window).height() - 460;
            if ($(window).scrollTop() > navHeight) {
                $('#nav_div').addClass('fixed');
                $('#nav_div').css('margin-top', "-20px");
                    //$('#legal_gerenal_logo').css('margin-top',"-80px");
                }
                else {
                    $('#nav_div').removeClass('fixed');
                    $('#nav_div').css('margin-top', "0px");
                    //$('#legal_gerenal_logo').css('margin-top',"-80px");
                }
            });
        $('#card-part').css('display','none');
    });


            $('body').click(function(){
            $('.premium-pop').css('display','none');
            $('.pay-pop').css('display','none');
        });
        $('.pre-edit').click(function(){
         event.stopPropagation();
         $('.premium-pop').css('display','block');
     });
        $('.pay-edit').click(function(){
         event.stopPropagation();
         $('.pay-pop').css('display','block');
     });

        $('#confirm-btn').click(function(){
            $('#confirmModal-frequency').modal('show');
            $('#preModal').modal('hide'); 
        });


      // change payment method
       $('#method').click(function(){
        if($('#method').val()=='Bank Account Withdrawal'){
          $('#withdraw-part').css('display','block');
          $('#card-part').css('display','none');
        }else if ($('#method').val()=='Credit/Debit'){
          $('#withdraw-part').css('display','none');
          $('#card-part').css('display','block');            
        }
       });

       $('#confirm-method').click(function(){
            $('#confirmModal-method').modal('show');
            $('#payModal').modal('hide'); 
        });




      //change owner
      $('#owner-edit').click(function(){
        $('#ownerModal').modal('show');
      });
      $('#owner-yes').click(function(){
        $('#ownerModal').modal('hide');
       $('#owner-detail').modal('show'); 
      })
      $('#ownerSubmit').click(function(){
        $('#owner-detail').modal('hide');
        $('#confirmModal-owner').modal('show');
      })




      //change beneficiaries
      $('#benefitEdit').click(function(){
        $('#benefitModal').modal('show');
      });
      $('#confirmBenefit').click(function(){
         $('#benefitModal').modal('hide');
          $('#confirmModal-benefit').modal('show');
      })



      //billing page
      $('.freEdit').click(function(){
        $('#preModal').modal('show');
      });
      $('.methodEdit').click(function(){
        $('#payModal').modal('show');
      })