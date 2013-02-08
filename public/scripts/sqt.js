
require.config({
  paths: {
    ace: "lib/ace",
    jquery: 'lib/jquery/jquery'
  }
});

requirejs(['ace/ace', 'ace/mode/html', 'ace/theme/clouds', 'jquery', 'helpers/debounce'], function(ace, html, clouds, $, debounce) {

  // Ace objects
  var Editor = require('ace/editor').Editor,
    VirtualRenderer = require('ace/virtual_renderer').VirtualRenderer,
    Document = require('ace/document').Document,
    EditSession = require('ace/edit_session').EditSession,
    HtmlMode = html.Mode;

  // Editor initilization
  var content = '<html>\n    <head>\n        <title>Sarbotte Quality Test</title>\n        <script>\n            console.log("page init");\n        </script>\n    </head>\n    <body>\n        Sarbotte Quality Test\n    </body>\n</html>',
    aceDocument = new Document(content),
    htmlMode = new HtmlMode(),
    editSession = new EditSession(aceDocument, htmlMode),
    virtualRenderer = new VirtualRenderer(document.getElementById('editor'), clouds),
    editor = new Editor(virtualRenderer, editSession);

  // Set editor settings
  editor.setShowPrintMargin(false);
  editor.renderer.setHScrollBarAlwaysVisible(false);
  editor.renderer.setShowGutter(false);
  editor.setHighlightActiveLine(false);
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
  });

});
