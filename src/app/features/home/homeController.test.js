'use strict';

var angular = require('angular');
//~ var app = require('../../app');
var home = require('./index');

describe('Controller: Home', function ()
{
	var ctrl;

	beforeEach(function ()
	{
//~ 		angular.mock.module(app);
		angular.mock.module(home);

		angular.mock.inject(function ($controller)
		{
			ctrl = $controller('HomeController', {});
		});
	});

	it('should have name initialized to "World"', function ()
	{
		expect(ctrl.name).toBe('World');
	});

	it('should change name', function ()
	{
		ctrl.changeName();

		expect(ctrl.name).toBe('Webpack AngularJS Demo');
	});

	it('should provide a random name', function ()
	{
		ctrl.randomizeName();

		expect(ctrl.name).not.toBe('World');
	});
});
