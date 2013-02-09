
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
    $.ajax({
      url: "/sqt",
      method: 'post',
      data: {sarbotte: editor.getValue()}
    }).done(function(data){
      updateSqiDisplay(data.sqr);
    });
  }, 1000));

   // Update sqi display
  var updateSqiDisplay = function(sqr){
    $('#total').html(sqr.totalLength);
    $('#jsAndCss').html(sqr.jsAndCssLength);
    $('#sqi').html(Math.round(sqr.sqi*100)/100);
  };

  // Initialize sqi initial values
  $(function(){

    updateSqiDisplay({
      totalLength: 208,
      jsAndCssLength: 47,
      sqi: 77.40
    });

    $(window).on('resize', function() {
      var h;
      h = $(window).height() - 330;
      if (h < 500) {
        h = 500;
      }
      $("#editors").css({
        height: h
      });
      editor.resize();
    });

    $(window).trigger('resize');

  });




});
