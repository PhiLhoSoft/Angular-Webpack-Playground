'use strict';

require('./settings.styl');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var routing = require('./settings.routes');
var SettingsController = require('./settingsController');

module.exports = angular.module('app.settings', [ uirouter ])
	.config(routing)
	.controller('SettingsController', SettingsController)
	.name;
