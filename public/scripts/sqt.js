
require.config({
  paths: {
    ace: 'lib/ace',
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
    ga: 'http://www.google-analytics.com/ga.js'
  }
});

requirejs(

  ['require_ga', 'sarbotte_editor', 'jquery', 'helpers/debounce', 'helpers/each', 'text!sqt.html'],

  function (ga, SarbotteEditor, $, debounce, each, exampleContent) {

    var content = exampleContent,
      id = 'editor',
      sarbotteEditor = new SarbotteEditor(id, content),
      editor = sarbotteEditor.editor;

    var resetResultDisplay = function () {
      $('#total, #jsAndCss, #sqi .sqi').html('n/a');
      $('#sqi .comment').html('');
      $('#sqi .sqi').css('color', '#DEDEDE');
      $('.result-tr').remove();
      $('.result-header').css('display', 'none');
    };

    editor.getSession().on('change', debounce(function () {
      var text = editor.getValue();
      if (text !== '') {
        $.ajax({
          url: '/sqt',
          method: 'post',
          data: {sarbotte: text}
        }).done(function (data) {
          _gaq.push(['_trackEvent', 'SQT', 'Result', data.sqr.sqi]);
          updateSqiDisplay(data.sqr);
        }).fail(function () {
          resetResultDisplay();
        });
      } else {
        resetResultDisplay();
      }
    }, 1000));

    var sqiDisplaySettings = {
      40: {color: '#F22E2E', message: 'Really?'},
      50: {color: '#F25F2E', message: 'Go back to work...'},
      60: {color: '#F29B30', message: 'Quality ain\'t no game.'},
      70: {color: '#F2B33D', message: 'Try harder.'},
      80: {color: '#B1BF6E', message: 'Getting close.'},
      90: {color: '#718F2F', message: 'Good to go!'},
      100: {color: '#2A8F2F', message: 'Sarbotte approved.'}
    };

    // Get closest sqi score
    var getClosestSqiScore = function (sqi) {
      var sqiDisplaySetting  =
        sqi <= 50 ? sqiDisplaySettings[40] :
        sqi < 60 ? sqiDisplaySettings[50] :
        sqi < 70 ? sqiDisplaySettings[60] :
        sqi < 80 ? sqiDisplaySettings[70] :
        sqi < 90 ? sqiDisplaySettings[80] :
        sqi < 100 ? sqiDisplaySettings[90] :
        sqiDisplaySettings[100];
      return sqiDisplaySetting;
    };

     // Update sqi display
    var updateSqiDisplay = function (sqr) {
      var sqiDisplaySetting = getClosestSqiScore(sqr.sqi);
      $('#total').html(sqr.totalLength);
      $('#jsAndCss').html(sqr.jsAndCssLength);
      $('#sqi .sqi').html((Math.round(sqr.sqi * 100) / 100).toFixed(2))
        .css('color', sqiDisplaySetting.color);
      $('#sqi .comment').html(sqiDisplaySetting.message);
    };

     // Update sqi display
    var updateSqiDetailsDisplay = function (result) {
      var details = $('#result .details table');
      $('.result-header').css('display', 'block');
      $('.result-tr').remove();
      each(result, function (el) {
        details.append('<tr class="result-tr"><td><pre>' + el.uri + '</pre></td><td class="sqi">' + el.sqi + '</td></tr>');
      });
    };

    // Initialize sqi initial values
    $(function () {

      updateSqiDisplay({
        totalLength: 779,
        jsAndCssLength: 124,
        sqi: 84.08
      });

      $(window).on('resize', function () {
        var h = $(window).height() > 880 ? $(window).height() - 330 : 500;
        $('#editors').css({ height: h });
        editor.resize();
      });

      $(window).trigger('resize');

      $('#sqsite').on('submit', function () {

        var self = this;
        
        if ($('input[name="url"]', self).val()) {
          $('button', self).html('Pending...').attr('disabled', 'disabled');
          $.ajax({
            url: '/sqt',
            method: 'post',
            data: {
              curly: $('input[name="url"]', self).val(),
              depth: $('input[name="depth"]', self).val()
            }
          }).done(function (data) {
            _gaq.push(['_trackEvent', 'SQT - Site', 'Result', data.sqr.average.sqi]);
            updateSqiDisplay(data.sqr.average);
            updateSqiDetailsDisplay(data.sqr.result);
            $('button', self).html('Ok').removeAttr('disabled');
          }).fail(function ()     {
            resetResultDisplay();
            $('button', self).html('Ok').removeAttr('disabled');
          });
        } else {
          $('#total, #jsAndCss, #sqi .sqi').html('n/a');
          $('#sqi .comment').html('');
          $('#sqi .sqi').css('color', '#DEDEDE');
        }

        return false;

      });

      $('.openSite').on('click', function () {
        $('#editor').css('display', 'none');
        $('#site').css('display', 'block');
        resetResultDisplay();
      });

      $('.openCode').on('click', function () {
        $('#editor').css('display', 'block');
        $('#site').css('display', 'none');
        resetResultDisplay();
      });

    });

  }

);
