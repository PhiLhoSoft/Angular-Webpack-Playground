'use strict';

routing.$inject = [ '$urlRouterProvider', '$locationProvider' ];

function routing($urlRouterProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
}

module.exports = routing;
