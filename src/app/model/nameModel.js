'use strict';

var angular = require('angular');

function NameModel()
{
	var nm = this;

	nm.applicationName = 'Webpack AngularJS Demo';
	nm.names = [ 'John', 'Elisa', 'Mark', 'Annie', 'Reginald', 'Alexandra', 'Benjamin', 'Florian', 'Clement', 'Philippe' ];

	nm.addName = function (name)
	{
		nm.names.push(name);
	};

	nm.getRandomName = function ()
	{
		var totalNames = nm.names.length;
		var random = Math.floor(Math.random() * totalNames);
		return nm.names[random];
	};
}

module.exports = angular.module('demo-app')
	.service('nameModel', NameModel)
	.name;
