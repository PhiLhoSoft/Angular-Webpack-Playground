'use strict';

// var angular = require('angular');

function addName()
{
	return {
		restrict: 'E',
		scope:
		{
			list: '=',
		},
		template: require('./addName.html'),
		controllerAs: 'an',
		controller:
		[
			'$scope',
			function AddName($scope)
			{
				var ctrl = this;

				ctrl.list = $scope.list; // From directive

				ctrl.check = function ()
				{
					ctrl.isDisabled = true;
					if (!ctrl.list || ctrl.list.length === 0)
					{
						ctrl.addNameTooltip = 'No names provided';
						return;
					}
					if (!ctrl.name || ctrl.name.length === 0)
					{
						ctrl.addNameTooltip = 'Need a name';
						return;
					}
					if (ctrl.list.some(function (name) { return ctrl.name === name; }))
					{
						ctrl.addNameTooltip = 'Duplicate name';
						return;
					}

					ctrl.addNameTooltip = 'Add a new name';
					ctrl.isDisabled = false;
				};

				ctrl.add = function ()
				{
					$scope.$emit('addName', ctrl.name);
				};

				ctrl.check();
			}
		]
	};
}

// Directive specific to a module is just exported as a function
module.exports = addName;
