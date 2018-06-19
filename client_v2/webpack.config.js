const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

let gitRevisionPlugin = new GitRevisionPlugin();

module.exports = function (prop) {

    // if the local_config is not present then we're likely running webpack directly from the command line
    // load the dev environment by default
    let config = null;
	if ( typeof prop == 'undefined' ) {
		// combine it with the project configuration file
        config = require('./gulp.config.js')();
    }
    else {
        config = prop;
    }
    
    var wp = {
        mode: 'development',

        // --watch true, --watch false
        watch: false,
        watchOptions: {
            poll: 1000,
            aggregateTimeout: 500,
        },
        // set basedir for entry point
        context: path.resolve(__dirname, config.src.base),

        externals: {
            jquery: "jQuery",
            $: "jQuery",
            gitversion: '123'
        },

        entry: {
            'app': './js/app.js'
        },

        output: {
            path: path.resolve(__dirname, config.build.base + config.build.js),
            filename: '[name].min.js', //TODO only on build
            libraryTarget: 'umd',
            library: ['Tg', '[name]'],
            umdNamedDefine: true
        },

        resolve: {
            modules: [
                'node_modules',
                './'
            ],
            alias: {
                modernizr$: path.resolve(__dirname, "./.modernizrrc.js")
            }
        },

        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    loader: "webpack-modernizr-loader",
                    test: /\.modernizrrc\.js$/
                },
            ]
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: path.resolve(__dirname, "node_modules"),
                        chunks: "initial",
                        name: "vendor",
                        minChunks: 1,
                        priority: 10,
                        enforce: true
                    }
                }
            }
        },

        stats: {
            modules: false,
            entrypoints: false,
            chunks: false
        },

        plugins: [

            new webpack.NoEmitOnErrorsPlugin(),

            // new webpack.DefinePlugin({
            //     PRODUCTION: JSON.stringify(true)
            // }),
            
            new HtmlWebPackPlugin({
                title: 'My Awesome application',
                git_version: JSON.stringify('tgwcv2-rev_2.' + gitRevisionPlugin.version()),
                inject: "head",
                minify: false,
                hash: true,
                template: './index.html',
                filename: '../index.html' //relative to root of the application
            }),
        ]
    }

    return wp;
};