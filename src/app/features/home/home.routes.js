'use strict';

routes.$inject = [ '$stateProvider' ];

function routes($stateProvider)
{
	$stateProvider
		.state('home',
		{
			url: '/',
			template: require('./home.html'),
			controller: 'HomeController',
			controllerAs: 'home'
		});
}

module.exports = routes;
