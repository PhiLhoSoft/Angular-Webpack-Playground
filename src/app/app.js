'use strict';

// Once import of CSS
require('../style/app.css');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var routing = require('./app.config');
var home = require('./features/home');

module.exports = angular.module('DemoApp', [ uirouter, home ])
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
	.name;
