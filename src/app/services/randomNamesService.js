'use strict';

var angular = require('angular');

function RandomNames()
{
	this.names = [ 'John', 'Elisa', 'Mark', 'Annie', 'Reginald', 'Alexandra', 'Florian', 'Clement', 'Philippe' ];

	this.getName = function ()
	{
		var totalNames = this.names.length;
		var random = Math.floor(Math.random() * totalNames);
		return this.names[random];
	};
}

module.exports = angular.module('services.random-names', [])
  .service('randomNames', RandomNames)
  .name;
