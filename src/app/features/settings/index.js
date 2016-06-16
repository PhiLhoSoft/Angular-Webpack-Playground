'use strict';

require('./settings.styl');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var routing = require('./settings.routes');
var addName = require('./addNameDirective');
var SettingsController = require('./settingsController');

module.exports = angular.module('app.settings', [ uirouter ])
	.config(routing)
	.directive('addName', addName)
	.controller('SettingsController', SettingsController)
	.name;
