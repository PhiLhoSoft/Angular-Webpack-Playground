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

module.exports = angular.module('directives.greeting', [])
	.directive('greeting', greeting)
	.name;
