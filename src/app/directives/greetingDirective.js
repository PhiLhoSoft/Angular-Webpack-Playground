'use strict';

var angular = require('angular');

function greeting()
{
	return {
		restrict: 'E',
		scope:
		{
			name: '='
		},
		template: '<div>Hello, {{name}}</div>'
	};
}

// Reusable directive is isolated in its own module...
module.exports = angular.module('directives.greeting', [])
	.directive('greeting', greeting)
	.name;
