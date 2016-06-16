'use strict';

// var angular = require('angular');

HomeController.$inject = [ 'nameModel', 'randomness' ];

function HomeController(nameModel, randomness)
{
	var ctrl = this;

	ctrl.name = 'World';

	ctrl.changeName = function ()
	{
		ctrl.name = nameModel.applicationName;
	};

	ctrl.randomizeName = function ()
	{
		ctrl.name = randomness.getFromArray(nameModel.names);
	};
}

module.exports = HomeController;
