'use strict';

function NameModel()
{
	var nm = this;

	nm.applicationName = 'Webpack AngularJS Demo';
	nm.names = [ 'John', 'Elisa', 'Mark', 'Annie', 'Reginald', 'Alexandra', 'Benjamin', 'Florian', 'Clement', 'Philippe' ];

	nm.add = function (name)
	{
		nm.names.push(name);
	};
}

module.exports = NameModel;
