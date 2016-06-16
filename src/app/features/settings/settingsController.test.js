'use strict';

var angular = require('angular');
//~ var app = require('../../app');
var settings = require('./index');

describe('Controller: Settings', function ()
{
	var ctrl;

	beforeEach(function ()
	{
//~ 		angular.mock.module(app);
		angular.mock.module(settings);

		angular.mock.inject(function ($controller)
		{
			ctrl = $controller('SettingsController', {});
		});
	});

	it('should do', function ()
	{
		expect(ctrl.foo()).toBe(42);
		expect('Foo').toBe('Foo');
	});
});
