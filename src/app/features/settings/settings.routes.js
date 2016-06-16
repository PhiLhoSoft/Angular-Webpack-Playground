'use strict';

routes.$inject = [ '$stateProvider' ];

function routes($stateProvider)
{
	$stateProvider
		.state('settings',
		{
			url: '/settings',
			template: require('./settings.html'),
			controller: 'SettingsController',
			controllerAs: 'settings'
		});
}

module.exports = routes;
