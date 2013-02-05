
(function(){

  require.config({
    //baseUrl: window.location.protocol + "//" + window.location.host +
    //    window.location.pathname.split("/").slice(0, -1).join("/"),
    paths: {
        ace: "lib/ace"
    }
  });


  requirejs(['ace/ace', 'ace/mode/javascript_worker'], function(ace) {

    require("ace/edit_session").EditSession.prototype.$startWorker = function(){}
    var editor = ace.edit("editor");
    editor.setShowPrintMargin(false);
    editor.renderer.setHScrollBarAlwaysVisible(false);
    editor.renderer.setShowGutter(false);
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/xml");

  });

})();