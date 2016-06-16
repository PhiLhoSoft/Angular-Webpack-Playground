'use strict';

// var angular = require('angular');

HomeController.$inject = [ 'randomNames' ];

function HomeController(randomNames)
{
	var ctrl = this;

	ctrl.name = 'World';

	ctrl.changeName = function ()
	{
		ctrl.name = 'Webpack AngularJS Demo';
	};

	ctrl.randomizeName = function ()
	{
		ctrl.name = randomNames.getName();
	};
}

module.exports = HomeController;
