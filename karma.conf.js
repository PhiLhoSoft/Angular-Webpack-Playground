// karma start
// OR
// karma start -D
// for debugging tests: it launches Chrome.
// Then click on the DEBUG button, and in the new tab, open the DevTools. Go to Sources, put breakpoints, refresh.
// In debug mode, we listen for file changes and re-run the tests.
// Can also add the -V flag to get a verbose output: list each test description, and output a Json summary.

/* eslint-env node */

'use strict';

function isDebug(argument)
{
	return argument === '-D';
}
function isVerbose(argument)
{
	return argument === '-V';
}
var debug = process.argv.some(isDebug);
var verbose = process.argv.some(isVerbose);

// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config)
{
	var plugins =
	[
		'karma-webpack', 'karma-sourcemap-loader',
		'karma-jasmine',
		'karma-chrome-launcher', 'karma-firefox-launcher',
	];
	if (verbose)
	{
		plugins.push('karma-spec-reporter'); // Show each test name as it is run; useful to pin-point a crash
		plugins.push('karma-jsonsummary-reporter'); // Can be useful too... :-)
	}
	if (!debug)
	{
		plugins.push('karma-phantomjs-launcher');
		plugins.push('karma-growl-reporter'); // Show notifications in the tray
		plugins.push('karma-coverage');
	}
	var reporters = [ 'dots' ];
	if (verbose)
	{
		// Reference: https://github.com/mlex/karma-spec-reporter
		// Set reporter to print detailed results to console.
		reporters = [ 'spec', 'jsonsummary' ];
	}
	if (!debug)
	{
		// Reference: https://github.com/karma-runner/karma-coverage
		// Output code coverage files.
		reporters.push('coverage');
		reporters.push('growl');
	}

	var configuration =
	{
		frameworks:
		[
			// Reference: https://github.com/karma-runner/karma-jasmine
			// Set framework to Jasmine
			'jasmine'
		],

		plugins: plugins,
		reporters: reporters,

		files:
		[
			'src/tests.webpack.js'
		],
		exclude: [],

		preprocessors:
		{
			// Reference: http://webpack.github.io/docs/testing.html
			// Reference: https://github.com/webpack/karma-webpack
			// Convert files with Webpack and load sourcemaps.
			'src/tests.webpack.js': [ 'webpack', 'sourcemap' ]
		},

		// Run tests using Chrome (for debugging) or PhantomJS
		browsers: debug ? [ 'Chrome' ] : [ 'PhantomJS' ],

		autoWatch: debug,
		singleRun: !debug,

		// Configure code coverage reporter
		coverageReporter:
		{
			dir: 'coverage/',
			subdir: function (browser)
			{
				return browser.toLowerCase().split(/[ /-]/)[0];
			},
			reporters:
			[
				{ type: 'text-summary' },
				{ type: 'html' }
			]
		},
		specReporter:
		{
			maxLogLines: 5,         // limit number of lines logged per test
			suppressErrorSummary: false,  // do not print error summary
			suppressFailed: false,  // do not print information about failed tests
			suppressPassed: false,  // do not print information about passed tests
			suppressSkipped: true,  // do not print information about skipped tests
			showSpecTiming: false // print the time elapsed for each spec
		},
		jsonReporter:
		{
			stdout: true,
//            outputFile: 'results.json', // defaults to none
		},

		webpack: require('./webpack.config'),

		// Hide Webpack build information from output
		webpackMiddleware:
		{
			noInfo: 'errors-only'
		}
	};
	config.set(configuration);
};
