(function() {
  var helper, operatorConfig;

  helper = require('./helper');

  operatorConfig = require('./operator-config');

  module.exports = {

    /*
    @name formatRange
    @description
    Align character within a certain range of text in the editor
    @param {Editor} editor
    @param {Range} range
    @param {string} character
    @param {Array} offsets
    @param {Object} sectionizedLines
     */
    formatRange: function(editor, range, character, offsets, sectionizedLines) {
      var alignment, before, canAlignWith, config, currentLine, currentRow, i, j, leftSpace, lineCharacter, newSpace, offset, rightSpace, scope, section, sectionizedLine, textBlock, tokenizedLine, type, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2, _ref3;
      scope = editor.getRootScopeDescriptor().getScopeChain();
      config = operatorConfig.getConfig(character, scope);
      textBlock = "";
      _ref = range.getRows();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        currentRow = _ref[_i];
        tokenizedLine = helper.getTokenizedLineForBufferRow(editor, currentRow);
        lineCharacter = helper.getAlignCharacter(editor, currentRow);
        canAlignWith = operatorConfig.canAlignWith(character, lineCharacter, config);
        if (!lineCharacter || !canAlignWith || tokenizedLine.isComment()) {
          textBlock += editor.lineTextForBufferRow(currentRow);
          if (currentRow !== range.end.row) {
            textBlock += "\n";
          }
          continue;
        }
        sectionizedLine = sectionizedLines[currentRow];
        currentLine = "";
        _ref1 = sectionizedLine.sections;
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          section = _ref1[i];
          offset = section.offset + (sectionizedLine.hasPrefix() ? 1 : 0);
          newSpace = "";
          for (j = _k = 1, _ref2 = offsets[i] - offset; _k <= _ref2; j = _k += 1) {
            newSpace += " ";
          }
          if (config.multiple) {
            type = isNaN(+section.before) ? "string" : "number";
            alignment = ((_ref3 = config.multiple[type]) != null ? _ref3.alignment : void 0) || "left";
          } else {
            alignment = config.alignment;
          }
          leftSpace = alignment === "left" ? newSpace : "";
          if (config.leftSpace) {
            leftSpace += " ";
          }
          rightSpace = alignment === "right" ? newSpace : "";
          if (config.rightSpace && !(config.multiple && i === 0)) {
            rightSpace += " ";
          }
          if (config.multiple) {
            before = section.before;
            if (i > 0) {
              before = before.trim();
            }
            currentLine += rightSpace + before;
            if (i !== sectionizedLine.length - 1) {
              currentLine += leftSpace + lineCharacter;
            }
          } else {
            currentLine += section.before;
            currentLine += leftSpace + lineCharacter + rightSpace;
            currentLine += section.after;
          }
        }
        textBlock += currentLine;
        if (currentRow !== range.end.row) {
          textBlock += "\n";
        }
      }
      range.start.column = 0;
      range.end.column = Infinity;
      editor.setTextInBufferRange(range, textBlock);
      editor.setCursorBufferPosition(range.end);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvZm9ybWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBaUIsT0FBQSxDQUFRLFVBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBRGpCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUE7QUFBQTs7Ozs7Ozs7O09BQUE7QUFBQSxJQVVBLFdBQUEsRUFBYSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFNBQWhCLEVBQTJCLE9BQTNCLEVBQW9DLGdCQUFwQyxHQUFBO0FBQ1gsVUFBQSxtUEFBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQStCLENBQUMsYUFBaEMsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBWSxjQUFjLENBQUMsU0FBZixDQUF5QixTQUF6QixFQUFvQyxLQUFwQyxDQURaLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxFQUZaLENBQUE7QUFJQTtBQUFBLFdBQUEsMkNBQUE7OEJBQUE7QUFDRSxRQUFBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLDRCQUFQLENBQW9DLE1BQXBDLEVBQTRDLFVBQTVDLENBQWhCLENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLGlCQUFQLENBQXlCLE1BQXpCLEVBQWlDLFVBQWpDLENBRGhCLENBQUE7QUFBQSxRQUVBLFlBQUEsR0FBZ0IsY0FBYyxDQUFDLFlBQWYsQ0FBNEIsU0FBNUIsRUFBdUMsYUFBdkMsRUFBc0QsTUFBdEQsQ0FGaEIsQ0FBQTtBQUlBLFFBQUEsSUFBRyxDQUFBLGFBQUEsSUFBcUIsQ0FBQSxZQUFy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

//# sourceURL=/home/alenz/.atom/packages/aligner/lib/formatter.coffee
