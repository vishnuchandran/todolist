angular.module("todolist", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                
                templateUrl: "login.html",
                controller : "loginController"
                

                
            })
            .when("/new", {
                templateUrl: "create.html",
                controller : "newUser"
                
            })
            .when("/user",{
            	templateUrl : "mypage.html",
                controller : "dataController",
                resolve : {
                    listall : function(tasks){
                        return tasks.getdata();
                    }

                }
            })

    })

    .controller('newUser',function($scope,$http,$location){
    	$scope.save = function() {
            $http.post("/register", $scope.user)
                .success(function(response) {
                    $location.path('/user')
                })
                .error(function(response) {
                    var length = response.length;
                    var errors = [length]
                    for (var i = 0; i<length; i++) {
                        var err = response[i]
                        var msg;
                        for(var key in err) {
                            if(key == 'msg') {
                                msg = err[key];
                                errors[i] = msg;
                        }
                    }

                    }
                    $scope.errors = errors;
                })
    }
})
    .controller('loginController',function($scope,$http,$location){
        $scope.passmein = function(){
            $http.post('/login',$scope.user1)
                .success(function(response){
                     $location.path('/user')
                 })
                .error(function(response){
                    var length = response.length;
                    var errors = [length]
                    for (var i = 0; i<length; i++) {
                        var err = response[i]
                        var msg;
                        for(var key in err) {
                            if(key == 'msg') {
                                msg = err[key];
                                errors[i] = msg;
                        }
                    }

                    }
                    $scope.errors = errors;
                    
                })
        }

    })
    .controller('dataController',function(listall,$http,$scope,$location){
        $scope.todo = function(){
            $http.post('/insertdata',$scope.user)
                .success(function(response){
                    
                })
                .error(function(response){
                    alert(response)
                })
        }
        $scope.list = listall.data
        $scope.logout = function(){
            $http.post('/logout')
                .success(function(response){
                    $location.path('/')
                })
                .error(function(response){
                    alert(response)
                })
        }
        $scope.colorCodeArray = [
         "#339E42",
         "#039BE5",
         "#EF6C00",
         "#A1887F",
         "#607D8B",
         "#039BE5",
         "#009688",
    ];
    })
    .service("tasks", function($http) {
        this.getdata = function() {
            return $http.get("/displaylist")
                .then(function(response) {
                    return response;
                }, function(response) {
                    //alert("Error finding ");
                });
        }
    })






