//var host = "http://localhost:7000";
var host = "http://10.0.0.26:7000";
var api_url = host+"/api/v1";
angular
  .module('boilerplate')
  .config(config)
  .controller('QuestionController', ["$scope", "$http", function($scope, $http){
    $scope.v = {show_id:-999};
     console.log("Inside Question Controller");
     $scope.reload_question = function(){
       $http.get(api_url+"/question").then(
         function(data){
           console.log(data);
           $scope.v.q = data.data.response;
           console.log($scope.v.q);
         },
         function(err){
          console.log("Failed to load attributes");
         }
       )
     }

     $scope.reload_sub_question = function(){
       $http.get(api_url+"/sub_question").then(
         function(data){
           console.log(data.data);
           $scope.v.s_q = data.data.response;
           console.log($scope.v.s_q);
         },
         function(err){
           console.log("Failed to load attributes");
         }
       )
     }

     $scope.open = function (i) {
       $scope.v.show_id = i;
       console.log('opening pop up');
     }
     $scope.save = function (id, answer, type) {
       console.log(id);
       console.log(answer);
       console.log(type);
       $scope.v.show_id = -99;
       $http.post(api_url+"/sub_question", {"question_id":id,"text":answer,"type":type}).then(
         function(data){
           console.log(data);
           console.log("received Data");
           $scope.reload_sub_question();
         },
         function(err){
           alert("Failed to add");
         }
       )
     }


     $scope.reload_question();
     $scope.reload_sub_question();
      $scope.add = function(){
        console.log($scope.v);
        var params = {sequence: $scope.v.sequence, question_text: $scope.v.question,
                      type:$scope.v.type, values: $scope.v.values, parent_id: $scope.v.parent_id,
                      parent_answer : $scope.v.parent_answer}
        console.log(params);
        $http.post(api_url+"/question", params).then(
          function(data){
            $scope.reload_question();
          },
          function(err){
            alert("Failed to add question");
          }
        )
      }


   }])



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
       .when('/admin/questions', {
         templateUrl: 'views/admin/questions.html',
         controller: 'QuestionController',
         controllerAs: 'main'
       })
   }
