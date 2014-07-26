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
		service.logout = logout;
		return service;
		function login (user) {
			return $http({method:'post',url:'/login',data:{user:user}});
		}
		function  logout (user) {
			return $http({method:'post',url:'/logout',data:{user:user}})
		}
	}])
	.controller('IndexController',['$rootScope','UsersService',function($rootScope,UsersService){
		$rootScope.user = $rootScope.user || {name:'guest@egusers.com',password:'guest',token:Math.random()+''};
		UsersService
			.login($rootScope.user)
			.success(handleUser)
			.error(handleError)
		;
		function handleUser (response) {
			console.log(response);
			if (!response.error) {
				$rootScope.user = response.user;
			} else {
				// ...
			}
		}
		function handleError (error) {
			console.log(error);
		}
	}])
	.controller('LoginController',['$rootScope','$location','UsersService',function($rootScope,$location,UsersService){
		$rootScope.login = login;
		function login () {
			UsersService
				.login($rootScope.user)
				.success(handleUser)
				.error(handleError)
			;
			function handleUser (response) {
				console.log(response);
				if (!response.error) {
					$rootScope.user = response.user;
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
	.controller('LogoutController',['$rootScope','$location','UsersService',function($rootScope,$location,UsersService){
		$rootScope.logout = logout;
		function logout () {
			UsersService
				.logout($rootScope.user)
				.success(handleLogout)
				.error(handleError)
			;
			function handleLogout (response) {
				console.log(response);
				if (!response.error) {
					$rootScope.user = {name:'guest@egusers.com',password:'guest',token:Math.random()+''};
					$location.path('/home');
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
