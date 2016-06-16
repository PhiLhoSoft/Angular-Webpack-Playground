'use strict';

var angular = require('angular');

function RandomNames()
{
	var rn = this;

	rn.names = [ 'John', 'Elisa', 'Mark', 'Annie', 'Reginald', 'Alexandra', 'Florian', 'Clement', 'Philippe' ];

	rn.getName = function ()
	{
		var totalNames = rn.names.length;
		var random = Math.floor(Math.random() * totalNames);
		return rn.names[random];
	};
}

module.exports = angular.module('services.random-names', [])
	.service('randomNames', RandomNames)
	.name;
