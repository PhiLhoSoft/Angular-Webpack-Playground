// Entry point for the 'model' module, exposing several (only one here...) services holding the application's model.

'use strict';

var angular = require('angular');

var NameModel = require('./nameModel');

module.exports = angular.module('app.model', [])
	.service('nameModel', NameModel)
	.name;
