(function() {
  var PythonDebuggerView;

  PythonDebuggerView = require('./python-debugger-view');

  module.exports = {
    pythonDebuggerView: null,
    activate: function() {
      atom.commands.add('atom-workspace', "python-debugger:insert", (function(_this) {
        return function() {
          return _this.insert();
        };
      })(this));
      return atom.commands.add('atom-workspace', "python-debugger:remove", (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    },
    insert: function() {
      var IMPORT_STATEMENT, cursor, cursors, editor, index, insert_position, line, options, saved_positions, _i, _j, _len, _len1, _results;
      IMPORT_STATEMENT = "import ipdb\n";
      editor = atom.workspace.getActivePaneItem();
      cursors = editor.getCursors();
      saved_positions = [];
      for (_i = 0, _len = cursors.length; _i < _len; _i++) {
        cursor = cursors[_i];
        cursor.moveToFirstCharacterOfLine();
        saved_positions.push(cursor.getBufferPosition());
      }
      editor.insertText("ipdb.set_trace()  ######### Break Point ###########\n", options = {
        "autoIndentNewline": true,
        "autoIndent": true
      });
      editor.moveToTop();
      insert_position = editor.getCursorBufferPosition();
      editor.moveToBeginningOfLine();
      editor.selectToEndOfLine();
      line = editor.getSelectedText();
      while ((line.startsWith("#")) || (line.startsWith("from __future__")) || (!line)) {
        editor.moveToBeginningOfLine();
        editor.moveCursorDown();
        editor.selectToEndOfLine();
        if (line) {
          insert_position = editor.getCursorBufferPosition();
        }
        line = editor.getSelectedText();
      }
      editor.setCursorBufferPosition(insert_position);
      if (!(IMPORT_STATEMENT.startsWith(line))) {
        editor.moveToBeginningOfLine();
        editor.insertText(IMPORT_STATEMENT);
      }
      _results = [];
      for (index = _j = 0, _len1 = cursors.length; _j < _len1; index = ++_j) {
        cursor = cursors[index];
        _results.push(cursor.setBufferPosition(saved_positions[index]));
      }
      return _results;
    },
    remove: function() {
      var editor, match, matches, _i, _len, _results;
      editor = atom.workspace.getActivePaneItem();
      console.log('removing all imports');
      matches = [];
      editor.buffer.backwardsScan(/ipdb/g, function(match) {
        return matches.push(match);
      });
      _results = [];
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        console.log(match);
        editor.setCursorScreenPosition([match.range.start.row, 1]);
        _results.push(editor.deleteLine());
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYXRvbS1weXRob24tZGVidWdnZXIvbGliL3B5dGhvbi1kZWJ1Z2dlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHdCQUFwQyxFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlELENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msd0JBQXBDLEVBQThELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsRUFGUTtJQUFBLENBRlY7QUFBQSxJQU1BLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixVQUFBLGdJQUFBO0FBQUEsTUFBQSxnQkFBQSxHQUFtQixlQUFuQixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FGVixDQUFB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

//# sourceURL=/home/alenz/.atom/packages/atom-python-debugger/lib/python-debugger.coffee
