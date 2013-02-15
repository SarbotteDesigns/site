module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'Gruntfile.js',
        'public/scripts/sqt.js',
        'public/scripts/sarbotte_editor.js',
        'public/scripts/require_ga.js',
        'public/scripts/test/**/*.js'
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
        predef: [
          'requirejs', 'require', 'define',
          'module',
          '_gaq'
        ]
      }
    },
    requirejs: {
      production: {
        options: {
          name: 'sqt',
          mainConfigFile: 'public/scripts/sqt.js',
          optimize: 'uglify2',
          out: 'public/scripts/sqt.min.js',
          wrap: true,
          preserveLicenseComments: false,
          optimizeAllPluginResources: true,
          paths: {
            jquery: 'empty:'
          }
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
      production: {
        src: 'public/css/sarbotte.css',
        dest: 'public/css/sarbotte.min.css'
      }
    }
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-css');

  // Task definition.
  grunt.registerTask('default', ['jshint', 'less', 'concat', 'cssmin']);
  grunt.registerTask('heroku', ['jshint', 'less', 'concat', 'cssmin', 'requirejs']);

};