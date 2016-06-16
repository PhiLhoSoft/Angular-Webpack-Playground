'use strict';

var angular = require('angular');
var settings = require('./');
// var app = require('../../app');
var model = require('../../model/');

var scope, nameModel;

describe('Controller: Settings', function ()
{
	var ctrl;

	beforeEach(function ()
	{
		angular.mock.module(settings, model);

		angular.mock.inject(function ($injector, $rootScope, $controller)
		{
			scope = $rootScope.$new();
			nameModel = $injector.get('nameModel');
			ctrl = $controller('SettingsController', { $scope: scope });
		});
	});

	it('should have the list of names', function ()
	{
		expect(ctrl.names).toBe(nameModel.names);
	});

	it('should update the list of names', function ()
	{
		var name = 'Hodor';
		scope.$emit('addName', name);

		expect(ctrl.names).toContain(name);
	});
});
