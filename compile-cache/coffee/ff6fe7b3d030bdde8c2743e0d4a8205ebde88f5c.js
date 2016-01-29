(function() {
  var CompositeDisposable, Point, RowMap, createElementsForGuides, getGuides, styleGuide, _, _ref, _ref1;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point;

  _ = require('lodash');

  _ref1 = require('./indent-guide-improved-element'), createElementsForGuides = _ref1.createElementsForGuides, styleGuide = _ref1.styleGuide;

  getGuides = require('./guides.coffee').getGuides;

  RowMap = require('./row-map.coffee');

  module.exports = {
    activate: function(state) {
      var handleEvents, msg, updateGuide;
      this.currentSubscriptions = [];
      atom.config.set('editor.showIndentGuide', false);
      if (!atom.config.get('editor.useShadowDOM')) {
        msg = 'To use indent-guide-improved package, please check "Use Shadow DOM" in Settings.';
        atom.notifications.addError(msg, {
          dismissable: true
        });
        return;
      }
      updateGuide = function(editor, editorElement) {
        var basePixelPos, getIndent, guides, lineHeightPixel, rowMap, scrollLeft, scrollTop, visibleRange, visibleScreenRange;
        visibleScreenRange = editorElement.getVisibleRowRange();
        if (!((visibleScreenRange != null) && (editorElement.component != null))) {
          return;
        }
        basePixelPos = editorElement.pixelPositionForScreenPosition(new Point(visibleScreenRange[0], 0)).top;
        visibleRange = visibleScreenRange.map(function(row) {
          return editor.bufferPositionForScreenPosition(new Point(row, 0)).row;
        });
        getIndent = function(row) {
          if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
            return null;
          } else {
            return editor.indentationForBufferRow(row);
          }
        };
        scrollTop = editorElement.getScrollTop();
        scrollLeft = editorElement.getScrollLeft();
        rowMap = new RowMap(editor.displayBuffer.rowMap.getRegions());
        guides = getGuides(visibleRange[0], visibleRange[1], editor.getLastBufferRow(), editor.getCursorBufferPositions().map(function(point) {
          return point.row;
        }), getIndent);
        lineHeightPixel = editor.getLineHeightInPixels();
        return createElementsForGuides(editorElement, guides.map(function(g) {
          return function(el) {
            return styleGuide(el, g.point.translate(new Point(visibleRange[0], 0)), g.length, g.stack, g.active, editor, rowMap, basePixelPos, lineHeightPixel, visibleScreenRange[0], scrollTop, scrollLeft);
          };
        }));
      };
      handleEvents = (function(_this) {
        return function(editor, editorElement) {
          var subscriptions, up, update;
          up = function() {
            return updateGuide(editor, editorElement);
          };
          update = _.throttle(up, 30);
          subscriptions = new CompositeDisposable;
          subscriptions.add(editor.onDidChangeCursorPosition(update));
          subscriptions.add(editorElement.onDidChangeScrollTop(update));
          subscriptions.add(editorElement.onDidChangeScrollLeft(update));
          subscriptions.add(editor.onDidStopChanging(update));
          subscriptions.add(editor.onDidDestroy(function() {
            _this.currentSubscriptions.splice(_this.currentSubscriptions.indexOf(subscriptions), 1);
            return subscriptions.dispose();
          }));
          return _this.currentSubscriptions.push(subscriptions);
        };
      })(this);
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement;
        if (editor == null) {
          return;
        }
        editorElement = atom.views.getView(editor);
        if (editorElement == null) {
          return;
        }
        return handleEvents(editor, editorElement);
      });
    },
    deactivate: function() {
      this.currentSubscriptions.forEach(function(s) {
        return s.dispose();
      });
      return atom.workspace.getTextEditors().forEach(function(te) {
        var v;
        v = atom.views.getView(te);
        if (!v) {
          return;
        }
        return Array.prototype.forEach.call(v.querySelectorAll('.indent-guide-improved'), function(e) {
          return e.parentNode.removeChild(e);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBOztBQUFBLEVBQUEsT0FBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBQXRCLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEVBR0EsUUFBd0MsT0FBQSxDQUFRLGlDQUFSLENBQXhDLEVBQUMsZ0NBQUEsdUJBQUQsRUFBMEIsbUJBQUEsVUFIMUIsQ0FBQTs7QUFBQSxFQUlDLFlBQWEsT0FBQSxDQUFRLGlCQUFSLEVBQWIsU0FKRCxDQUFBOztBQUFBLEVBS0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxrQkFBUixDQUxULENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLDhCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsRUFBeEIsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxLQUExQyxDQUhBLENBQUE7QUFLQSxNQUFBLElBQUEsQ0FBQSxJQUFXLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQVA7QUFDRSxRQUFBLEdBQUEsR0FBTSxrRkFBTixDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLEdBQTVCLEVBQWlDO0FBQUEsVUFBQyxXQUFBLEVBQWEsSUFBZDtTQUFqQyxDQURBLENBQUE7QUFFQSxjQUFB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

//# sourceURL=/home/alenz/.atom/packages/indent-guide-improved/lib/indent-guide-improved.coffee
