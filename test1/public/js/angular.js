angular.module("todolist", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "login.html"
                
            })
            .when("/new", {
                templateUrl: "create.html",
                controller : "newUser"
                
            })
            .when("/user",{
            	templateUrl : "mypage.html"
            })

    })

    .controller('newUser',function($scope,$http,$location){
    	$scope.save = function() {
            $http.post("/register", $scope.user).
                success(function(response) {
                    $scope.check = true
                    $scope.test = response[0]['msg']
                    $location.path('/user')
                }).error(function(response) {
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
                });
    }
})






