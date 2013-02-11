module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'public/scripts/sqt.js', 'public/scripts/test/**/*.js'],
      options: {
        browser: true
      }
    },
    requirejs: {
      production: {
        options:{
          name: 'sqt',
          mainConfigFile: 'public/scripts/sqt.js',
          optimize: 'uglify2',
          out: 'public/scripts/sqt.min.js',
          wrap: true,
          preserveLicenseComments: false,
          optimizeAllPluginResources: true
        }
      }
    },
    less:{
      files: {
        "public/css/sqt.css": "public/css/sqt.less"
      }
    },
    concat:{
      production: {
        src: [
          'public/css/global.css',
          'public/css/layout.css',
          'public/css/bootstrap.css',
          'public/css/sqt.css'
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
  grunt.registerTask('production', ['jshint', 'less', 'concat', 'cssmin', 'requirejs']);

};