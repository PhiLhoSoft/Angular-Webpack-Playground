'use strict';

// var angular = require('angular');

HomeController.$inject = [ 'randomNames' ];

function HomeController(randomNames)
{
	var ctrl = this;

	ctrl.random = randomNames;
	ctrl.name = 'World';

	ctrl.changeName = function ()
	{
		ctrl.name = 'Webpack AngularJS Demo';
	};

	ctrl.randomName = function ()
	{
		ctrl.name = ctrl.random.getName();
	};
}

module.exports = HomeController;
