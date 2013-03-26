module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        lint: {
            files: ['grunt.js', 'public/js/**/*.js', 'test/**/*.js']
        },
        watch: {
            files: ['<config:jasmine.specs>'],
            tasks: 'jasmine'
        },
        jasmine: {
            src: ['public/lib/underscore/**/*.js',
                'public/lib/jquery/**/*.js', 'public/lib/jcanvas/**/*.js', 'public/js/**/*.js'],
            specs: ['test/**/*.js']
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: false,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true
            },
            globals: {
                jasmine: false,
                describe: false,
                afterEach: false,
                beforeEach: false,
                expect: false,
                it: false,
                xit: false,
                spyOn: false,

                // Special globals
                define: false,
                require: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-runner');

    // Default task.
    grunt.registerTask('default', 'jasmine');

};