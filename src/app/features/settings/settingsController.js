'use strict';

// var angular = require('angular');

SettingsController.$inject = [ '$scope', 'nameModel' ];

function SettingsController($scope, nameModel)
{
	var ctrl = this;

	ctrl.names = nameModel.names;

	$scope.$on('addName', function __addName(event, name)
	{
		nameModel.add(name);
	});
}

module.exports = SettingsController;
