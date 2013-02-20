module.exports = function (grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'Gruntfile.js',
        'public/scripts/**/*.js',
        '!public/scripts/lib/**/*.js',
        '!public/scripts/*.min.js'
      ],
      options: {
        browser: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        quotmark: 'single',
        undef: true,
        unused: true,
        trailing: true,
        strict: true,
        predef: [
          'requirejs', 'require', 'define',
          'module',
          '_gaq',
          'console'
        ]
      }
    },
    uglify: {
      options: {
        preserveLicenseComments: false,
        mangle: true,
        compress: true
      },
      production: {
        files: {
          'public/scripts/lib/requirejs/require.min.js': 'public/scripts/lib/requirejs/require.js'
        }
      }
    },
    requirejs: {
      options: {
        wrap: true,
        optimize: 'uglify2',
        preserveLicenseComments: false,
        optimizeAllPluginResources: true,
        paths: {
          jquery: 'empty:'
        }
      },
      sqt: {
        options: {
          name: 'sqt',
          mainConfigFile: 'public/scripts/sqt.js',
          out: 'public/scripts/sqt.min.js'
        }
      },
      sqtAbout: {
        options: {
          name: 'sqt_about',
          mainConfigFile: 'public/scripts/sqt_about.js',
          out: 'public/scripts/sqt_about.min.js'
        }
      }
    },
    less: {
      production: {
        files: {
          'public/css/sqt.css': 'public/css/sqt.less',
          'public/css/about.css': 'public/css/about.less'
        }
      }
    },
    csslint: {
      src: [
        //'public/css/global.css',
        //'public/css/layout.css',
        'public/css/sqt.css',
        'public/css/about.css'
      ]
    },
    concat: {
      production: {
        src: [
          'public/css/global.css',
          'public/css/layout.css',
          'public/css/bootstrap.css',
          'public/css/sqt.css',
          'public/css/about.css'
        ],
        dest: 'public/css/sarbotte.css'
      }
    },
    cssmin: {
      options: {
        preserveLicenseComments: false
      },
      production: {
        src: 'public/css/sarbotte.css',
        dest: 'public/css/sarbotte.min.css'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-css');

  // Task definition.
  grunt.registerTask('default', ['jshint', 'less', 'concat', 'cssmin']);
  grunt.registerTask('heroku', ['less', 'concat', 'cssmin', 'uglify', 'requirejs']);
  grunt.registerTask('travis', ['jshint']);

};