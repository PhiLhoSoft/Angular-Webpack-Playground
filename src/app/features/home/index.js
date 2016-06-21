'use strict';

require('./home.styl');

var angular = require('angular');
var uirouter = require('angular-ui-router');

var routing = require('./home.routes');
var HomeController = require('./homeController');

var model = require('../../model/');
var randomness = require('../../services/randomnessService');
var greeting = require('../../directives/greetingDirective');

module.exports = angular.module('app.home', [ uirouter, model, randomness, greeting ])
	.config(routing)
	/*
	We declare the controller here, instead of doing it in homeController.js in the classical Angular way,
	because otherwise the controller file would be isolated from the Webpack tree of dependencies, so it wouldn't process it:
	the controller is then missing from the application because the module is never called!
	Of course, we can then require the file here as side effect, but then we gain nothing.
	Beside, it is interesting to have the list of the components of the module in one place.
	*/
	.controller('HomeController', HomeController)
	.name;
