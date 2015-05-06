/*global grunt*/
module.exports = function (grunt) {
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
            main: {
                entry: '<%= dirs.js %>xelect2.js',
                output: {
                    path: '<%= dirs.dist %>',
                    filename: 'xelect2.js'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'sass',
        'autoprefixer',
        'cssmin',
        'webpack',
        'uglify'
    ]);

    grunt.registerTask('default', ['build', 'connect', 'watch']);
};
