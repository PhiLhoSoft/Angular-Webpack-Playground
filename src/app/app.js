'use strict';

// Inject CSS in the application (needed only once)
require('../style/app.styl');

// Libraries, using the NPM name (used in package.json)
var angular = require('angular');
var uirouter = require('angular-ui-router');

// Application modules
var model = require('./model/');
var home = require('./features/home/');
var settings = require('./features/settings/');

var routing = require('./app.config');

module.exports = angular.module('demo-app', [ uirouter, model, home, settings ])
	.config(routing)
	.run(
	[
		'$templateCache',
		function ($templateCache)
		{
			// Put in cache the files that are ng-include'd in templates
			$templateCache.put('included.html', require('./included.html'));
		}
	])
	.run(
	[
		// Some services / factories can be injected here to bootstrap them
		'$rootScope', '$log',
		function ($rootScope, $log)
		{
			$rootScope.url = 'https://github.com/angular-tips/webpack-demo/';
			$rootScope.url2 = 'https://github.com/PhiLhoSoft/Angular-Webpack-Playground/';
			$log.info('Starting the application.');
		}
	])
	// Small controller can be declared on the fly...
	.controller('AboutController',
	[
		'$scope', 'nameModel', // Component still has to be injected the old way...
		function AboutController($scope, nameModel)
		{
			var ctrl = this;

			ctrl._activate = function ()
			{
				// Possibly get information from server...
				ctrl.productName = nameModel.applicationName;
				ctrl.productVersion = '0.1';
			};

			// See http://www.befundoo.com/university/tutorials/angularjs-2-controllers/ (and good idea anyway)
			ctrl._activate();
		}
	])
	.name;
console.log('The application module is defined:', module.exports);
