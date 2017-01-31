'use strict';

require('./settings.styl');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var addName = require('./addNameDirective');
var SettingsController = require('./settingsController');

module.exports = angular.module('app.settings', [ uirouter ])
	.directive('addName', addName)
	.controller('SettingsController', SettingsController)
	.name;
