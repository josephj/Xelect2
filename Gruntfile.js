/*global grunt*/
module.exports = function (grunt) {

    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    var webpack = require('webpack'),
        webpackConfig = require('./webpack.config.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            js: './src/js/',
            css: './src/sass/',
            dist: './dist/'
        },
        autoprefixer: {
            options: {
                browsers: ['> 5%'],
                cascade: false
            },
            main: {
                src: '<%= dirs.dist %>xelect2.css'
            }
        },
        connect: {
            server: {
                options: {
                    base: './',
                    port: 8001,
                    livereload: 36729,
                    open: {
                      target: 'http://localhost:8001/tests/manual/development.html'
                    }
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*! Built on <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */'
            },
            main: {
                files: [
                    {
                        src: '<%= dirs.css %>xelect2.css',
                        dest: '<%= dirs.css %>xelect2.min.css'
                    }
                ]
            }
        },
        jscs: {
            options: {
                config: './.jscsrc'
            },
            main: {
                files: {
                    src: ['<%= dirs.js %>**/*.js']
                }
            }
        },
        jshint: {
            options: {jshintrc: './.jshintrc'},
            all: {
                files: {
                    src: ['<%= dirs.js %>**/*.js']
                }
            }
        },
        sass: {
            options: {sourceMap: true},
            main: {
                src: '<%= dirs.css %>xelect2.scss',
                dest: '<%= dirs.dist %>xelect2.css'
            }
        },
        uglify: {
            main: {
                src: './dist/xelect2.js',
                dest: './dist/xelect2.min.js'
            }
        },
        watch: {
            options: {
                livereload: 36729
            },
            js: {
                files: ['./src/js/*.js'],
                tasks: ['webpack']
            },
            css: {
                files: ['./src/sass/*.scss'],
                tasks: ['sass', 'autoprefixer']
            }
        },
        webpack: {
            options: webpackConfig,
            build: {
                plugins: webpackConfig.plugins.concat(
                    new webpack.DefinePlugin({
                        "process.env": {
                            "NODE_ENV": JSON.stringify('production')
                        }
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin()
                )
            },
            main: {
                devtool: "sourcemap",
                debug: true
            }
        },
        "webpack-dev-server": {
            options: {
                webpack: webpackConfig,
                publicPath: "/" + webpackConfig.output.publicPath
            },
            start: {
                keepAlive: true,
                webpack: {
                    devtool: "eval",
                    debug: true
                }
            }
        }
    });

    grunt.registerTask('build', [
        'sass',
        'autoprefixer',
        'cssmin',
        'webpack:build',
        'uglify'
    ]);

    grunt.registerTask('default', ['webpack:main', 'connect', 'watch']);
};
