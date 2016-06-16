'use strict';

// Once import of CSS
require('../style/app.styl');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var routing = require('./app.config');

// Features
var home = require('./features/home');
var settings = require('./features/settings');

module.exports = angular.module('demo-app', [ uirouter, home, settings ])
	.config(routing)
	.run(
	[
		// Some services / factories are injected here to bootstrap them
		'$rootScope', '$log',
		function ($rootScope, $log)
		{
			$rootScope.url = 'https://github.com/angular-tips/webpack-demo/';
			$log.info('Starting the application.');
		}
	])
	.controller('AboutController',
	[
		'$scope',
		function AboutController($scope)
		{
			var ctrl = this;

			ctrl._activate = function ()
			{
				// Possibly get information from server...
				ctrl.productName = 'Webpack AngularJS Demo';
				ctrl.productVersion = '0.1';
			};

			// See http://www.befundoo.com/university/tutorials/angularjs-2-controllers/ (and good idea anyway)
			ctrl._activate();
		}
	])
	.name;
