'use strict';

var angular = require('angular');

function Randomness()
{
	var rnd = this;

	rnd.getFromArray = function (array, previous)
	{
		var itemNb = array.length;
		if (itemNb === 0)
			return;
		if (itemNb === 1)
			return array[0];
		var item = previous; // Can be undefined, eg. on first call
		while (item === previous)
		{
			var random = Math.floor(Math.random() * itemNb);
			item = array[random];
		}
		return item;
	};
}

// Reusable service is isolated in its own module, can be moved to another app.
module.exports = angular.module('services.randomness', [])
	.service('randomness', Randomness)
	.name;
