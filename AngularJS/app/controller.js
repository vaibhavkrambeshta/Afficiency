/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 *
 */
;



(function() {
  //var host = "http://54.169.95.242:7000";
  var client = new ClientJS();
  // Get the client's fingerprint id
  var fingerprint = client.getFingerprint();
  // Print the 32bit hash id to the console
  //var host = "http://localhost:7000";
  //var host = "http://127.0.0.1:7000";
  //var host = "http://10.0.0.26:7000";
  var host = "http://10.0.0.26";
  //var host = "http://10.0.0.26:7000";
  var api_url = host+"/api/v1";
  var home_page_ids = {1:"/home1",2:"/home2", 3: "/home3"};
  angular
    .module('boilerplate')
    .controller('MainController', function($scope, $http, $location, $cookies,body_mass_rules_service,get_quote_price_service, $anchorScroll, $uibModal){
       console.log("Inside Home Controller");
       $scope.auth = false;
       var email = $.cookie("email");
       if(email !== null && email !== undefined && email.length > 0){
         $scope.auth = true;
         $scope.username = $.cookie('fname')+" "+$.cookie('lname');
       }
       var key = "slogan";
       $scope.val = false;
       $scope.my_params = {showModal : false};
       //$scope[key] = "Welcome to Alastor";
       var idx = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
       $scope.banner_image = "img_"+idx;

       // Create a new ClientJS object

       $http.get(api_url+"/whoami?fp="+fingerprint).then(function(data){
         console.log(data);
       },function(err){

       })


       $http.get(api_url+"/page_attributes?step_id=0").then(
         function(data){
           data= data.data;
           var resp = data.design.attributes;
           for(var i=0; i<resp.length; i++){
             console.log(resp[i].name);
             $scope[resp[i].name] = resp[i].display_text;
           }
         },function(err){
           $scope.main_slogan = "Welcome to afficiency";
         }
       )
       $scope.logout = function(){
         $.removeCookie("userid");
         $.removeCookie("user");
         $.removeCookie("fname");
         $.removeCookie("lname");
         $.removeCookie("email");
         $scope.auth = false;
       }
        $scope.signup = function(){
          $location.path("signup");
        }

        $scope.open = function() {
          console.log("Inside open");
          $location.path("login");
        };

        $scope.ok = function() {
          $scope.my_params.showModal = false;
        };

        $scope.cancel = function() {
          $scope.my_params.showModal = false;
        };


        $scope.next = function(){
          console.log("Inside next controller");
          $http.get(api_url+"/page_attributes?step_id=1").then(
            function(data){
              data = data.data;
              console.log(data);
              localStorage.setItem('object', JSON.stringify(data))
              console.log(data.design);
              $location.path(data.design.design_url);
            },
            function(err){
              console.log("Failed to load attributes");
            }
          )
        }
    })
    .controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
      console.log("Inside Modal Controller");
    })
    .controller('quote_one_Ctrl', function($scope, $http, $location, $cookies, $routeParams, body_mass_rules_service,get_quote_price_service){

      console.log('firstName ' + sessionStorage.firstName,
      'lastName ' +sessionStorage.lastName,
      'gender ' +sessionStorage.gender,
      'dateOfBirth '+sessionStorage.dateOfBirth,
      'height_feet ' +sessionStorage.height_feet,
       'height_inches ' +sessionStorage.height_inches,
      'weight '+sessionStorage.weight,
      'tabacco_user ' + sessionStorage.tabacco_user,
      'policySpan ' +sessionStorage.policySpan,
      'age ' +sessionStorage.age);

      $scope.monthly_premium_amount = '';
      $scope.coverage_amount = '';
      $scope.rate_type = '';

      console.log('parameter',JSON.parse($routeParams.param1));

      $http.get(api_url+"/get_quote_rate_type").then(
        function(data){
              data = data.data;
              console.log('data',data);
               body_mass_rules_service.setbody_mass_rules(data.response);
               $scope.body_mass_rules = body_mass_rules_service.getbody_mass_rules();
               $scope.get_rate_type();
        },
        function(err){
          console.log(err);
        }
      );

      $http.get(api_url+"/get_quote_price").then(
        function(data){
          console.log("Inside get quote price");
          try{
            get_quote_price_service.set_quote_price(data.data.response);
            $scope.all_quote_price = get_quote_price_service.get_quote_price();
          }
          catch(err){
            console.log("Exception in get");
            console.log(err);
          }

        },
        function(err){
          console.log(err);
        }
      )

      console.log(($routeParams.param1));
      var parameters = JSON.parse($routeParams.param1);
      $scope.coverage_year = parameters['policy_year'];

      $scope.selected_coverage_amount = 5.5;//initial value

      $scope.go_back = function(){
        window.history.back();
      }
      $scope.buy_now = function(){
        sessionStorage.coverage_total_premium_amount = $scope.coverage_amount;
        sessionStorage.coverage_monthly_premium_amount = $scope.monthly_premium_amount;
        sessionStorage.premium_span = $scope.coverage_year;
        $location.path("/about_you");
      }


      $scope.selected_coverage_amount_change = function()
      {
          console.log($scope.selected_coverage_amount);
          var policy_amount = $scope.coverage_amount = 100000*$scope.selected_coverage_amount ;
          for(var obj in $scope.all_quote_price)
          {
            /*console.log(parameters);
            console.log(policy_amount);*/
            if($scope.all_quote_price[obj].life_term == parameters['policy_year']
             && $scope.all_quote_price[obj].gender == parameters['gender']
             && $scope.all_quote_price[obj].age == parameters['age']
             && $scope.all_quote_price[obj].rate_type == $scope.rate_type
             && $scope.all_quote_price[obj].policy_amt_range_from <= policy_amount
             && $scope.all_quote_price[obj].policy_amt_range_to >= policy_amount)
             {
                  console.log("Condition Matched");
                 var monthly_quote = (60+$scope.all_quote_price[obj].rate_multiplier*(policy_amount/1000))/12;
                 $scope.monthly_premium_amount = '$'+monthly_quote.toFixed(2);
                 console.log('monthly_premium_amount',$scope.monthly_premium_amount);
                 break;
             }
          }
      }


      $scope.get_rate_type = function()
      {
        console.log("Inside get rate type");
        console.log(parameters);
        console.log($scope.body_mass_rules);
         for (var obj in $scope.body_mass_rules)
         {
            if($scope.body_mass_rules[obj].gender==parameters['gender']
              && $scope.body_mass_rules[obj].height == parameters['height_feet']+','+parameters['height_inches']
              && $scope.body_mass_rules[obj].weight_from <= parameters['weight']
              && parameters['weight'] <= $scope.body_mass_rules[obj].weight_to)
            {
              if($scope.body_mass_rules[obj].prefered_plus != 1)
              {
                $scope.rate_type = 'Preferred Plus';
                break;
              }
              else if($scope.body_mass_rules[obj].prefered != 1)
              {
                $scope.rate_type = 'Preferred';
                break;
              }
              else if($scope.body_mass_rules[obj].standard != 1)
              {
                $scope.rate_type = 'Standard';
                break;
              }
              else if($scope.body_mass_rules[obj].smoker != 1)
              {
                $scope.rate_type = 'Smoker';
                break;
              }
            }
          }

          $scope.selected_coverage_amount_change();
      }


       $scope.apply_for_insaurance = function(policy_amount, policy_span)
       {
         console.log(policy_amount);
         console.log(policy_span);
         $location.path('buy_now');
       }
    })
    .controller("PIController1", function($scope, $http,$location){
        console.log("Inside Homecontroller 1");

          $scope.quote_calculation = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years,age)
          {
            console.log({'first_name':fname,'last_name':lname,'gender':Gender,'date_of_birth':Dob,'height_feet':feet,'height_inches':inch,'weight':weight,'smoker':tabacco,'policy_year':years,'age':age});
            var param1 ={'first_name':fname,
                          'last_name':lname,
                          'gender':Gender,
                          //'date_of_birth':Dob,
                          'height_feet':feet,
                          'height_inches':inch,
                          'weight':weight,
                          'smoker':tabacco,
                          'policy_year':years,
                          'age':age};
            console.log(JSON.stringify(param1));
            $location.path('/quote_page_one/'+JSON.stringify(param1));
          }

          $scope.get_quote = function(fname,lname,Gender,Dob,feet,inch,weight,tabacco,years)
          {
            var today = new Date();
            var birthDate = new Date($scope.dob);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
            {
              age--;
            }
            sessionStorage.firstName = fname;
            sessionStorage.lastName = lname;
            sessionStorage.gender = Gender;
            sessionStorage.dateOfBirth = Dob;
            sessionStorage.height_feet  =feet;
            sessionStorage.height_inches = inch;
            sessionStorage.weight = weight;
            sessionStorage.tabacco_user = tabacco;
            sessionStorage.policySpan = years;
            sessionStorage.age = age;

            console.log(fname +' '+ lname+' '+Gender+' '+Dob+' '+feet+' '+inch+' '+weight+' '+tabacco+''+years+''+age);
            $scope.quote_calculation($scope.fname,$scope.lname,$scope.gender,$scope.dob,$scope.feet,$scope.inches,$scope.weight,$scope.smoker,$scope.years,age);
          }
    })
    .controller("PIController2", function($scope, $http, $location){
      $scope.quote_calculation = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years,age)
      {

        console.log({'first_name':fname,'last_name':lname,'gender':Gender,'date_of_birth':Dob,'height_feet':feet,'height_inches':inch,'weight':weight,'smoker':tabacco,'policy_year':years,'age':age});
        var param1 ={'first_name':fname,
                      'last_name':lname,
                      'gender':Gender,
                      //'date_of_birth':Dob,
                      'height_feet':feet,
                      'height_inches':inch,
                      'weight':weight,
                      'smoker':tabacco,
                      'policy_year':years,
                      'age':age};
        console.log(JSON.stringify(param1));
        $location.path('/quote_page_one/'+JSON.stringify(param1));
      }

      $scope.get_quote = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years)
      {
        var today = new Date();
        var birthDate = new Date($scope.dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
          age--;
        }
        sessionStorage.firstName = fname;
        sessionStorage.lastName = lname;
        sessionStorage.gender = Gender;
        sessionStorage.dateOfBirth = Dob;
        sessionStorage.height_feet  =feet;
        sessionStorage.height_inches = inch;
        sessionStorage.weight = weight;
        sessionStorage.tabacco_user = tabacco;
        sessionStorage.policySpan = years;
        sessionStorage.age = age;
        console.log(fname +' '+ lname+' '+Gender+' '+Dob+' '+feet+' '+inch+' '+weight+' '+tabacco+''+years+''+age);
        $scope.quote_calculation($scope.fname,$scope.lname,$scope.gender,$scope.dob,$scope.feet,$scope.inches,$scope.weight,$scope.smoker,$scope.years,age);
      }
    })
    .controller("quote_two_Ctrl", function($scope, $http, $location, $cookies, $routeParams, body_mass_rules_service,get_quote_price_service){

            console.log('firstName ' + sessionStorage.firstName,
            'lastName ' +sessionStorage.lastName,
            'gender ' +sessionStorage.gender,
            'dateOfBirth '+sessionStorage.dateOfBirth,
            'height_feet ' +sessionStorage.height_feet,
             'height_inches ' +sessionStorage.height_inches,
            'weight '+sessionStorage.weight,
            'tabacco_user ' + sessionStorage.tabacco_user,
            'policySpan ' +sessionStorage.policySpan,
            'age ' +sessionStorage.age);
            console.log(($routeParams.param1));
            $scope.premium_10_years = 0;
            $scope.premium_15_years = 0;
            $scope.premium_20_years = 0;
            $scope.premium_30_years = 0;
            $scope.coverage_amount = 0;
            $scope.selected_coverage_amount = 5.5;
            $scope.rate_type = '';
            $scope.is15 = true;
            var parameters = JSON.parse($routeParams.param1);

            $scope.body_mass_rules = [];
            $scope.all_quote_price = [];

            $scope.next = function(years){
              sessionStorage.coverage_total_premium_amount =   $scope.coverage_amount;

              sessionStorage.premium_span = years;
              if(years == 10)
              {
                sessionStorage.coverage_monthly_premium_amount = $scope.premium_10_years;
              }
              else if(years == 15)
              {
                sessionStorage.coverage_monthly_premium_amount = $scope.premium_15_years;
              }
              else if(years == 20)
              {
                sessionStorage.coverage_monthly_premium_amount = $scope.premium_20_years;
              }
              else if(years == 30)
              {
                sessionStorage.coverage_monthly_premium_amount = $scope.premium_30_years;
              }

              $location.path("/about_you")
            }

            $http.get(api_url+"/get_quote_rate_type").then(
              function(data){
                data = data.data;
                body_mass_rules_service.setbody_mass_rules(data.response);
                $scope.body_mass_rules = body_mass_rules_service.getbody_mass_rules();
                $scope.get_rate_type();
              },
              function(err){
                console.log(err);
              }
            );
            $http.get(api_url+"/get_quote_price").then(
              function(data){
                data = data.data;
                get_quote_price_service.set_quote_price(data.response);
                $scope.all_quote_price = get_quote_price_service.get_quote_price();
              },
              function(err){
                console.log(err);
              }
            );


            $scope.go_back = function(){
              window.history.back();
            }
            $scope.buy_now = function(){

              $location.path("/about_you");
            }

            $scope.selected_coverage_amount_change = function()
            {
              var policy_amount = $scope.coverage_amount = 100000*$scope.selected_coverage_amount ;
              //console.log($scope.selected_coverage_amount);

              for(var obj in $scope.all_quote_price)
              {
                if($scope.all_quote_price[obj].life_term == 10 //parameters['policy_year']
                 && $scope.all_quote_price[obj].gender == parameters['gender']
                 && $scope.all_quote_price[obj].age == parameters['age']
                 && $scope.all_quote_price[obj].rate_type == $scope.rate_type
                 && $scope.all_quote_price[obj].policy_amt_range_from <= policy_amount
                 && $scope.all_quote_price[obj].policy_amt_range_to >= policy_amount)
                 {
                     var monthly_quote = (60+$scope.all_quote_price[obj].rate_multiplier*(policy_amount/1000))/12;
                     $scope.premium_10_years = '$'+monthly_quote.toFixed(2);
                     console.log($scope.premium_10_years);
                     //break;
                 }

                 if($scope.all_quote_price[obj].life_term == 15 //parameters['policy_year']
                  && $scope.all_quote_price[obj].gender == parameters['gender']
                  && $scope.all_quote_price[obj].age == parameters['age']
                  && $scope.all_quote_price[obj].rate_type == $scope.rate_type
                  && $scope.all_quote_price[obj].policy_amt_range_from <= policy_amount
                  && $scope.all_quote_price[obj].policy_amt_range_to >= policy_amount)
                  {
                      var monthly_quote = (60+$scope.all_quote_price[obj].rate_multiplier*(policy_amount/1000))/12;
                      $scope.premium_15_years = '$'+monthly_quote.toFixed(2);
                      console.log($scope.premium_15_years);
                      //break;
                  }

                  if($scope.all_quote_price[obj].life_term == 20 //parameters['policy_year']
                   && $scope.all_quote_price[obj].gender == parameters['gender']
                   && $scope.all_quote_price[obj].age == parameters['age']
                   && $scope.all_quote_price[obj].rate_type == $scope.rate_type
                   && $scope.all_quote_price[obj].policy_amt_range_from <= policy_amount
                   && $scope.all_quote_price[obj].policy_amt_range_to >= policy_amount)
                   {
                       var monthly_quote = (60+$scope.all_quote_price[obj].rate_multiplier*(policy_amount/1000))/12;
                       $scope.premium_20_years = '$'+monthly_quote.toFixed(2);
                       console.log($scope.premium_20_years);
                       //break;
                   }

                   if($scope.all_quote_price[obj].life_term == 30 //parameters['policy_year']
                    && $scope.all_quote_price[obj].gender == parameters['gender']
                    && $scope.all_quote_price[obj].age == parameters['age']
                    && $scope.all_quote_price[obj].rate_type == $scope.rate_type
                    && $scope.all_quote_price[obj].policy_amt_range_from <= policy_amount
                    && $scope.all_quote_price[obj].policy_amt_range_to >= policy_amount)
                    {
                        var monthly_quote = (60+$scope.all_quote_price[obj].rate_multiplier*(policy_amount/1000))/12;
                        $scope.premium_30_years = '$'+monthly_quote.toFixed(2);
                        console.log($scope.premium_30_years);
                        //break;
                    }
              }
            }

            $scope.get_rate_type = function()
            {

              console.log($scope.body_mass_rules);

              for (var obj in $scope.body_mass_rules)
              {
                 if($scope.body_mass_rules[obj].gender==parameters['gender']
                   && $scope.body_mass_rules[obj].height == parameters['height_feet']+','+parameters['height_inches']
                   && $scope.body_mass_rules[obj].weight_from <= parameters['weight']
                   && parameters['weight'] <= $scope.body_mass_rules[obj].weight_to)
                 {
                   if($scope.body_mass_rules[obj].prefered_plus != 1)
                   {
                     $scope.rate_type = 'Preferred Plus';
                     break;
                   }
                   else if($scope.body_mass_rules[obj].prefered != 1)
                   {
                     $scope.rate_type = 'Preferred';
                     break;
                   }
                   else if($scope.body_mass_rules[obj].standard != 1)
                   {
                     $scope.rate_type = 'Standard';
                     break;
                   }
                   else if($scope.body_mass_rules[obj].smoker != 1)
                   {
                     $scope.rate_type = 'Smoker';
                     break;
                   }
                 }
               }
                console.log($scope.rate_type);
                $scope.selected_coverage_amount_change();
            }

             //$scope.get_rate_type();
    })
    .controller("PIController3", function($scope, $http, $location){
        $scope.quote_calculation = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years,age)
        {
          console.log({'first_name':fname,'last_name':lname,'gender':Gender,'date_of_birth':Dob,'height_feet':feet,'height_inches':inch,'weight':weight,'smoker':tabacco,'policy_year':years,'age':age});
          var param1 ={'first_name':fname,
                        'last_name':lname,
                        'gender':Gender,
                        //'date_of_birth':Dob,
                        'height_feet':feet,
                        'height_inches':inch,
                        'weight':weight,
                        'smoker':tabacco,
                        'policy_year':years,
                        'age':age};
          console.log(JSON.stringify(param1));
          $location.path('/quote_page_two/'+JSON.stringify(param1));
        }

        $scope.get_quote = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years)
        {
          var today = new Date();
          var birthDate = new Date($scope.dob);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
          {
            age--;
          }
          sessionStorage.firstName = fname;
          sessionStorage.lastName = lname;
          sessionStorage.gender = Gender;
          sessionStorage.dateOfBirth = Dob;
          sessionStorage.height_feet  =feet;
          sessionStorage.height_inches = inch;
          sessionStorage.weight = weight;
          sessionStorage.tabacco_user = tabacco;
          sessionStorage.policySpan = years;
          sessionStorage.age = age;
          console.log(fname +' '+ lname+' '+Gender+' '+Dob+' '+feet+' '+inch+' '+weight+' '+tabacco+''+years+''+age);
          $scope.quote_calculation($scope.fname,$scope.lname,$scope.gender,$scope.dob,$scope.feet,$scope.inches,$scope.weight,$scope.smoker,$scope.years,age);
        }
    }).controller("PIController4", function($scope, $http, $location){
      $scope.quote_calculation = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years,age)
      {

        console.log({'first_name':fname,'last_name':lname,'gender':Gender,'date_of_birth':Dob,'height_feet':feet,'height_inches':inch,'weight':weight,'smoker':tabacco,'policy_year':years,'age':age});
        var param1 ={'first_name':fname,
                      'last_name':lname,
                      'gender':Gender,
                      //'date_of_birth':Dob,
                      'height_feet':feet,
                      'height_inches':inch,
                      'weight':weight,
                      'smoker':tabacco,
                      'policy_year':years,
                      'age':age};
        console.log(JSON.stringify(param1));
        $location.path('/quote_page_two/'+JSON.stringify(param1));
      }

      $scope.get_quote = function(fname, lname,gender,dob,height,weight,smoker,years)
      {
        var feet =height.split(',')[0];
        var inch = height.split(',')[1];
        var today = new Date();
        var birthDate = new Date($scope.dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
          age--;
        }
        sessionStorage.firstName = fname;
        sessionStorage.lastName = lname;
        sessionStorage.gender = gender;
        sessionStorage.dateOfBirth = dob;
        sessionStorage.height_feet  =feet;
        sessionStorage.height_inches = inch;
        sessionStorage.weight = weight;
        sessionStorage.tabacco_user = smoker;
        sessionStorage.policySpan = years;
        sessionStorage.age = age;
        console.log(fname +' '+ lname+' '+gender+' '+dob+' '+feet+' '+inch+' '+weight+' '+smoker+''+years+''+age);
        $scope.quote_calculation($scope.fname,$scope.lname,$scope.gender,$scope.dob,feet,inch,$scope.weight,$scope.smoker,$scope.years,age);
      }
    })
    .controller("PIController5", function($scope, $http, $location){
      $scope.quote_calculation = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years,age)
      {

        console.log({'first_name':fname,'last_name':lname,'gender':Gender,'date_of_birth':Dob,'height_feet':feet,'height_inches':inch,'weight':weight,'smoker':tabacco,'policy_year':years,'age':age});
        var param1 ={'first_name':fname,
                      'last_name':lname,
                      'gender':Gender,
                      //'date_of_birth':Dob,
                      'height_feet':feet,
                      'height_inches':inch,
                      'weight':weight,
                      'smoker':tabacco,
                      'policy_year':years,
                      'age':age};
        console.log(JSON.stringify(param1));
        $location.path('/quote_page_two/'+JSON.stringify(param1));
      }

      $scope.get_quote = function(fname, lname,gender,dob,height,weight,smoker,years)
      {
        var feet =height.split(',')[0];
        var inch = height.split(',')[1];
        var today = new Date();
        var birthDate = new Date($scope.dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
          age--;
        }
        sessionStorage.firstName = fname;
        sessionStorage.lastName = lname;
        sessionStorage.gender = gender;
        sessionStorage.dateOfBirth = dob;
        sessionStorage.height_feet  =feet;
        sessionStorage.height_inches = inch;
        sessionStorage.weight = weight;
        sessionStorage.tabacco_user = smoker;
        sessionStorage.policySpan = years;
        sessionStorage.age = age;

        console.log(fname +' '+ lname+' '+gender+' '+dob+' '+feet+' '+inch+' '+weight+' '+smoker+''+years+''+age);
        $scope.quote_calculation($scope.fname,$scope.lname,$scope.gender,$scope.dob,feet,inch,$scope.weight,$scope.smoker,$scope.years,age);
      }
    })
    .controller("PIController6", function($scope, $http, $location){
      $scope.quote_calculation = function(fname, lname,Gender,Dob,feet,inch,weight,tabacco,years,age)
      {
        console.log({'first_name':fname,'last_name':lname,'gender':Gender,'date_of_birth':Dob,'height_feet':feet,'height_inches':inch,'weight':weight,'smoker':tabacco,'policy_year':years,'age':age});
        var param1 ={'first_name':fname,
                      'last_name':lname,
                      'gender':Gender,
                      //'date_of_birth':Dob,
                      'height_feet':feet,
                      'height_inches':inch,
                      'weight':weight,
                      'smoker':tabacco,
                      'policy_year':years,
                      'age':age};
        console.log(JSON.stringify(param1));
        $location.path('/quote_page_two/'+JSON.stringify(param1));
      }

      $scope.get_quote = function(fname, lname,gender,dob,height,weight,smoker,years)
      {
        //alert("Calling");
        var feet =height.split(',')[0];
        var inch = height.split(',')[1];
        var today = new Date();
        var birthDate = new Date($scope.dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
          age--;
        }
        console.log(fname);
        sessionStorage.firstName = fname;
        sessionStorage.lastName = lname;
        sessionStorage.gender = gender;
        sessionStorage.dateOfBirth = dob;
        sessionStorage.height_feet  =feet;
        sessionStorage.height_inches = inch;
        sessionStorage.weight = weight;
        sessionStorage.tabacco_user = smoker;
        sessionStorage.policySpan = years;
        sessionStorage.age = age;
        console.log('sessionStorage.firstName',sessionStorage.firstName);
        console.log(fname +' '+ lname+' '+gender+' '+dob+' '+feet+' '+inch+' '+weight+' '+smoker+''+years+''+age);
        $scope.quote_calculation($scope.fname,$scope.lname,$scope.gender,$scope.dob,feet,inch,$scope.weight,$scope.smoker,$scope.years,age);
      }
    })
    .controller("SetupController", function($scope, $http){
      console.log("Inside setup controller");
      $http.get(api_url+"/getExperienceDetails").then(
        function(data){
          data = data.data;
          console.log(data);
          $scope.items = data.exp;
        },
        function(err){
          console.log(err);
        }
      )
    })
    .controller("SignupController", function($scope, $http, $location){
      $scope.msg = false;
      $scope.err_msg = false;
      $scope.p={email:''};
      $scope.p.agree = true
      console.log("Inside SignUp controller");
      $scope.register = function(){
        console.log("Inside register");
        params = {email:$scope.email, password: $scope.password,
                first_name: $scope.fname, last_name: $scope.lname};
        console.log(params);
        $scope.msg = false;
        $scope.err_msg = false;
        $http.post(api_url+"/register",params).then(
          function(data){
            console.log("Registered..");
            $scope.msg=true;
          },
          function(err){
            //alert("Error");
            $scope.err_msg=true;
            $scope.message= "Failed to register. Please try again or contact administrator";
            console.log(err);
          }
        )
      }
    })
    .controller("LoginController", function($scope, $http, $location){
      $scope.err_msg = false;
      $scope.message = "";
      $http.get(api_url+"/whoami?fp="+fingerprint).then(function(data){},function(err){})
      $scope.login = function(){
        var params = {email:$scope.email, password:$scope.password}
        console.log(params);
        $http.post(api_url+"/login", params).then(
          function(data){
            data = data.data;
            console.log(data);
            $location.path("#!/");
            //alert($.cookie("email") );
          },
          function(err){
            console.log(err);
            $scope.message = "Failed to login. Please enter valid credentials";
            $scope.err_msg = true;
          }
        )
      }
    })
    .controller("AdminController", function($scope,$http, $route){
      console.log("Inside admin controller");
      $scope.items = [];
      $scope.steps = [];
      $scope.exp_name = "";
      $scope.exp_app = "";
      $scope.slider = {
        min: 100,
        max: 180,
        options: {
          floor: 0,
          ceil: 450
        }
      };
      //Exeprience Tab
      $http.get(api_url+"/experience").then(
        function(data){
          console.log(data);
          data = data.data;
          $scope.items = data.response;
        },
        function(err){
          console.log(err);
        }
      )

      $scope.add_exp = function(a,b){
        $http.post(api_url+"/experience", {name:a, applicability:b})
        .then(function(data){
          console.log(data);
          data = data.data;
          $route.reload();
        }, function(err){
          console.log(err);
        })
      }
      //Exeprience Step
      $http.get(api_url+"/experience_step").then(
        function(data){
          console.log(data);
          data = data.data;
          $scope.steps = data.response;
        },
        function(err){
          console.log(err);
        }
      )

      $scope.add_step = function(a,b,c){
        $http.post(api_url+"/experience_step", {exp_id:a,name:b,desc:c}).then(
          function(data){
            console.log(data);
            data = data.data;
            $route.reload();
          },
          function(err){
            console.log(err);
          }
        )

      }
    })

    .controller("AttributeCtrl", function($scope, $http, $route){
      console.log("Inside attributes ctrl");
      $scope.att = {}
      $scope.in_gui = true;
      $scope.attributes = []
      $scope.reload_attributes = function(){
        $http.get(api_url+"/attributes").then(
          function(data){
            data = data.data;
            $scope.attributes = data.response;
          },
          function(err){
            console.log(err);
          }
        )
      }

      $scope.reload_attribute_labels = function(){
        $http.get(api_url+"/attribute_labels").then(
          function(data){
            data = data.data;
            $scope.attribute_labels = data.response;
          },
          function(err){
            console.log(err);
          }
        )
      }

      $scope.reload_attributes();
      $scope.reload_attribute_labels();

      $scope.add_attribute = function(){
        var keys = ["in_gui", "display_only", "legal_related","document_flag","p_flag","default_label"];
        for(var i=0; i<keys.length; i++){
          if($scope.att[keys[i]]){
            $scope.att[keys[i]] = 1;
          }else{
            $scope.att[keys[i]] = 0;
          }
        }
        var d = {name:$scope.att.name,data_type:$scope.att.data_type,desc:$scope.att.desc,source:$scope.att.source,in_gui:$scope.att.in_gui,display_only:$scope.att.display_only,
                legal_related:$scope.att.legal_related,document_flag:$scope.att.document_flag,
                p_flag:$scope.att.p_flag,default_label:$scope.att.default_label};
        $http.post(api_url+"/attributes", d).then(
          function(data){
            data = data.data;
            $scope.reload_attributes();
          },
          function(err){
            console.log(err);
          }
        )
        console.log(d);
      }

      $scope.add_attribute_labels = function(){
        if($scope.att.is_default){
          $scope.att.is_default = 1;
        }else {
          $scope.att.is_default = 0;
        }
        var d = {attribute_id:$scope.att.attribute_list,
          display_text:$scope.att.display_text,is_default:$scope.att.is_default}
        $http.post(api_url+"/attribute_labels", d).then(
          function(data){
            data = data.data;
            $scope.reload_attribute_labels();
          },
          function(err){
            console.log(err);
          }
        )
        console.log(d);
      }
    })
    .controller("DesignCtrl", function($scope, $http, $route){
      $scope.att = {};
      $scope.designs = [];
      $scope.experiance_steps  = [];
      $scope.design_details = [];

      $scope.reload_designs = function(){
        $http.get(api_url+"/designs").then(
          function(data){
            data = data.data;
            $scope.designs = data.response;
          },
          function(err){
            console.log(err);
          }
        )
      }

      $scope.exp_steps = function()
      {
        $http.get(api_url+"/cust_exp_steps").then(
          function(data){
            data = data.data;
            $scope.experiance_steps = data.response;
          },
          function(err){
            console.log(err);
          }
        )
      }

      $scope.design_details = function()
      {
        $http.get(api_url+"/design_details").then(
          function(data){
            data = data.data;
            $scope.design_details = data.response;
          },
          function(err){
            console.log(err);
          }
        )
      }

      $scope.exp_steps();
      $scope.design_details();
      $scope.reload_designs();
      // ,{headers :{'Access-Control-Allow-Credentials': 'true','Access-Control-Allow-Origin' : '*'}}

      $scope.add_design = function(designName,designURL,designDesc,experiance_step,parent_page,defaultDesign)
      {
        var experiance_id = 0;
        for(var i = 0 ; i < $scope.experiance_steps.length;i++)
        {
          if($scope.experiance_steps[i].exp_step_id == experiance_step)
          {
            experiance_id = $scope.experiance_steps[i].exp_id;
            break;
          }
        }

        if(typeof defaultDesign == 'undefined')
        {
          defaultDesign = false;
        }

        var d = {'designName':designName,'designURL':designURL,'designDesc':designDesc,
                'experiance_step':experiance_step,'experience_id':experiance_id,'parent_page':parent_page,
                'defaultDesign':defaultDesign};
                console.log(d);

        $http.post(api_url+"/design_details", d).then(
          function(data){
            data = data.data;
            $scope.reload_designs();
            console.log('success');
          },
          function(err){
            console.log(err);
          }
        )
        console.log(d);
      }

      $scope.delete_design = function(id)
      {
        console.log(id);
        var id_del = {'id':id};
        try {
          $http.post(api_url+"/design_details_del", id_del).then(
            function(data){
              console.log(data);
              data = data.data;
              console.log('success');
              $scope.reload_designs();
            },
            function(err){
              console.log(err);
            }
          )
        } catch (e) {
          console.log(e);
        } finally {

        }
      }

    })
    .controller("pageConfigCtrl", function($scope, $http, $route){
     $scope.design_percentage = {};
     $scope.design_data = {};
     $http.get(api_url+"/cust_exp_steps").then(
       function(data){
         data = data.data;
         console.log("experience steps",data);
         $scope.experience_steps = data.response;
       },
       function(err){
         console.log(err);
       }
     )

     $scope.add_ml = function(selected_step_name, start_date, end_date, ml_percen){
       console.log("ml data",selected_step_name, start_date.toISOString().slice(0,10), end_date.toISOString().slice(0,10), ml_percen)
       var d = {
         "experience_step_id":selected_step_name,
         "effective_from_date":start_date,
         "effective_end_date":end_date,
         "ml_limit":ml_percen
       }
       $http.post(api_url+"/ml_config", d).then(function(data){
         data = data.data;
         console.log("ml created",data);
         reload_ml();
       }, function(err){
         console.log(err);
       })
     }
     function reload_ml(){
       $http.get(api_url+"/ml_config").then(
         function(data){
           data = data.data;
           console.log("ml configs",data);
           $scope.ml_data = data.response;
         },
         function(err){
          console.log("error getting cust_exp",error);
         }
       )
     }
     reload_ml()
     $scope.loadDesign = function(data){
       console.log("selected design",data);
       $http.get(api_url+"/alastor_designs/"+data).then(
         function(data){
           data = data.data;
           console.log("ab designs",data);
           $scope.design_data = data.response;
         },
         function(err){
          console.log("error getting cust_exp",error);
         }
       )
     }
     $scope.add_ab_design = function(){
       console.log("design percentage",$scope.design_data);
       $http.post(api_url+"/ab_designs", $scope.design_data).then(
         function(data){
           data = data.data;
           console.log("ab design created",data);
           reload_ab_design();
         },
         function(err){
          console.log(err);
         }
       )
     }
     function reload_ab_design(){
       $http.get(api_url+"/ab_designs").then(
         function(data){
           data = data.data;
           console.log("ab design data",data);
           $scope.ab_design_data = data.response;
         },
         function(err){
          console.log("error getting cust_exp",error);
         }
       )
     }
     reload_ab_design()
   })
    .controller('Attribute_configCtrl', function($scope, $http, $route){
      console.log('Attribute_configCtrl');
      $scope.designs = [];
      $scope.attributes = [];
      $scope.all_attribute_labels = [];
      $scope.attribute_labels = [];
      $scope.attribute_design_label_details = [];

      $scope.attrDisabled = true;
      $scope.selectedDesignid = 0;
      $scope.selectedAttrId = 0;
      $scope.showAttrLbls = false;

      $scope.reload_designs = function(){
        $http.get(api_url+"/design_details").then(
          function(data){
            data = data.data;
            $scope.designs = data.response;
            console.log($scope.designs);
          },
          function(err){
            console.log("Error", error);
          }
        )
      }

      $scope.design_attributes = function(){
        $http.get(api_url+"/attributes").then(
          function(data){
            data = data.data;
            $scope.attributes = data.response;
            console.log($scope.attributes);
          },
          function(err){
            console.log("Error", error);
          }
        )
      }

      $scope.reload_attribute_labels = function(){
        $http.get(api_url+"/attribute_labels").then(
          function(data){
            data = data.data;
            $scope.all_attribute_labels = data.response;
          },
          function(err){
            console.log(err);
          }
        )
      }

      $scope.show_attribute_labels = function()
      {
        $http.get(api_url+"/ab_design_lbl_details").then(function(data){
          data = data.data;
          $scope.attribute_design_label_details = data.response;
          console.log($scope.attribute_design_label_details);
        },function(err){
          console.log(err);
        })
      }

      $scope.show_attribute_labels();
      $scope.reload_attribute_labels();
      $scope.design_attributes();
      $scope.reload_designs();

      $scope.enableAttributes = function(designId)
      {
        $scope.attrDisabled = false;
        $scope.selectedDesignid = designId;
        $scope.attribute_labels = [];
        console.log($scope.selectedDesignid);
      }



      $scope.showLabelfields = function(attributeId)
      {
        $scope.showAttrLbls = true;
        $scope.selectedAttrId = attributeId;
        $scope.attribute_labels = [];
        console.log($scope.selectedAttrId);
        console.log($scope.all_attribute_labels);

        for(var i =0 ; i < $scope.all_attribute_labels.length; i++)
        {
          if($scope.all_attribute_labels[i].attribute_id == attributeId)
          {
            $scope.attribute_labels.push($scope.all_attribute_labels[i]);
          }
        }
      }

      $scope.add_attribute_label = function(designId, attributeId, attrLabelDetails)
      {
        try {
            for(var i =0 ; i < attrLabelDetails.length; i++)
            {
              var attrlableDetails = {'designId':designId,'attributeId':attributeId, 'labelId':attrLabelDetails[i].id,
              'percentageValue':attrLabelDetails[i].percentageValue};
              console.log(attrlableDetails);
              $http.post(api_url+"/attribute_label_insert", attrlableDetails).then(
                function(data){
                  data = data.data;
                  $scope.show_attribute_labels();
                  console.log('success');
                },
                function(err){
                  console.log(err);
                }
              )
           }
         }
        catch (e)
        {
          console.log(e);
        }
      }
    })
    .controller("step1_ctrl", function($scope, $http, $route,$location,$window){
      $scope.move_to_policydetails = function()
      {
        $window.scrollTo(0, 0);
        $location.path('step2');
        //$window.location.reload();
      }
    })
    .controller("step2_ctrl", function($scope, $http, $route,$location,$window){
      $scope.move_to_your_beneficiary = function()
      {
        $window.scrollTo(0, 0);
        $location.path('step3');
        //$window.location.reload();
      }
    })
    .controller("step3_ctrl", function($scope, $http, $route,$location,$window){
      $scope.move_to_yourdetails = function()
      {
        $window.scrollTo(0, 0);
        $location.path('step4');
        //$window.location.reload();
      }
    })
    .controller("step4_ctrl", function($scope, $http, $route,$location,$window){
      $scope.move_to_your_health = function()
      {
          //console.log('step4_ctrl');
          $window.scrollTo(0, 0);
          $location.path('step5');
          //$window.location.reload();
      }
    })
    .controller("step5_ctrl", function($scope, $http, $route,$location,$window){
        //$route.reload();
        $scope.confirm = function(){
          $location.path("step6");
        }
    })
    .controller("step6_ctrl", function($scope, $http, $route,$location,$window){
        //$route.reload();
        $scope.success = function(){
          $location.path("success");
        }
    })

    .filter('default_design_flg_filter',function()
    {
        return function(value){
          if(value == 0){
            return 'No';
          }else{
            return 'Yes';
          }
        }
    })
    .service('body_mass_rules_service',function($http)
    {
        var body_mass_rules_info;
        return {
            getbody_mass_rules: getbody_mass_rules,
            setbody_mass_rules: setbody_mass_rules
        };
        function getbody_mass_rules() {
            return body_mass_rules_info;
        }
        function setbody_mass_rules(value) {
            body_mass_rules_info = value;
        }
    }).service('get_quote_price_service',function($http)
    {
        var get_quote_price_info;
        return {
          get_quote_price : get_quote_price,
          set_quote_price : set_quote_price
        };
        function get_quote_price()
        {
          return get_quote_price_info;
        }
        function set_quote_price(value)
        {
          get_quote_price_info = value;
        }
    })

    // emily add
    .controller('customer_home_ctrl',function($scope, $http, $route,$location,$window){

      try {
        var para={"login_id":101};
        $http.post(api_url+"/customer_home",para)
         .then(
           function(data){
             console.log('success');
             $scope.all = data.data.response;
             console.log("id: "+$scope.all.policy_id)
             $scope.policy_id=$scope.all.policy_id
             $scope.first_name=$scope.all.first_name
             $scope.middle_name=$scope.all.middle_name
             $scope.last_name=$scope.all.last_name
             $scope.name=$scope.first_name+" "+$scope.middle_name+" "+$scope.last_name
             $scope.policy_no=$scope.all.policy_no
             $scope.coverage=$scope.all.coverage
             $scope.modal_premium=$scope.all.modal_premium
             $scope.payment_frequency=$scope.all.payment_frequency
             $scope.last_payment_date=moment($scope.all.last_payment_date).format('L')
             $scope.payment_amt=$scope.all.payment_amt
             $scope.effective_policy_date=moment($scope.all.effective_policy_date).format('L')
             $scope.end_policy_date=moment($scope.all.end_policy_date).format('L')
             $scope.paid_up_to_date=moment($scope.all.paid_up_to_date).format('L')
            $scope.next_payment_date='123'
             // switch($scope.payment_frequency){
             //  case'monthly':
             //        $Scope.next_payment_date=$scope.last_payment_date
             //        break;
             //       // $scope.next_payment_date=moment($scope.all.last_payment_date).format('L');
             //  case'quarterly':
             //       $scope.next_payment_date=moment($scope.last_payment_date).add(3,'months');
             //       break;
             //  case'biannually':
             //       $scope.next_payment_date=moment($scope.last_payment_date).add(6,'months');
             //       break;
             //  case'annually':
             //       $scope.next_payment_date=moment($scope.last_payment_date).add(1,'year');
             //       break;
             //   default:
             //       " ";
             //}


           },
           function(err){
             console.log(err);
           }
         )
       }
       catch(e){
        console.log(e);
       }
    })
    .controller('customer_policy_ctrl', function($scope, $http, $route,$location,$window){
              // $scope.coverage='$'+100;
        var po=123456789;
        para={"po":po}
        $http.post(api_url+"/get_policy",para).then(
          function(data){
            console.log('success');
            $scope.policy_all = data.response;
            console.log($scope.policy_all.coverage)
            $scope.coverage='$'+$scope.policy_all.coverage
          },
          function(err){
            console.log(err);
          }
        )
    })
    .controller("customer_bill_ctrl", function($scope, $http, $route,$location,$window){

    })
    .controller("customer_doc_ctrl", function($scope, $http, $route,$location,$window){

    })

    .controller("cust1_ctrl", function($scope, $http, $route,$location,$window){

    })
    .controller("cust2_ctrl", function($scope, $http, $route,$location,$window){


    })
    .controller("AboutController", function($scope, $http, $location, $window,state_ddl_data){
      //state drop down list data.
      $scope.p = {phones:{}};
      $scope.selected_premium_amount = sessionStorage.coverage_total_premium_amount;
      $scope.seleted_premium_span = sessionStorage.premium_span;
      // var u = $scope.p;


      $scope.state_ddl =  state_ddl_data.myFunc();


      $scope.p.honest = true;
      $scope.p.city = "";
      $scope.p.state = "";
      $scope.p.zip_code = "";
      var api_keys = [
          "honesty_1","honesty_2","application_status","title",
          "first_name","middle_name","last_name","gender","dob",
          "birth_state","addr1_street_name","addr1_city","addr1_state",
          "addr1_zip","addr2_street_name","addr2_city","addr2_state","addr2_zip",
          "home_phone1","work_phone1","mobile_phone1","home_phone2","work_phone2",
          "mobile_phone2","email","ssn","drivers_license_no","drivers_license_state"];

      $scope.p.addresses = [];
      $scope.p.phones = {home_phone:[],work_phone:[], mobile_phone:[]};
      $scope.p.display_phones = {};
      $http.get(api_url+"/about_you?fp="+fingerprint).then(
        function(data){
          d = data.data;
          if(d.status == 0){
            console.log("No items found");
          }
          else{
            try{
              d = d.response;
              $scope.p.honest = d.honesty_2;
              $scope.p.firstname = d.first_name
              $scope.p.middlename = d.middle_name;
              $scope.p.lastname = d.last_name;
              $scope.p.gender = d.gender;
              $scope.p.pob = d.birth_state;
              $scope.p.dob = d.dob;
              $scope.p.email = d.email;
              $scope.p.drivers_license = d.drivers_license_no;
              $scope.p.state_issued = d.drivers_license_state;
              $scope.p.ssn = d.ssn;
              var addr1 = {};
              var addr2 = {};
              var mobile = [];
              var work = [];
              var home = [];
              console.log($scope.p.phones);
              try{
                if(d.home_phone1 !== null){
                  home.push(d.home_phone1)
                }
                if(d.home_phone2 !== null){
                  home.push(d.home_phone1)
                }
                if(d.work_phone1 !== null){
                  work.push(d.work_phone1)
                }
                if(d.work_phone2 !== null){
                  work.push(d.work_phone1)
                }

                if(d.mobile_phone1 !== null){
                  mobile.push(d.mobile_phone1)
                }
                if(d.mobile_phone2 !== null){
                  mobile.push(d.mobile_phone2)
                }
              }catch(err){
                console.log(err);
              }
              $scope.p.phones.home_phone = home;
              $scope.p.phones.work_phone = work;
              $scope.p.phones.mobile = mobile;

              for(var key in $scope.p.phones){
                console.log("Key -> "+key);
                if($scope.p.phones[key].length > 0){
                  $scope.p.display_phones[key] = $scope.p.phones[key].join("  ,  ")
                }
              }

              if(d.addr1_street_name !== null){
                addr1.street_address = d.addr1_street_name;
              }
              if(d.addr2_street_name !== null){
                addr2.street_address = d.addr2_street_name;
              }
              if(d.addr1_city !== null){
                addr1.city = d.addr1_city;
              }
              if(d.addr2_city !== null){
                addr2.city = d.addr2_city;
              }
              if(d.addr1_state !== null){
                addr1.state = d.addr1_state;
              }
              if(d.addr2_state !== null){
                addr2.state = d.addr2_state;
              }
              if(d.addr1_zip !== null){
                addr1.zip_code = d.addr1_zip;
              }
              if(d.addr2_zip !== null){
                addr2.zip_code = d.addr2_zip;
              }
              var p_d = moment(d.dob).format("MM-DD-YYYY");
              $scope.p.dob = p_d;
              console.log(Object.keys(addr1));
              console.log(Object.keys(addr2));
              if(Object.keys(addr1).length > 0){
                $scope.p.addresses.push(addr1);
              }
              if(Object.keys(addr2).length > 0){
                $scope.p.addresses.push(addr2);
              }
            }
            catch(error){
              console.log(err);
            }

          }
        },
        function(err){
          console.log("errorl loading");
        }
      );
      $scope.setChoice = function(val){
        $scope.p.number_type = val;
      }
      if($.cookie("email") === undefined){
        $scope.auth = false;
      }
      else{
        $scope.auth = true;
        $scope.uname = $.cookie("fname");
      }
      $scope.next = function(){

        if($scope.p.phone_number != '')
        {
            $scope.p.phones[$scope.p.number_type].push($scope.p.phone_number);
        }
        sessionStorage.cusomer_first_name = $scope.p.firstname;
        sessionStorage.cusomer_last_name = $scope.p.lastname;
        var t = $scope.p;
        var params = {first_name:t.firstname, middle_name: t.middlename, last_name : t.lastname,
                      dob:t.dob, birth_state:t.pob, gender: t.gender, email: t.email,
                      drivers_license_no : t.drivers_license, drivers_license_state: t.state_issued,
                      ssn: t.ssn, home_phone1:"",home_phone2:"",work_phone2:"", Work2:"",mobile_phone2:"",Mobile2:""
                    };
        params.honesty_1 = 1;
        params.honesty_2 = 1;
        if(t.honest === false){
          params.honesty_2 = 0
        }
        /*
        "addr1_street_name","addr1_city","addr1_state",
        "addr1_zip","addr2_street_name","addr2_city","addr2_state","addr2_zip"
        */
        for(var j=0; j< 2; j++){
          try{
            console.log($scope.p.addresses[j]);
            var i = j+1;
            params["addr"+i+"_street_name"] = $scope.p.addresses[j].street_address;
            params["addr"+i+"_city"] = $scope.p.addresses[j].city;
            params["addr"+i+"_state"] = $scope.p.addresses[j].state;
            params["addr"+i+"_zip"] = $scope.p.addresses[j].zip_code;
          }catch(err){
            console.log("Access error");
          }
        }
        params.address  = $scope.p.addresses;
        for(var key in $scope.p.phones){
          for(var count=0; count<2; count++){
            try{
              var c1 = count+1;
              params[key+c1.toString()] = $scope.p.phones[key][count];
            }catch(err){
              console.log(err);
            }
          }
        }

        //Add Addr1 & Addr2
        console.log(params);
        params.user = $.cookie("user");
        $http.post(api_url+"/about_you", {attributes:params, fp:fingerprint}).then(
          function(data){
            console.log(data.data);
            $location.path("/your_health");
          },function(err){
            console.log(err);
          }
        )
      }
      $scope.back = function(){
        $window.history.back();
      }

      $scope.add_address = function(){
        if($scope.p.addresses.length > 2){
          alert("Cannot add more than 2 addresses");
          return;
        }
        $scope.p.addresses.push({city:$scope.p.city, state:$scope.p.state, zip_code:$scope.p.zip_code, street_address:$scope.p.street_address});
        $scope.p.city = "";
        $scope.p.state = "";
        $scope.p.zip_code = "";
        $scope.p.street_address = "";
        console.log($scope.p.addresses);

      }
      $scope.remove_address = function(id){
        $scope.p.addresses.splice(id, 1);
      }

      $scope.add_phone = function(){
        console.log();
        if($scope.p.phones[$scope.p.number_type].length == 2){
          alert("Restricted to only two numbers");
          return;
        }
        if($scope.p.phones[$scope.p.number_type].length == 0){
          $scope.p.phones[$scope.p.number_type] = [$scope.p.phone_number];
        }else{
          $scope.p.phones[$scope.p.number_type].push($scope.p.phone_number);
        }
        console.log($scope.p.phones);
        for(var key in $scope.p.phones){
          console.log("Key -> "+key);
          if($scope.p.phones[key].length > 0){
            $scope.p.display_phones[key] = $scope.p.phones[key].join("  ,  ")
          }
        }
        $scope.p.phone_number = '';
        $scope.work_phone = false;
        $scope.home_phone = false;
        $scope.mobile_phone = false;
      }
    })
    .controller("HealthController", function($scope, $http, $location, $window){
      $scope.selected_premium_amount = sessionStorage.coverage_total_premium_amount;
      $scope.seleted_premium_span = sessionStorage.premium_span;
      //$('input[name=interview]')
      $scope.p={};
      $scope.prev = function(){
        $location.path("/about_you");
      }
      $scope.next = function(){
        //console.log($scope.p.questions);
        var answers = {};
        for(var key in $scope.p.questions){
          var obj = document.getElementById(key);
          var elements = document.getElementsByName(key);

          //console.log(key);
          //console.log(obj);
          if(obj !== undefined && obj !== null){
            //console.log(obj);
            console.log(obj.value);
            answers[key] = obj.value;
          }else if ( elements !== null && elements !== undefined) {
            answers[key] = {};
            if(elements.length > 3){
              for(var i=0; i< elements.length; i++){
                if(elements[i].checked === true){
                  answers[key][elements[i].value] = 1;
                }else{
                  answers[key][elements[i].value] = 0;
                }
              }
            }
            else if(elements.length <= 3){
              answers[key] = {};
              for(var i=0; i< elements.length; i++){
                if(elements[i].checked === true){
                  console.log(i+"-->"+elements[i].value);
                  answers[key][elements[i].value] = 1;
                }
              }
            }
          }
        }
        console.log("Answers are");
        console.log(answers);
        $http.post(api_url+"/answers", {application_id:$.cookie("application_id"), answers:answers})
        .then(
          function(data){
            data = data.data;
            console.log(data);
            $location.path("beneficiary");
          },function(err){
            console.log("Error -->");
            console.log(err);
          }
        )
        //$location.path("beneficiary");
      }
      $scope.prev = function(){
        $location.path("about_you");
      }
      $http.get(api_url+"/question").then(
        function(data){
          console.log(data.data);
          $scope.p.questions = data.data.response;
          $http.get(api_url+"/sub_question").then(
            function(data){
              console.log("Sub question response");
              $scope.p.sub_questions = data.data.response;
              console.log($scope.p.sub_questions);
              for(var key in $scope.p.sub_questions){
                var val = $scope.p.sub_questions[key];
                //console.log(val);
                var tmp_val = {ans:val};
                if(val.length == 2){
                  tmp_val.type = "bool";
                }
                else if (val.length == 3) {
                  tmp_val.type = "ternary";
                }
                else if (val.length == 0) {
                  tmp_val.type = "open";
                }
                else{
                  tmp_val.type = "multiple";
                  tmp_val.even_ans = [];
                  tmp_val.odd_ans = [];
                  for(var x=0; x<val.length; x++){
                    if(x %2 == 0){
                      tmp_val.even_ans.push(val[x])
                    }else{
                      tmp_val.odd_ans.push(val[x])
                    }
                  }
                }
                console.log(tmp_val);
                $scope.p.sub_questions[key] = tmp_val;
              }
              for(var prop in $scope.p.questions){
                if(!(prop in $scope.p.sub_questions)){
                  $scope.p.sub_questions[prop] = {"type":"open"};
                }
              }
              console.log($scope.p.sub_questions);
            },
            function(err){
              console.log(err);
            }
          )
        },
        function(err){
          console.log(err);
        }
      )
    })

    .controller('BeneficiaryController', function($scope, $http, $location){

      $scope.selected_premium_amount = sessionStorage.coverage_total_premium_amount;
      $scope.seleted_premium_span = sessionStorage.premium_span;

      $scope.p = {};
      $scope.p1 = {};
      $scope.p2 = {};
      $scope.p.beneficiaries = [];
      $scope.p.con_beneficiaries = [];
      $scope.add_ben = function(con_ben){
        console.log("Inside Add Ben");
        if(con_ben == 0){
          var ben = {firstname: $scope.p.firstname, middlename: $scope.p.middlename,
                    lastname : $scope.p.lastname, dob: $scope.p.dob, relation: $scope.p.relation,
                    con_ben : con_ben};
          $scope.p.firstname = "";
          $scope.p.middlename = "";
          $scope.p.lastname = "";
          $scope.p.dob = "";
          $scope.p.relation = "";
          console.log(ben);
          $scope.p.beneficiaries.push(ben);
        }
        else{
          var ben = {firstname: $scope.p.c_firstname, middlename: $scope.p.c_middlename,
                    lastname : $scope.p.c_lastname, dob: $scope.p.c_dob, relation: $scope.p.c_relation,
                    con_ben : con_ben};

          $scope.p.c_firstname = "";
          $scope.p.c_middlename = "";
          $scope.p.c_lastname = "";
          $scope.p.c_dob = "";
          $scope.p.c_relation = "";
          console.log(ben);
          $scope.p.con_beneficiaries.push(ben);
        }
      }


      $scope.next = function(){
        if($scope.p.firstname.trim() != '')
        {
          var ben = {firstname: $scope.p.firstname, middlename: $scope.p.middlename,
                    lastname : $scope.p.lastname, dob: $scope.p.dob, relation: $scope.p.relation,
                    con_ben : 0};
          $scope.p.beneficiaries.push(ben);
        }
        if($scope.p.c_firstname.trim() != '')
        {
          var ben = {firstname: $scope.p.c_firstname, middlename: $scope.p.c_middlename,
                    lastname : $scope.p.c_lastname, dob: $scope.p.c_dob, relation: $scope.p.c_relation,
                    con_ben : 1};
          $scope.p.con_beneficiaries.push(ben);
        }

        for(var i=0; i<$scope.p.beneficiaries.length; i++){
          var percentage = $scope.p1[i];
          console.log(percentage);
          $scope.p.beneficiaries[i].percentage = percentage;
        }
        for(var i=0; i<$scope.p.con_beneficiaries.length; i++){
          var percentage = $scope.p2[i];
          console.log(percentage);
          $scope.p.con_beneficiaries[i].percentage = percentage;
        }
        console.log($scope.p.beneficiaries);
        console.log($scope.p.con_beneficiaries);

        var data = $scope.p.beneficiaries;
        data = data.concat($scope.p.con_beneficiaries);
        $http.post(api_url+"/beneficiary", {params:data}).then(function(data){
          $location.path("confirm");
        }, function(err){
          console.log(err);
        });

      }

      /*$scope.next = function(){
        $location.path("confirm");
      }*/
      $scope.prev = function(){
        $location.path("your_health");
      }
      console.log($scope.p.con_beneficiaries);
    })
    .controller('ConfirmController', function($scope, $http, $location){
      $scope.firstName = sessionStorage.cusomer_first_name;
      $scope.lastName = sessionStorage.cusomer_last_name;
      $scope.monthlyPremiumAmount = sessionStorage.coverage_monthly_premium_amount;
      $scope.premium_span = sessionStorage.premium_span;
      $scope.total_premium_amount = sessionStorage.coverage_total_premium_amount;

      $scope.next = function(){
        $location.path("customer_home");
      }
      $scope.prev = function(){
        $location.path("beneficiary");
      }
    })
})();
