'use strict';

var angular = require('angular');
var settings = require('./');

var scope, compile;

describe('Directive: addName', function ()
{
	beforeEach(function ()
	{
		angular.mock.module(settings);

		angular.mock.inject(function ($injector, $rootScope, $compile)
		{
			scope = $rootScope.$new();
			compile = $compile;
		});
	});

	it('should disable if the list of names is not provided', function ()
	{
		var addName = compile('<add-name list="names"></add-name>')(scope);

		expect(addName).not.toBeNull();

		var isolatedScope = addName.isolateScope();
		expect(isolatedScope.list).toBeUndefined();

		var ctrl = isolatedScope.an;
		expect(ctrl.isDisabled).toBe(true);
		expect(ctrl.addNameTooltip).toBe('No names provided');
	});

	it('should have the list of names', function ()
	{
		scope.names = [ 'a', 'b' ];
		var addName = compile('<add-name list="names"></add-name>')(scope);

		expect(addName).not.toBeNull();

		var isolatedScope = addName.isolateScope();
		expect(isolatedScope.list).toBe(scope.names);

		var ctrl = isolatedScope.an; // controllerAs=an
		expect(ctrl.isDisabled).toBe(true);
		expect(ctrl.addNameTooltip).toBe('Need a name');
	});

	it('should disable if name exists', function ()
	{
		scope.names = [ 'alpha', 'beta' ];
		var addName = compile('<add-name list="names"></add-name>')(scope);

		expect(addName).not.toBeNull();

		var isolatedScope = addName.isolateScope();
		var ctrl = isolatedScope.an; // controllerAs=an
		ctrl.name = scope.names[0];
		ctrl.check();

		expect(ctrl.isDisabled).toBe(true);
		expect(ctrl.addNameTooltip).toBe('Duplicate name');
	});

	it('should emit an event when asked to add a name', function ()
	{
		scope.names = [ 'one', 'two' ];
		var addName = compile('<add-name list="names"></add-name>')(scope);

		expect(addName).not.toBeNull();

		var isolatedScope = addName.isolateScope();
		spyOn(isolatedScope, '$emit');
		var ctrl = isolatedScope.an; // controllerAs=an
		ctrl.name = 'three';
		ctrl.check();

		expect(ctrl.isDisabled).toBe(false);
		expect(ctrl.addNameTooltip).toBe('Add a new name');

		ctrl.add();

		expect(isolatedScope.$emit).toHaveBeenCalledWith('addName', ctrl.name);
	});
});
