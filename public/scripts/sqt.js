
(function(){

  // From underscore.js
  debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  require.config({
    paths: {
        ace: "lib/ace",
        jquery: 'lib/jquery/jquery'
    }
  });

  requirejs(['ace/ace', 'jquery'], function(ace, $) {

    require("ace/edit_session").EditSession.prototype.$startWorker = function(){};
    var editor = ace.edit("editor");
    editor.setShowPrintMargin(false);
    editor.renderer.setHScrollBarAlwaysVisible(false);
    editor.renderer.setShowGutter(false);
    editor.setHighlightActiveLine(false);
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/html");
    editor.renderer.setPadding(20);
    editor.getSession().on("change", debounce(function(){
        $.ajax({
          url: "/sqt",
          method: 'post',
          data: {sarbotte: editor.getValue()}
        }).done(function(data){
          $('#total').html(data.sqr.totalLength);
          $('#jsAndCss').html(data.sqr.jsAndCssLength);
          $('#sqi').html(Math.round(data.sqr.sqi*100)/100);
        });
    }, 1000));

  });

})();