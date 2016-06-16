'use strict';

require('./home.styl');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var routing = require('./home.routes');
var HomeController = require('./homeController');
var randomNames = require('../../services/randomNamesService');
var greeting = require('../../directives/greetingDirective');

module.exports = angular.module('app.home', [ uirouter, randomNames, greeting ])
	.config(routing)
	.controller('HomeController', HomeController)
	.name;
