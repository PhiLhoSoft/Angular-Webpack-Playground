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
	.controller('HomeController', HomeController)
	.name;
