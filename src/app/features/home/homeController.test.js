'use strict';

var painless = require('painless');
var test = painless.createGroup();
var assert = painless.assert;

var angular = require('angular');
var app = require('../../app');

var ctrl;

test.beforeEach(function ()
{
	angular.mock.module(app);

	angular.mock.inject(function ($controller)
	{
		ctrl = $controller('HomeController', {});
	});
});

// Callback test
test('callback test', function (done)
{
	setTimeout(function ()
	{
		assert.deepEqual({ a: '1' }, { a: '1' });
		done();
	}, 10);
});

test('name is initialized to World', function (done)
{
	assert.equal(ctrl.name, 'World');
	done();
});
