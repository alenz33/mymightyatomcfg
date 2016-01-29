(function() {
  var $, RstPreviewView, createRstPreviewView, fs, isRstPreviewView, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  fs = require('fs-plus');

  $ = require('atom-space-pen-views').$;

  RstPreviewView = null;

  renderer = null;

  createRstPreviewView = function(state) {
    if (RstPreviewView == null) {
      RstPreviewView = require('./rst-preview-view');
    }
    return new RstPreviewView(state);
  };

  isRstPreviewView = function(object) {
    if (RstPreviewView == null) {
      RstPreviewView = require('./rst-preview-view');
    }
    return object instanceof RstPreviewView;
  };

  atom.deserializers.add({
    name: 'RstPreviewView',
    deserialize: function(state) {}
  });

  module.exports = {
    config: {
      breakOnSingleNewline: {
        type: 'boolean',
        "default": false
      },
      liveUpdate: {
        type: 'boolean',
        "default": true
      },
      grammars: {
        type: 'array',
        "default": ['source.rst', 'text.plain', 'text.plain.null-grammar', 'text.restructuredtext']
      }
    },
    activate: function() {
      var previewFile;
      atom.commands.add('atom-workspace', {
        'rst-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      ({
        'rst-preview:copy-html': (function(_this) {
          return function() {
            return _this.copyHtml();
          };
        })(this),
        'rst-preview:toggle-break-on-single-newline': function() {
          var keyPath;
          return keyPath = 'rst-preview.breakOnSingleNewline';
        }
      });
      previewFile = this.previewFile.bind(this);
      atom.commands.add('.tree-view .file .name[data-name$=\\.rst]', 'rst-preview:preview-file', previewFile);
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, _ref;
        try {
          _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'rst-preview:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (_error) {
          error = _error;
          return;
        }
        if (host === 'editor') {
          return new createRstPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          return new createRstPreviewView({
            filePath: pathname
          });
        }
      });
    },
    toggle: function() {
      var editor, grammars, _ref, _ref1;
      if (isRstPreviewView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('rst-preview.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    uriForEditor: function(editor) {
      return "rst-preview://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        previewPane.destroyItem(previewPane.itemForURI(uri));
        return true;
      } else {
        return false;
      }
    },
    addPreviewForEditor: function(editor) {
      var previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).done(function(rstPreviewView) {
        if (isRstPreviewView(rstPreviewView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(_arg) {
      var editor, filePath, target, _i, _len, _ref;
      target = _arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("rst-preview://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    },
    copyHtml: function() {
      var editor, text;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (renderer == null) {
        renderer = require('./renderer');
      }
      text = editor.getSelectedText() || editor.getText();
      return renderer.toHTML(text, editor.getPath(), editor.getGrammar(), (function(_this) {
        return function(error, html) {
          if (error) {
            return console.warn('Copying Rst as HTML failed', error);
          } else {
            return atom.clipboard.write(html);
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcnN0LXByZXZpZXcvbGliL3JzdC1wcmV2aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBRkQsQ0FBQTs7QUFBQSxFQUlBLGNBQUEsR0FBaUIsSUFKakIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxJQUxYLENBQUE7O0FBQUEsRUFPQSxvQkFBQSxHQUF1QixTQUFDLEtBQUQsR0FBQTs7TUFDckIsaUJBQWtCLE9BQUEsQ0FBUSxvQkFBUjtLQUFsQjtXQUNJLElBQUEsY0FBQSxDQUFlLEtBQWYsRUFGaUI7RUFBQSxDQVB2QixDQUFBOztBQUFBLEVBV0EsZ0JBQUEsR0FBbUIsU0FBQyxNQUFELEdBQUE7O01BQ2pCLGlCQUFrQixPQUFBLENBQVEsb0JBQVI7S0FBbEI7V0FDQSxNQUFBLFlBQWtCLGVBRkQ7RUFBQSxDQVhuQixDQUFBOztBQUFBLEVBZUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sZ0JBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSxTQUFDLEtBQUQsR0FBQSxDQURiO0dBREYsQ0FmQSxDQUFBOztBQUFBLEVBbUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BREY7QUFBQSxNQUdBLFVB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

//# sourceURL=/home/alenz/.atom/packages/rst-preview/lib/rst-preview.coffee
