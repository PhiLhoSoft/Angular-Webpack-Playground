/* eslint-env node */

'use strict';

// Modules
var nodePath = require('path'); // Some settings want relative paths, others want absolute ones, given via resolve()
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var WebpackFailPlugin = require('webpack-fail-plugin');
var RemoveWebpackPlugin = require('remove-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var srcPath = './src/';
var prodPath = './public/';
var srcScriptPath = srcPath + 'app/';
var srcAssetsPath = srcPath + 'assets/';

/**
 * Env
 * Get NPM lifecycle event to identify the environment.
 * That's the name of the ran NPM script:
 * npm test        -> run tests once, with coverage
 * npm start       -> build for dev / debug, run server: ENV === 'server'
 * npm run test-watch   -> run tests and watch for changes, with coverage
 * npm run test-debug   -> run tests in Chrome and watch for changes, without coverage: this allows to debug the tests in Chrome
 * npm run test-verbose -> run tests in with special reporters
 * npm run stats        -> generate a statistics file in Json format. Can be used by webpack-bundle-analyzer.
 * npm run build        -> build for production
 */
var isTest = false, isDebugTest = false, isDebug = false, isProd = false, stats = false;
var ENV = process.env.npm_lifecycle_event;
if (ENV === undefined) // We ran Webpack directly without going through NPM: we want a prod build.
{
	isProd = true;
}
else
{
	isTest = ENV.startsWith('test');
	// Debug test in browser: don't use coverage which instruments / messes the code.
	// Find sources in webpack://./src/app in Chrome DevTools or use Ctrl+P to find them by name.
	isDebugTest = ENV === 'test-debug';
	isDebug = ENV === 'server';
	stats = ENV === 'stats';
	isProd = ENV === 'build' || (!isTest && !isDebug && !stats); // Unknown -> default to prod
}
if (!stats)
{
	console.log('NPM Lifecycle Event:', ENV, '-- test?', isTest, '| debug?', isDebug, '| prod?', isProd);
}
// Collect all dependencies declared in package.json
var dependencies = require('./package.json').dependencies;

/**
 * Config
 * Reference: http://webpack.github.io/docs/configuration.html
 * This is the object where all configuration gets set
 */
var config;
if (isTest)
{
	// Configuration is much simpler in test (no CSS, etc.)
	config =
	{
		devtool: 'inline-source-map',

		module:
		{
			preLoaders: [],
			loaders:
			[
				{
					// STYLUS LOADER
					test: /\.styl$/,
					loader: 'null'
				},
				{
					// CSS LOADER
					// For CSS files from modules.
					test: /\.css$/,
					loader: 'null'
				},
			]
		},

		plugins: [],
	};
	if (!isDebugTest)
	{
		// ISTANBUL LOADER
		// Reference: https://github.com/deepsweet/istanbul-instrumenter-loader
		// Instrument JS files with Istanbul for subsequent code coverage reporting.
		// Skips node_modules and files that end with .test.js.
		config.module.preLoaders.push(
			{
				test: /\.js$/,
				include: nodePath.resolve(srcScriptPath),
				exclude: /\.test\.js$/,
				loader: 'istanbul-instrumenter'
			}
		);
	}
}
else
{
	config = makeWebpackConfig();
}
config = addCommonPlugins(addCommonLoaders(addResolve(config)));

function makeWebpackConfig()
{
	var config = {};

	/**
	 * Entry
	 * Reference: http://webpack.github.io/docs/configuration.html#entry
	 * Should be an empty object if it's generating a test build
	 * Karma will set this when it's a test build
	 */
	config.entry =
	{
		app: srcScriptPath + 'app.js',
		// Defines the modules that go to the 'vendor' bundle.
		vendor: Object.keys(dependencies),
	};

	/**
	 * Output
	 * Reference: http://webpack.github.io/docs/configuration.html#output
	 * Should be an empty object if it's generating a test build.
	 * Karma will handle setting it up for you when it's a test build.
	 */
	config.output =
	{
		// Absolute output directory
		path: nodePath.resolve('public/'),

		// Output path from the view of the page
		// Uses webpack-dev-server in development
		publicPath: isProd ? '/' : 'http://localhost:8080/',

		// Filename for entry points
		// Only adds hash in build mode. Use chunkhash instead of hash, so that vendor chunk remains stable across builds
		// (long term caching, see https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95 for detailed explanations)
		filename: isProd ? '[name].[chunkhash].js' : '[name].bundle.js',

		// Filename for non-entry points
		// Only adds hash in build mode
		chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].bundle.js'
	};

	/**
	 * Don't parse large libraries putting stuff at the global level.
	 * http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
	 */
	// config.noParse =
	// [
	// 	/[\/\\]node_modules[\/\\]angular[\/\\]angular\.js$/
	// ];

	/**
	 * Devtool
	 * Reference: http://webpack.github.io/docs/configuration.html#devtool
	 * Type of sourcemap to use per build type.
	 */
	if (isDebug) // server mode (dev / debug)
	{
		// config.devtool = 'eval-source-map'; // Perhaps faster to generate, but doesn't work on startup (eg. breakpoints in app.js)
		// config.devtool = 'source-map'; // So switch to this one if you have to step in app.js
		config.devtool = 'cheap-module-eval-source-map';
	}
	else if (isProd)
	{
		config.devtool = 'source-map';
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
		preLoaders: [],
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
				// Extract CSS to a separate file (loads in parallel with JS, so faster)
				loader: ExtractTextPlugin.extract('style', cssPipeline)
			},
			{
				// CSS LOADER
				// For CSS files from modules.
				test: /\.css$/,
				// Use the 'style' loader after treatment by the CSS loader (minification with source map)
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
			},
		],
	};

	// ASSET LOADER
	// Reference: https://github.com/webpack/file-loader
	// Copy asset files (images, fonts...) to output.
	// Pass along the updated reference to your code.
	// You can add here any file extension you want to get copied to your output.
	if (isProd)
	{
		config.module.loaders.push(
			{
				// Manage the font files specifically (warning: SVG can be used for something else than fonts!)
				test: /\.(svg|woff|woff2|ttf|eot)$/,
				loader: 'file',
				query:
				{
					name: './fonts/[name].[ext]',
					publicPath: './'  // A bit clumsy as it generates ./../fonts/xxx but it works. Empty string is seen as false :-(
				}
			},
			{
				// Templates load flag images per country code, we need to preserve their names (and path)
				// and we just copy the corresponding folder with the CopyWebpackPlugin, so we prevent emitting the files.
				test: /[\\\/]flags[\\\/].*\.png$/,
				loader: 'file',
				query:
				{
					emitFile: false,
					name: '[name].[ext]',
					publicPath: prodPath + 'images/flags/',
				}
			},
			{
				// Handle remaining files. It comes after the others, so it catches the remainder.
//~ 				test: /[\\\/]images[\\\/][^\\\/]+\.(png|jpg|jpeg|gif)$/, // More specific, doesn't seem necessary
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'file',
				query:
				{
					emitFile: false,
					name: '[name].[ext]',
					publicPath: prodPath + 'assets/img/',
				}
			}
		);
	}
	else
	{
		// Just copy the files as is
		config.module.loaders.push(
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
				loader: 'file',
			}
		);
	}

	config.stylus =
	{
		use: [ require('nib')() ],
		// Had to import explicitly nib from main style file, to set variables deactivating obsolete Flexbox properties.
//		import: [ '~nib/lib/nib/index.styl' ] // ~ means "in node_modules directory"
	};

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

	// Linters and hinters
	config.module.preLoaders.push(
		{
			test: /\.html$/,
			include: nodePath.resolve(srcPath + 'app/'),
			loader: 'htmlhint'
		},
		{
			test: /\.styl$/,
			include: nodePath.resolve(srcPath + 'app/styles'),
			loader: 'stylint'
		},
		{
			test: /\.js$/,
			include: nodePath.resolve(srcScriptPath),
			loader: 'eslint-loader'
		}
	);
	config.stylint =
	{
		config: nodePath.resolve(srcPath + '.stylintrc')
	};

	config.plugins =
	[
		// Reference: webpack-fail-plugin
		// See also https://github.com/webpack/webpack/issues/708
		WebpackFailPlugin,

		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		// Render index.html, adding paths to generated style and JS files at appropriate places.
		new HtmlWebpackPlugin(
		{
			// Instrument the existing index
			template: srcPath + 'index.html',
			// Produces it there
			filename: 'index.html',
			// Put JS tags at the end of the body (not in the header)
			inject: 'body'
		}),

		// Reference: https://github.com/webpack/extract-text-webpack-plugin
		// Extract CSS to one file (otherwise it is inlined in the JS).
		// Disabled when not in build mode.
		new ExtractTextPlugin('[name].[chunkhash].css', { disable: !isProd }),

		// Reference: https://github.com/webpack/docs/wiki/list-of-plugins#commonschunkplugin
		// Separates the libraries from the application.
		new webpack.optimize.CommonsChunkPlugin(
		{
			name: 'vendor',
			filename: isProd ? 'vendor.[chunkhash].js' : 'vendor.bundle.js',
			minChunks: Infinity
		})
	];

	// Add build specific plugins
	if (isProd)
	{
		config.plugins.push(
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			// Only emit files when there are no errors.
			new webpack.NoErrorsPlugin(),

			// Reference: https://github.com/aleksei0807/remove-webpack-plugin
			// Clean the destination directories / files: since names are generated with hashes, they won't be overwritten.
			new RemoveWebpackPlugin(
				[ prodPath, ]
			),

			// Reference: https://github.com/kevlened/copy-webpack-plugin
			// Copy assets to the destination relative to build directory (declared in 'output' configuration).
			// Do that instead of using the file-loader because some images are loaded in templates with a computed name
			// (eg. flags based on country id, etc.) which must be preserved.
			new CopyWebpackPlugin(
			[
				{
					from: srcAssetsPath + 'img',
					to: 'assets/img/'
				},
				{
					from: srcAssetsPath + 'img/favicon.ico',
					to: './'
				},
			]),

			// Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			// Minify all JavaScript, switch loaders to minimizing mode.
			new webpack.optimize.UglifyJsPlugin(
			{
				compress:
				{
					warnings: false // Warnings are pointless: we use ESLint, and don't want warnings on libraries!
				}
			})
		);
	}

	/**
	 * Dev server configuration
	 * Reference: http://webpack.github.io/docs/configuration.html#devserver
	 * Reference: http://webpack.github.io/docs/webpack-dev-server.html
	 */
	config.devServer =
	{
		contentBase: './src',
		stats: 'minimal'
	};

	return config;
}

function addResolve(config)
{
	/**
	 * Resolve
	 * Reference: http://webpack.github.io/docs/configuration.html#resolve
	 * Alias some paths, to avoid using require('../../foo') depending on depth in hierarchy...
	 */
	config.resolve =
	{
		alias:
		{
			// awp for angular-webpack-playground
			'awp-root': nodePath.resolve(srcScriptPath),
			'awp-app': nodePath.resolve(srcScriptPath, 'features'),
			'awp-home': nodePath.resolve(srcScriptPath, 'features/home'),
			'awp-settings': nodePath.resolve(srcScriptPath, 'features/settings'),
			'awp-model': nodePath.resolve(srcScriptPath, 'model'),
			'awp-directives': nodePath.resolve(srcScriptPath, 'directives'),
			'awp-services': nodePath.resolve(srcScriptPath, 'services'),
		},
		//extensions: [ '', '.html', '.js' ],
	};

	return config;
}

function addCommonLoaders(config)
{
	config.module.loaders.push(
		{
			// Load jQuery and expose it as global variable before loading AngularJS,
			// so that the latter will use it instead of jqLite.
			// Reference: https://github.com/webpack/expose-loader
			// and http://stackoverflow.com/questions/36065931/webpack-how-to-make-angular-auto-detect-jquery-and-use-it-as-angular-element-in
			test: require.resolve('jquery'), // Full path in node_modules
			loader: 'expose?$!expose?jQuery'
		},
		{
			// HTML LOADER
			// Reference: https://github.com/webpack/raw-loader
			// Allow loading HTML through JS.
			test: /\.html$/,
			loader: 'raw'
		}
	);

	return config;
}

function addCommonPlugins(config)
{
	/**
	 * Plugins
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */
	config.plugins.push(
		// Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
		// Dedupe modules in the output.
		new webpack.optimize.DedupePlugin(),

		// Reference: http://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
		// Ignore some modules. Here, avoids loading all locales of Moment.js (rather big! reduces vendor file of 165 KB).
		// We can then require specific ones. See also http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
//		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

		// Reference: http://webpack.github.io/docs/list-of-plugins.html#provideplugin
		// Automatically requires declared libraries creating global variables.
		new webpack.ProvidePlugin(
		{
			$: 'jquery',
			jQuery: 'jquery',
			_: 'lodash',
//			moment: 'moment',
//			angular: 'angular', // No, we have to require it everywhere anyway
		})
	);

	return config;
}


module.exports = config;
