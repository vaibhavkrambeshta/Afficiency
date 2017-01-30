/**
 *
 * AngularJS Boilerplate
 * @description           Description
 * @author                Jozef Butko // www.jozefbutko.com/resume
 * @url                   www.jozefbutko.com
 * @version               1.1.7
 * @date                  March 2015
 * @license               MIT
 *
 */
;(function() {


  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('boilerplate', [
      'ngRoute',
      'ngCookies',
      'ui.bootstrap',
      'uiSwitch',
      'rzModule',
      'ui.bootstrap.modal',
      '720kb.datepicker'
    ]).service('state_ddl_data', function() {

    this.myFunc = function () {
          var state_list = [];
          state_list.push({'state':"Alabama"});
          state_list.push({'state':"Alaska"});
          state_list.push({'state':"Arizona"});
          state_list.push({'state':"Arkansas"});
          state_list.push({'state':"California"});
          state_list.push({'state':"Colorado"});
          state_list.push({'state':"Connecticut"});
          state_list.push({'state':"Delaware"});
          state_list.push({'state':"Florida"});
          state_list.push({'state':"Georgia"});
          state_list.push({'state':"Hawaii"});
          state_list.push({'state':"Idaho"});
          state_list.push({'state':"IllinoisIndiana"});
          state_list.push({'state':"Iowa"});
          state_list.push({'state':"Kansas"});
          state_list.push({'state':"Kentucky"});
          state_list.push({'state':"Louisiana"});
          state_list.push({'state':"Maine"});
          state_list.push({'state':"Maryland"});
          state_list.push({'state':"Massachusetts"});
          state_list.push({'state':"Michigan"});
          state_list.push({'state':"Minnesota"});
          state_list.push({'state':"Mississippi"});
          state_list.push({'state':"Missouri"});
          state_list.push({'state':"MontanaNebraska"});
          state_list.push({'state':"Nevada"});
          state_list.push({'state':"NewHampshire"});
          state_list.push({'state':"NewJersey"});
          state_list.push({'state':"NewMexico"});
          state_list.push({'state':"NewYork"});
          state_list.push({'state':"NorthCarolina"});
          state_list.push({'state':"NorthDakota"});
          state_list.push({'state':"Ohio"});
          state_list.push({'state':"Oklahoma"});
          state_list.push({'state':"Oregon"});
          state_list.push({'state':"PennsylvaniaRhodeIsland"});
          state_list.push({'state':"SouthCarolina"});
          state_list.push({'state':"SouthDakota"});
          state_list.push({'state':"Tennessee"});
          state_list.push({'state':"Texas"});
          state_list.push({'state':"Utah"});
          state_list.push({'state':"Vermont"});
          state_list.push({'state':"Virginia"});
          state_list.push({'state':"Washington"});
          state_list.push({'state':"WestVirginia"});
          state_list.push({'state':"Wisconsin"});
          state_list.push({'state':"Wyoming"});

        return state_list;
        }
    }).config(config);

  // safe dependency injection
  // this prevents minification issues
  config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider'];

  /**
   * App routing
   *
   * You can leave it here in the config section or take it out
   * into separate file
   *
   */
  function config($routeProvider, $locationProvider, $httpProvider, $compileProvider) {

    $locationProvider.html5Mode(false);

    // routes
    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/signup', {
        templateUrl: 'views/login_signup/register.html',
        controller: 'SignupController',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login_signup/login.html',
        controller: 'LoginController',
        controllerAs: 'main'
      })
      .when('/home1', {
        templateUrl: 'views/home_page/design1.html',
        controller: 'HomeController1',
        controllerAs: 'main'
      })
      .when('/home2', {
        templateUrl: 'views/home_page/design2.html',
        //templateUrl: 'views/home_page/quotation1.html',
        controller: 'HomeController2',
        controllerAs: 'main'
      })
      .when('/home3', {
        templateUrl: 'views/home_page/design3.html',
        //templateUrl: 'views/home_page/quotation2.html',
        controller: 'HomeController3',
        controllerAs: 'main'
      })
      .when('/home4', {
        templateUrl: 'views/home_page/design4.html',
        controller: 'HomeController4',
        controllerAs: 'main'
      })
      .when('/home5', {
        templateUrl: 'views/home_page/design5.html',
        controller: 'HomeController5',
        controllerAs: 'main'
      })
      .when('/home6', {
        templateUrl: 'views/home_page/design6.html',
        //templateUrl: 'views/home_page/quotation2.html',
        controller: 'HomeController6',
        controllerAs: 'main'
      })
      .when('/personal_info1', {
        //templateUrl: 'views/home_page/design6.html',
        templateUrl: 'views/home_page/design1.html',
        controller: 'PIController1',
        controllerAs: 'main'
      })
      .when('/personal_info2', {
        //templateUrl: 'views/home_page/design6.html',
        templateUrl: 'views/home_page/design2.html',
        controller: 'PIController2',
        controllerAs: 'main'
      })
      .when('/personal_info3', {
        //templateUrl: 'views/home_page/design6.html',
        templateUrl: 'views/home_page/design3.html',
        controller: 'PIController3',
        controllerAs: 'main'
      })
      .when('/personal_info4', {
        //templateUrl: 'views/home_page/design6.html',
        templateUrl: 'views/home_page/design4.html',
        controller: 'PIController4',
        controllerAs: 'main'
      })
      .when('/personal_info5', {
        //templateUrl: 'views/home_page/design6.html',
        templateUrl: 'views/home_page/design5.html',
        controller: 'PIController5',
        controllerAs: 'main'
      })
      .when('/personal_info6', {
        //templateUrl: 'views/home_page/design6.html',
        templateUrl: 'views/home_page/design6.html',
        controller: 'PIController6',
        controllerAs: 'main'
      })
      .when('/admin', {
        templateUrl: 'views/setup.html',
        controller: 'SetupController',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login_signup/login.html',
        controller: 'LoginController',
        controllerAs: 'main'
      })
      .when('/experience', {
        templateUrl: 'views/admin/experience.html',
        controller: 'AdminController',
        controllerAs: 'main'
      })
      .when('/attributes', {
        templateUrl: 'views/admin/attributes.html',
        controller: 'AttributeCtrl',
        controllerAs: 'main'
      })
      .when('/designs', {
        templateUrl: 'views/admin/designs.html',
        controller: 'DesignCtrl',
        controllerAs: 'main'
      })
      .when('/page-config', {
        templateUrl: 'views/admin/page-config.html',
        controller: 'pageConfigCtrl',
        controllerAs: 'main'
      })
      .when('/attribute_config', {
        templateUrl: 'views/admin/attribute_config.html',
        controller: 'Attribute_configCtrl',
        controllerAs: 'main'
      })
      .when('/quote_page_one/:param1', {
        templateUrl: 'views/home_page/quotation1.html',
        controller: 'quote_one_Ctrl',
        controllerAs: 'main'
      })
      .when('/quote_page_two/:param1', {
        templateUrl: 'views/home_page/quotation2.html',
        controller: 'quote_two_Ctrl',
        controllerAs: 'main'
      })
      .when('/buy_now', {
        templateUrl: 'views/registration_forms/step1.html',
        controller: 'step1_ctrl',
        controllerAs: 'main'
      })
      .when('/step2', {
        templateUrl: 'views/registration_forms/step2.html',
        controller: 'step2_ctrl',
        controllerAs: 'main'
      })
      .when('/step3', {
        templateUrl: 'views/registration_forms/step3.html',
        controller: 'step3_ctrl',
        controllerAs: 'main'
      })
      .when('/step4', {
        templateUrl: 'views/registration_forms/step4.html',
        controller: 'step4_ctrl',
        controllerAs: 'main'
      })
      .when('/step5', {
        templateUrl: 'views/registration_forms/step5.html',
        controller: 'step5_ctrl',
        controllerAs: 'main'
      })
      .when('/step6', {
        templateUrl: 'views/registration_forms/step6.html',
        controller: 'step6_ctrl',
        controllerAs: 'main'
      })
      .when('/success', {
        templateUrl: 'views/registration_forms/success.html',
        controller: 'step6_ctrl',
        controllerAs: 'main'
      })
      .when('/customer_home', {
        templateUrl: 'views/customer_service/customer_home.html',
        controller: 'customer_home_ctrl',
        controllerAs: 'main'
      })
      .when('/customer_policy', {
        templateUrl: 'views/customer_service/customer_policy.html',
        controller: 'customer_policy_ctrl',
        controllerAs: 'main'
      })
      .when('/customer_bill', {
        templateUrl: 'views/customer_service/customer_bill.html',
        controller: 'customer_bill_ctrl',
        controllerAs: 'main'
      })
      .when('/customer_doc', {
        templateUrl: 'views/customer_service/customer_doc.html',
        controller: 'customer_doc_ctrl',

        controllerAs: 'main'
      })
      .when('/about_you', {
        templateUrl: 'views/home_page/about-you.html',
        controllerAs: 'main',
        controller: 'AboutController',
      })
      .when('/your_health', {
        templateUrl: 'views/home_page/your-health.html',
        controllerAs: 'main',
        controller: 'HealthController'

        //controller: 'cust2_ctrl',

      })
      .when('/beneficiary', {
        templateUrl: 'views/home_page/beneficiary.html',
        controllerAs: 'main',
        controller: 'BeneficiaryController'
        //controller: 'cust2_ctrl',
      })
      .when('/confirm', {
        templateUrl: 'views/home_page/confirm.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/admin_home', {
        templateUrl: 'views/admin/admin_home.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/experience_page', {
        templateUrl: 'views/admin/experience_page.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/experience_step', {
        templateUrl: 'views/admin/experience_step.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/global_attributes', {
        templateUrl: 'views/admin/global_attributes.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/attribute_label', {
        templateUrl: 'views/admin/attribute_label.html',
        controller: 'AttributeCtrl',
        controllerAs: 'main'
      })
      .when('/personalization', {
        templateUrl: 'views/admin/personalization.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/personal-page', {
        templateUrl: 'views/admin/personal_page.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/personal-page-2', {
        templateUrl: 'views/admin/personal_page_2.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/personal-label', {
        templateUrl: 'views/admin/personal_label.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
      .when('/personal-label-2', {
        templateUrl: 'views/admin/personal_label_2.html',
        controllerAs: 'main',
        controller: 'ConfirmController'
        //controller: 'cust2_ctrl',
      })
        .when('/policy_success', {
            templateUrl: 'views/registration_forms/policy_success.html',
            controllerAs: 'main'
            //controller: 'cust2_ctrl',
        })
        .when('/declaration', {
            templateUrl: 'views/registration_forms/declaration.html',
            controllerAs: 'main'
        })

      .otherwise({
        redirectTo: '/'
      });
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');

  }


  /**
   * You can intercept any request or response inside authInterceptor
   * or handle what should happend on 40x, 50x errors
   *
   */
  angular
    .module('boilerplate')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$rootScope', '$q', 'LocalStorage', '$location'];

  function authInterceptor($rootScope, $q, LocalStorage, $location) {

    return {

      // intercept every request
      request: function(config) {
        config.headers = config.headers || {};
        return config;
      },

      // Catch 404 errors
      responseError: function(response) {
        if (response.status === 404) {
          $location.path('/');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  }


  /**
   * Run block
   */
  angular
    .module('boilerplate')
    .run(run);

  run.$inject = ['$rootScope', '$location'];

  function run($rootScope, $location) {
    // put here everything that you need to run on page load

  }
})();
