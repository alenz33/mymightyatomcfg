(function() {
  var path;

  path = require('path');

  describe("Aligner", function() {
    var editor, editorView, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1], editorView = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.project.setPaths([path.join(__dirname, 'fixtures')]);
      waitsForPromise(function() {
        return atom.packages.activatePackage('aligner');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.workspace.open('aligner-sample.coffee');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorView = atom.views.getView(editor);
      });
    });
    it("should align two lines correctly", function() {
      editor.setCursorBufferPosition([0, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(1)).toBe('test    = "321"');
    });
    it("should align correctly", function() {
      editor.setCursorBufferPosition([6, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(6)).toBe("  foo:        bar");
    });
    it("should ailgn correctly with config update", function() {
      editor.setCursorBufferPosition([6, 1]);
      atom.config.set('aligner.:-alignment', 'left');
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(6)).toBe("  foo       : bar");
    });
    it("should not align anything when cursor is not within string", function() {
      editor.setCursorBufferPosition([3, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(1)).toBe('test = "321"');
    });
    it("should handle prefix block correctly", function() {
      editor.setCursorBufferPosition([10, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(10)).toBe('longPrefix  = "test"');
    });
    it("should handle prefix correctly", function() {
      editor.setCursorBufferPosition([10, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(11)).toBe('prefix     += "hello"');
    });
    it("should know how to align operator with no space", function() {
      editor.setCursorBufferPosition([13, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(13)).toBe('noSpace = "work"');
    });
    it("should only align the first ':'", function() {
      editor.setCursorBufferPosition([16, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(16)).toBe('  hello:   {not: "world"}');
    });
    it("should align multiple items correctly", function() {
      editor.setCursorBufferPosition([20, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(21)).toBe('  ["abc"  , 19293, 102304, "more"]');
    });
    it("should align and keep the same indentation", function() {
      editor.setCursorBufferPosition([24, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(24)).toBe('    test    = "123"');
    });
    it("should align and keep the same indentation", function() {
      atom.config.set('editor.softTabs', false);
      editor.setCursorBufferPosition([24, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(24)).toBe('    test    = "123"');
    });
    it("should align multiple cursor correctly", function() {
      editor.setCursorBufferPosition([0, 1]);
      editor.addCursorAtBufferPosition([6, 1]);
      editor.addCursorAtBufferPosition([10, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      expect(editor.lineTextForBufferRow(1)).toBe('test    = "321"');
      expect(editor.lineTextForBufferRow(6)).toBe("  foo:        bar");
      return expect(editor.lineTextForBufferRow(10)).toBe('longPrefix  = "test"');
    });
    it("should align multiple blocks across comments", function() {
      editor.setCursorBufferPosition([31, 0]);
      atom.commands.dispatch(editorView, 'aligner:align');
      expect(editor.lineTextForBufferRow(31)).toBe("  black:  '#000000'");
      expect(editor.lineTextForBufferRow(32)).toBe("  # block 2");
      return expect(editor.lineTextForBufferRow(38)).toBe("  yellow: '#F6FF00'");
    });
    it("should align multiple blocks across comments when invisibes are on", function() {
      atom.config.set('editor.showInvisibles', true);
      atom.config.set('editor.softTabs', false);
      editor.setCursorBufferPosition([31, 0]);
      atom.commands.dispatch(editorView, 'aligner:align');
      expect(editor.lineTextForBufferRow(31)).toBe("  black:  '#000000'");
      expect(editor.lineTextForBufferRow(32)).toBe("  # block 2");
      return expect(editor.lineTextForBufferRow(38)).toBe("  yellow: '#F6FF00'");
    });
    it("should align multiple selections", function() {
      editor.setSelectedBufferRanges([[[30, 0], [32, 0]], [[6, 0], [8, 0]]]);
      atom.commands.dispatch(editorView, 'aligner:align');
      expect(editor.lineTextForBufferRow(6)).toBe("  foo:        bar");
      expect(editor.lineTextForBufferRow(7)).toBe("  helloworld: test");
      expect(editor.lineTextForBufferRow(8)).toBe("  star:       war");
      expect(editor.lineTextForBufferRow(30)).toBe("  white:      '#FFFFFF'");
      expect(editor.lineTextForBufferRow(31)).toBe("  black:      '#000000'");
      return expect(editor.lineTextForBufferRow(32)).toBe("  # block 2");
    });
    return it("should maintain the same indentations after aligning", function() {
      editor.setSelectedBufferRanges([[[6, 2], [7, 0]]]);
      atom.commands.dispatch(editorView, 'aligner:align');
      expect(editor.lineTextForBufferRow(6)).toBe("  foo:        bar");
      return expect(editor.lineTextForBufferRow(7)).toBe("  helloworld: test");
    });
  });

  describe("Aligning javascript", function() {
    var editor, editorView, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1], editorView = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.project.setPaths([path.join(__dirname, 'fixtures')]);
      waitsForPromise(function() {
        return atom.packages.activatePackage('aligner');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.workspace.open('aligner-sample.js');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorView = atom.views.getView(editor);
      });
    });
    it("should align two lines correctly", function() {
      editor.setCursorBufferPosition([0, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(0)).toBe('var test   = "hello";');
    });
    it("should align ':' which isn't tokenized with scope", function() {
      editor.setCursorBufferPosition([5, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(5)).toBe('  "foo":   "bar"');
    });
    return it("should align ',' correctly", function() {
      editor.setCursorBufferPosition([9, 1]);
      atom.commands.dispatch(editorView, 'aligner:align');
      return expect(editor.lineTextForBufferRow(10)).toBe('  ["3"    , 2, 4]');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL2FsaWduZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSwwQ0FBQTtBQUFBLElBQUEsT0FBeUMsRUFBekMsRUFBQyxnQkFBRCxFQUFTLDBCQUFULEVBQTJCLG9CQUEzQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixVQUFyQixDQUFELENBQXRCLENBRkEsQ0FBQTtBQUFBLE1BSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsU0FBOUIsRUFEYztNQUFBLENBQWhCLENBSkEsQ0FBQTtBQUFBLE1BT0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsd0JBQTlCLEVBRGM7TUFBQSxDQUFoQixDQVBBLENBQUE7QUFBQSxNQVVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHVCQUFwQixFQURjO01BQUEs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

//# sourceURL=/home/alenz/.atom/packages/aligner/spec/aligner-spec.coffee