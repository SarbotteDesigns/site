define(

  'sarbotte_editor',

  ['ace/editor', 'ace/virtual_renderer', 'ace/document', 'ace/edit_session', 'ace/mode/html', 'ace/theme/clouds'],

  function(aceEditor, aceVirtualRenderer, aceDocument, aceEditSession, aceHtml, aceClouds){

    function SarbotteEditor(id, content){

      // Ace objects
      var Editor = aceEditor.Editor,
        VirtualRenderer = aceVirtualRenderer.VirtualRenderer,
        Document = aceDocument.Document,
        EditSession = aceEditSession.EditSession,
        HtmlMode = aceHtml.Mode;

      // Editor initilization
      var editorDocument = new Document(content),
        htmlMode = new HtmlMode(),
        editSession = new EditSession(editorDocument, htmlMode),
        virtualRenderer = new VirtualRenderer(document.getElementById(id), aceClouds);

      this.editor = new Editor(virtualRenderer, editSession);

      // Set editor settings
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setHScrollBarAlwaysVisible(false);
      this.editor.renderer.setShowGutter(false);
      this.editor.setHighlightActiveLine(false);

    }

    return SarbotteEditor;

  }

);