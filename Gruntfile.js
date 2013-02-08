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
      compile:{
        options:{
          name: 'sqt',
          mainConfigFile: 'public/scripts/sqt.js',
          optimize: 'uglify2',
          out: 'public/scripts/sqt.min.js',
          wrap: true,
          preserveLicenseComments: false
        }
      }
    }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task.
  grunt.registerTask('default', ['jshint', 'requirejs']);

};