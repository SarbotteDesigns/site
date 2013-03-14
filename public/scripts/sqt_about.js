require.config({
  paths: {
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
    ga: 'http://www.google-analytics.com/ga.js',
    jmpress: 'lib/jmpress/jmpress'
  }
});

requirejs(

  ['jquery', 'jmpress'],

  function ($) {

    'use strict';

    $(function () {

        $.jmpress('template', 'mytemplate', {
          x: 0,
          y: -1000,
          scale: 1,
          children: function (idx) {
            return {
              y: 400 + idx * 100,
              x: -300 + idx * 100,
              z: 0 - idx * 500,
              template: 'mytemplate',
              scale: 0.3
            };
          }
        });

        $.jmpress('template', 'basic', {
          x: 0,
          y: 0,
          scale: 1,
          children: function (idx) {
            return {
              x: 0 + idx * 1000,
              template: 'basic',
              scale: 1
            };
          }
        });

        $('#jmpress').jmpress({fullscreen: true});

      });

  }

);