
require.config({
  paths: {
    ace: "lib/ace",
    jquery: 'lib/jquery/jquery'
  }
});

requirejs(['sarbotte_editor', 'jquery', 'helpers/debounce'], function(SarbotteEditor, $, debounce) {

  var content = '<html>\n    <head>\n        <title>Sarbotte Quality Test</title>\n        <script>\n            console.log("page init");\n        </script>\n    </head>\n    <body>\n        Sarbotte Quality Test\n    </body>\n</html>',
    id = "editor",
    sarbotteEditor = new SarbotteEditor(id, content),
    editor = sarbotteEditor.editor;

  editor.getSession().on("change", debounce(function(){
    var text = editor.getValue();
    if(text !== ""){
      $.ajax({
        url: "/sqt",
        method: 'post',
        data: {sarbotte: text}
      }).done(function(data){
        updateSqiDisplay(data.sqr);
      });
    }else{
      $('#total, #jsAndCss, #sqi .sqi').html('n/a');
      $('#sqi .comment').html('');
      $('#sqi .sqi').css('color', '#DEDEDE');
    }
  }, 1000));

   // Update sqi display
  var updateSqiDisplay = function(sqr){
    var sqiDisplaySetting = getClosestSqiScore(sqr.sqi);
    $('#total').html(sqr.totalLength);
    $('#jsAndCss').html(sqr.jsAndCssLength);
    $('#sqi .sqi').html( (Math.round(sqr.sqi*100)/100).toFixed(2) )
      .css('color', sqiDisplaySetting.color);
    $('#sqi .comment').html(sqiDisplaySetting.message);
  };

   var sqiDisplaySettings = {
    50: {color: "#F22E2E", message: "Really?"},
    60: {color: "#F29B30", message: "Go back to work..."},
    70: {color: "#F2B33D", message: "Quality ain't no game."},
    80: {color: "#B1BF6E", message: "Getting close."},
    90: {color: "#718F2F", message: "Good to go!"},
    100: {color: "#2A8F2F", message: "Sarbotte approved."}
  };

  // Get closest sqi score
  var getClosestSqiScore = function(sqi){
    var sqiDisplaySetting  =
      sqi <= 50 ? sqiDisplaySettings[50] :
      sqi < 70 ? sqiDisplaySettings[60] :
      sqi < 80 ? sqiDisplaySettings[70] :
      sqi < 90 ? sqiDisplaySettings[80] :
      sqi < 100 ? sqiDisplaySettings[90] :
      sqiDisplaySettings[100];
    return sqiDisplaySetting;
  };

  // Initialize sqi initial values
  $(function(){

    updateSqiDisplay({
      totalLength: 208,
      jsAndCssLength: 47,
      sqi: 77.40
    });

    $(window).on('resize', function() {
      var h = $(window).height() > 880 ? $(window).height() - 330 : 500;
      $("#editors").css({ height: h });
      editor.resize();
    });

    $(window).trigger('resize');

  });




});
