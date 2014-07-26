angular
	.module('app',['ngRoute'])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.when('/home',{
			templateUrl: 'views/home.html'
		});
		$routeProvider.when('/login',{
			templateUrl: 'views/login.html'
		});
		$routeProvider.when('/profile',{
			templateUrl: 'views/profile.html'
		});
		$routeProvider.otherwise({redirectTo:'/home'});
	}])
	.directive('egNavigation',['$location',function($location){
		return {
			restrict: 'A',
			link: function (scope,element,attributes) {
				scope.$on('$locationChangeSuccess',function(){
					var children = element.children()
					children.find('a').parent().removeClass('active');
					children.find('a[href="#'+$location.path()+'"]').parent().addClass('active');
				});
			}
		};
	}])
	.service('UsersService',['$q','$http',function($q,$http){
		var service = {};
		service.login = login;
		return service;
		function login (user) {
			return $http({method:'post',url:'/login',data:{user:user}});
		}
	}])
	.controller('IndexController',['$scope','UsersService',function($scope,UsersService){
		$scope.user = $scope.user || {name:'guest@egusers.com',password:'guest',token:Math.random()+''};
		UsersService
			.login($scope.user)
			.success(handleUser)
			.error(handleError)
		;
		function handleUser (response) {
			console.log(response);
			if (!response.error) {
				$scope.user = response.user;
			} else {
				// ...
			}
		}
		function handleError (error) {
			console.log(error);
		}
	}])
	.controller('LoginController',['$scope','$location','UsersService',function($scope,$location,UsersService){
		$scope.login = login;
		function login () {
			UsersService
				.login($scope.user)
				.success(handleUser)
				.error(handleError)
			;
			function handleUser (response) {
				console.log(response);
				if (!response.error) {
					$scope.user = response.user;
					$location.path('/profile');
				} else {
					// ...
				}
			}
			function handleError (error) {
				console.log(error);
			}
		}
	}])
;
