'use strict';

// Instead of $inject, we can directly define the module in classical array form.
// More useful if the module declares several components (module.exports = { a: [], b: [] })

module.exports =
[
	'$urlRouterProvider', '$locationProvider', '$stateProvider',
	function routing($urlRouterProvider, $locationProvider, $stateProvider)
	{
		// $log cannot be injected here (config()) as it is not available yet
		console.log('Defining routing for app');
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
];
