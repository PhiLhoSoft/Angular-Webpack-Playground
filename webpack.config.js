/* eslint-env node */

'use strict';

// Modules
var nodePath = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get NPM lifecycle event to identify the environment.
 * That's the name of the ran NPM script:
 * npm test        -> run tests once
 * npm test-watch  -> run tests and watch for changes
 * npm build       -> build for production
 * npm start       -> build for dev / debug, run server: ENV === 'server'
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV.startsWith('test');
// Debug test in browser: don't use coverage which instruments / messes the code.
// Find sources in webpack://./src/app in Chrome DevTools.
var isDebugTest = ENV === 'test-debug';
var isProd = ENV === 'build';
console.log('NPM Lifecycle Event:', ENV, isTest, isProd);
// Exclude node_modules and test files from some operations
var nodeAndTests =
[
	/node_modules/,
	/\.test\.js$/
];


module.exports = function makeWebpackConfig()
{
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	var config = {};

	/**
	 * Entry
	 * Reference: http://webpack.github.io/docs/configuration.html#entry
	 * Should be an empty object if it's generating a test build
	 * Karma will set this when it's a test build
	 */
	config.entry = isTest ? {} :
	{
		app: './src/app/app.js'
	};

	/**
	 * Output
	 * Reference: http://webpack.github.io/docs/configuration.html#output
	 * Should be an empty object if it's generating a test build.
	 * Karma will handle setting it up for you when it's a test build.
	 */
	config.output = isTest ? {} :
	{
		// Absolute output directory
		path: nodePath.resolve('dist/'),

		// Output path from the view of the page
		// Uses webpack-dev-server in development
		publicPath: isProd ? '/' : 'http://localhost:8080/',

		// Filename for entry points
		// Only adds hash in build mode
		filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

		// Filename for non-entry points
		// Only adds hash in build mode
		chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
	};

	/**
	 * Devtool
	 * Reference: http://webpack.github.io/docs/configuration.html#devtool
	 * Type of sourcemap to use per build type.
	 */
	if (isTest)
	{
		config.devtool = 'inline-source-map';
	}
	else if (isProd)
	{
		config.devtool = 'source-map';
	}
	else // server mode (dev / debug)
	{
		config.devtool = 'eval-source-map';
	}

	/**
	 * Loaders
	 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
	 * List: http://webpack.github.io/docs/list-of-loaders.html
	 * This handles most of the magic responsible for converting modules.
	 */

	// Initialize module
	var cssPipeline = 'css?sourceMap!postcss!stylus';
	config.module =
	{
		preLoaders:
		[
			{
				test: /\.html$/,
				loader: 'htmlhint',
				exclude: /node_modules/
			},
			{
				test: /\.styl$/,
				// loader: isProd ? 'stylint' : 'null'
				loader: 'stylint'
			},
			{
				test: /\.js$/,
				// loader: isProd ? 'eslint-loader' : 'null',
				loader: 'eslint-loader',
				exclude: nodeAndTests
			},
		],
		loaders:
		[
			{
				// STYLUS LOADER
				// Reference: https://github.com/shama/stylus-loader
				// Allow processing Stylus files.
				//
				// Reference: https://github.com/postcss/postcss-loader
				// Postprocess your CSS with PostCSS plugins. Here, using Autoprefixer to add vendor prefixes depending on browser versions.
				//
				// Reference: https://github.com/webpack/css-loader
				// Allow loading CSS through JS (with require('foo.css')).
				//
				// Reference: https://github.com/webpack/extract-text-webpack-plugin
				// Then extract CSS files (out of JS) in production builds
				//
				// Reference: https://github.com/webpack/style-loader
				// Adds CSS to the DOM by injecting a <style> tag. Used in development.
				test: /\.styl$/,
				// loader: 'style-loader!css-loader!stylus-loader'
				loader:
					// Test: no CSS needed
					isTest ?
						'null' :
						// Prod: extract CSS to a separate file (loads in parallel with JS)
						// (isProd ?
							ExtractTextPlugin.extract('style', cssPipeline)
							// :
							// // Dev: leave CSS in JS, allows hot reloading
							// cssPipeline)
			},
			{
				// ASSET LOADER
				// Reference: https://github.com/webpack/file-loader
				// Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output.
				// Rename the file using the asset hash.
				// Pass along the updated reference to your code.
				// You can add here any file extension you want to get copied to your output.
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
				loader: 'file'
			},
			{
				// HTML LOADER
				// Reference: https://github.com/webpack/raw-loader
				// Allow loading HTML through JS.
				test: /\.html$/,
				loader: 'raw'
			},
		],
	};

	// ISTANBUL LOADER
	// Reference: https://github.com/deepsweet/istanbul-instrumenter-loader
	// Instrument JS files with Istanbul for subsequent code coverage reporting.
	// Skips node_modules and files that end with .test.js.
	if (isTest && !isDebugTest)
	{
		config.module.preLoaders.push(
		{
			test: /\.js$/,
			include: nodePath.resolve('src/app/'),
			exclude: nodeAndTests,
			loader: 'istanbul-instrumenter'
		});
	}

	/**
	 * PostCSS
	 * Reference: https://github.com/postcss/autoprefixer-core
	 * Add vendor prefixes to your CSS.
	 */
	config.postcss =
	[
		autoprefixer(
		{
			browsers: [ 'last 2 versions' ]
		})
	];

	/**
	 * Plugins
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */
	config.plugins = [];

	// Skip rendering index.html in test mode
	if (!isTest)
	{
		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		// Render index.html
		config.plugins.push(
			new HtmlWebpackPlugin(
			{
				template: './src/public/index.html',
				inject: 'body'
			}),

			// Reference: https://github.com/webpack/extract-text-webpack-plugin
			// Extract CSS files.
			// Disabled when in test mode or not in build mode.
			new ExtractTextPlugin('[name].[hash].css', { disable: !isProd })
		);
	}

	// Add build specific plugins
	if (isProd)
	{
		config.plugins.push(
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			// Only emit files when there are no errors.
			new webpack.NoErrorsPlugin(),

			// Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
			// Dedupe modules in the output.
			new webpack.optimize.DedupePlugin(),

			// Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			// Minify all JavaScript, switch loaders to minimizing mode.
			new webpack.optimize.UglifyJsPlugin(),

			// Reference: https://github.com/kevlened/copy-webpack-plugin
			// Copy assets from the public folder.
			new CopyWebpackPlugin(
			[
				{
					from: nodePath.resolve('src/public/')
				}
			])
		);
	}

	/**
	 * Dev server configuration
	 * Reference: http://webpack.github.io/docs/configuration.html#devserver
	 * Reference: http://webpack.github.io/docs/webpack-dev-server.html
	 */
	config.devServer =
	{
		contentBase: './src/public',
		stats: 'minimal'
	};

	return config;
}();
