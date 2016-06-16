'use strict';

routing.$inject = [ '$urlRouterProvider', '$locationProvider', '$stateProvider' ];

function routing($urlRouterProvider, $locationProvider, $stateProvider)
{
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('about',
		{
			url: '/about',
			template: require('./about.html'),
			controller: 'AboutController',
			controllerAs: 'about'
		});
}

module.exports = routing;
