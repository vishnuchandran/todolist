angular.module("todolist", ['ngRoute', 'ngMaterial'])
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
    .controller('dataController',function(listall,$http,$scope,$location,$mdDialog){
        var check ;
        $scope.todo = function(){  
                $http.post('/insertdata', $scope.user)
                    .success(function(response){
                        $scope.list = response;
                        $scope.user.task = null;
                        $scope.user.taskTitle = null;   
                    })
                    .error(function(response){
                        alert(response)
                    })
            
        }
        // $scope.updatenote.$setUntouched();
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
        $scope.onclick = false;
        $scope.expand = function(){
            $scope.onclick = true;
        }


        $scope.delete = function($index){
            $http.post('/delete',$scope.list[$index])
                .success(function(response){
                        $scope.list = response;
                        $scope.user.task = null;
                        $scope.user.taskTitle = null;   
                    })
                    .error(function(response){
                        alert(response)
                    })

        }

        $scope.edit = function($event,data,$index) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show({
                locals:{name:data,
                        index : $index},
                controller: ['$scope','name','index',function($scope,name,index){
                    $scope.user1 = name;
                    $scope.user1.index = index;
                    $scope.todo1 = function(){
                        $http.post('/edit',$scope.user1)
                        .success(function(response){
                            $scope.list = response.data;
                            $mdDialog.hide(); 
                      
                    })
                    .error(function(response){
                        $mdDialog.hide(response);
                    })
                    
                    }  
                }],
                templateUrl: 'popup.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                clickOutsideToClose:true,
            // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        }

        
            

        // $scope.checkIfEnterKeyWasPressed = function($event){
        //     var keyCode = $event.which || $event.keyCode;
        //     if (keyCode === 13) {
        //         check = false;
                
        //         }
        //     else {
        //         check = true;
        //     }
        //     }

    //     $scope.colorCodeArray = [
    //      "#339E42",
    //      "#039BE5",
    //      "#EF6C00",
    //      "#A1887F",
    //      "#607D8B",
    //      "#039BE5",
    //      "#009688",
    // ];
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






