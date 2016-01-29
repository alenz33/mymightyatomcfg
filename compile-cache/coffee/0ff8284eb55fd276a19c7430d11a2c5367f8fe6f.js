(function() {
  var Point, Range, SectionizedLine, operatorConfig, _ref, _traverseRanges;

  operatorConfig = require('./operator-config');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  SectionizedLine = require('./sectionized-line');

  _traverseRanges = function(ranges, callback, context) {
    var line, output, range, rangeIndex, _i, _j, _len, _len1, _ref1;
    if (context == null) {
      context = this;
    }
    for (rangeIndex = _i = 0, _len = ranges.length; _i < _len; rangeIndex = ++_i) {
      range = ranges[rangeIndex];
      _ref1 = range.getRows();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        line = _ref1[_j];
        if ((output = callback.call(context, line, rangeIndex))) {
          return output;
        }
      }
    }
  };

  module.exports = {

    /*
    @name getAlignCharacter
    @description
    Get the character to align based on text
    @param {Editor} editor
    @param {number} row
    @returns {String} Alignment character
     */
    getAlignCharacter: function(editor, row) {
      var config, languageScope, token, tokenScope, tokenValue, tokenized, _i, _j, _len, _len1, _ref1, _ref2;
      tokenized = this.getTokenizedLineForBufferRow(editor, row);
      languageScope = editor.getRootScopeDescriptor().getScopeChain() || 'base';
      if (!tokenized) {
        return null;
      }
      _ref1 = tokenized.tokens;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        token = _ref1[_i];
        tokenValue = token.value.trim();
        config = operatorConfig.getConfig(tokenValue, languageScope);
        if (!config) {
          continue;
        }
        _ref2 = token.scopes;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          tokenScope = _ref2[_j];
          if (tokenScope.match(config.scope) != null) {
            return tokenValue;
          }
        }
      }
    },

    /*
    @name getAlignCharacterInRanges
    @description
    Get the character to align within certain ranges
    @param {Editor} editor
    @param {Array.<Range>} ranges
    @returns {String} Alignment character
     */
    getAlignCharacterInRanges: function(editor, ranges) {
      return _traverseRanges(ranges, function(line) {
        var character;
        character = this.getAlignCharacter(editor, line);
        if (character) {
          return character;
        }
      }, this);
    },

    /*
    @name getOffsetsAndSectionizedLines
    @description
    Get alignment offset and sectionizedLines based on character and selections
    @param {Editor} editor
    @param {String} character
    @param {Array.<Range>} ranges
    @returns {{offsets:<Array>, sectionizedLines:<Array>}}
     */
    getOffsetsAndSectionizedLines: function(editor, character, ranges) {
      var offsets, scope, sectionizedLines;
      scope = editor.getRootScopeDescriptor().getScopeChain();
      offsets = [];
      sectionizedLines = [];
      _traverseRanges(ranges, function(line, rangeIndex) {
        var config, sectionizedLine, tokenized;
        tokenized = this.getTokenizedLineForBufferRow(editor, line);
        config = operatorConfig.getConfig(character, scope);
        sectionizedLine = this.parseTokenizedLine(tokenized, character, config);
        if (sectionizedLines[rangeIndex] == null) {
          sectionizedLines[rangeIndex] = {};
        }
        sectionizedLines[rangeIndex][line] = sectionizedLine;
        if (sectionizedLine.isValid()) {
          this.setOffsets(offsets, sectionizedLine);
        }
      }, this);
      return {
        offsets: offsets,
        sectionizedLines: sectionizedLines
      };
    },

    /*
    @name parseTokenizedLine
    @description
    Parsing line with operator
    @param {Object} tokenizedLine Tokenized line object from editor display buffer
    @param {String} character Character to align
    @param {Object} config Character config
    @returns {SectionizedLine} Information about the tokenized line including text before character,
                      text after character, character prefix, offset and if the line is
                      valid
     */
    parseTokenizedLine: function(tokenizedLine, character, config) {
      var afterCharacter, sectionizedLine, token, tokenValue, _i, _len, _ref1;
      afterCharacter = false;
      sectionizedLine = new SectionizedLine();
      _ref1 = tokenizedLine.tokens;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        token = _ref1[_i];
        tokenValue = this._formatTokenValue(token.value, token, tokenizedLine.invisibles);
        if (operatorConfig.canAlignWith(character, tokenValue.trim(), config) && (!afterCharacter || config.multiple)) {
          sectionizedLine.prefix = operatorConfig.isPrefixed(tokenValue.trim(), config);
          if (config.multiple) {
            sectionizedLine.add();
          }
          afterCharacter = true;
        } else {
          if (afterCharacter && !config.multiple) {
            sectionizedLine.after += tokenValue;
          } else {
            sectionizedLine.before += tokenValue;
          }
        }
      }
      sectionizedLine.add();
      sectionizedLine.valid = afterCharacter;
      return sectionizedLine;
    },

    /*
    @name setOffsets
    @description
    Set alignment offset for each section
    @param {Array.<Integer>} offsets
    @param {SectionizedLine} sectionizedLine
     */
    setOffsets: function(offsets, sectionizedLine) {
      var i, section, _i, _len, _ref1, _results;
      _ref1 = sectionizedLine.sections;
      _results = [];
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        section = _ref1[i];
        if ((offsets[i] == null) || section.offset > offsets[i]) {
          _results.push(offsets[i] = section.offset);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },

    /*
    @name getSameIndentationRange
    @description To get the start and end line number of the same indentation
    @param {Editor} editor Active editor
    @param {Integer} row Row to match
    @returns {{range: Range, offset: Array}} An object with the start and end line
     */
    getSameIndentationRange: function(editor, row, character) {
      var config, end, endLine, endPoint, hasPrefix, indent, offsets, scope, sectionizedLine, sectionizedLines, start, startLine, startPoint, tokenized, total;
      start = row - 1;
      end = row + 1;
      sectionizedLines = {};
      tokenized = this.getTokenizedLineForBufferRow(editor, row);
      scope = editor.getRootScopeDescriptor().getScopeChain();
      config = operatorConfig.getConfig(character, scope);
      sectionizedLine = this.parseTokenizedLine(tokenized, character, config);
      sectionizedLines[row] = sectionizedLine;
      indent = editor.indentationForBufferRow(row);
      total = editor.getLineCount();
      hasPrefix = sectionizedLine.hasPrefix();
      offsets = [];
      startPoint = new Point(row, 0);
      endPoint = new Point(row, Infinity);
      this.setOffsets(offsets, sectionizedLine);
      while (start > -1 || end < total) {
        if (start > -1) {
          startLine = this.getTokenizedLineForBufferRow(editor, start);
          if ((startLine != null) && editor.indentationForBufferRow(start) === indent) {
            if (startLine.isComment()) {
              start -= 1;
            } else if ((sectionizedLine = this.parseTokenizedLine(startLine, character, config)) && sectionizedLine.isValid()) {
              sectionizedLines[start] = sectionizedLine;
              this.setOffsets(offsets, sectionizedLine);
              startPoint.row = start;
              if (!hasPrefix && sectionizedLine.hasPrefix()) {
                hasPrefix = true;
              }
              start -= 1;
            } else {
              start = -1;
            }
          } else {
            start = -1;
          }
        }
        if (end < total + 1) {
          endLine = this.getTokenizedLineForBufferRow(editor, end);
          if ((endLine != null) && editor.indentationForBufferRow(end) === indent) {
            if (endLine.isComment()) {
              end += 1;
            } else if ((sectionizedLine = this.parseTokenizedLine(endLine, character, config)) && sectionizedLine.isValid()) {
              sectionizedLines[end] = sectionizedLine;
              this.setOffsets(offsets, sectionizedLine);
              endPoint.row = end;
              if (!hasPrefix && sectionizedLine.hasPrefix()) {
                hasPrefix = true;
              }
              end += 1;
            } else {
              end = total + 1;
            }
          } else {
            end = total + 1;
          }
        }
      }
      if (hasPrefix) {
        offsets = offsets.map(function(item) {
          return item + 1;
        });
      }
      return {
        range: new Range(startPoint, endPoint),
        offsets: offsets,
        sectionizedLines: sectionizedLines
      };
    },

    /*
    @name getTokenizedLineForBufferRow
    @description
    Get tokenized line
    @param {Editor} editor
    @param {Integer} row
    @returns {Array}
     */
    getTokenizedLineForBufferRow: function(editor, row) {
      return editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(row);
    },

    /*
    @name _formatTokenValue
    @description
    Convert invisibles in token to spaces or tabs
    @param {String} value
    @param {Token} token
    @param {Object} invisibles
    @returns {String}
    @private
     */
    _formatTokenValue: function(value, token, invisibles) {
      var leading, trailing;
      if (!token.hasInvisibleCharacters) {
        return value;
      }
      if (token.isHardTab) {
        return "\t";
      }
      if (token.firstNonWhitespaceIndex != null) {
        leading = value.substring(0, token.firstNonWhitespaceIndex);
        leading = this._formatInvisibleSpaces(leading, invisibles);
        value = leading + value.substring(token.firstNonWhitespaceIndex);
      }
      if (token.firstTrailingWhitespaceIndex != null) {
        trailing = value.substring(token.firstTrailingWhitespaceIndex);
        trailing = this._formatInvisibleSpaces(trailing, invisibles);
        value = value.substring(0, token.firstTrailingWhitespaceIndex) + trailing;
      }
      return value;
    },

    /*
    @name _formatInvisibleSpaces
    @description
    Convert invisibles in string to text
    @param {string} string
    @param {Object} invisibles
    @returns {String}
    @private
     */
    _formatInvisibleSpaces: function(string, invisibles) {
      if (invisibles.space != null) {
        string = string.replace(new RegExp(invisibles.space, 'g'), " ");
      }
      if (invisibles.tab != null) {
        string = string.replace(new RegExp(invisibles.tab, 'g'), "\t");
      }
      return string;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FEUixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixPQUFuQixHQUFBO0FBQ2hCLFFBQUEsMkRBQUE7O01BRG1DLFVBQVU7S0FDN0M7QUFBQSxTQUFBLHVFQUFBO2lDQUFBO0FBQ0U7QUFBQSxXQUFBLDhDQUFBO3lCQUFBO0FBQ0UsUUFBQSxJQUFpQixDQUFDLE1BQUEsR0FBUyxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsSUFBdkIsRUFBNkIsVUFBN0IsQ0FBVixDQUFqQjtBQUFBLGlCQUFPLE1BQVAsQ0FBQTtTQURGO0FBQUEsT0FERjtBQUFBLEtBRGdCO0VBQUEsQ0FKbEIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0E7QUFBQTtBQUFBOzs7Ozs7O09BQUE7QUFBQSxJQVFBLGlCQUFBLEVBQW1CLFNBQUMsTUFBRCxFQUFTLEdBQVQsR0FBQTtBQUNqQixVQUFBLGtHQUFBO0FBQUEsTUFBQSxTQUFBLEdBQWdCLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixNQUE5QixFQUFzQyxHQUF0QyxDQUFoQixDQUFBO0FBQUEsTUFDQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQStCLENBQUMsYUFBaEMsQ0FBQSxDQUFBLElBQW1ELE1BRG5FLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxTQUFBO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FIQTtBQUtBO0FBQUEsV0FBQSw0Q0FBQTswQkFBQTtBQUNFLFFBQUEsVUFBQSxHQUFhLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBWixDQUFBLENBQWIsQ0FBQTtBQUFBLFFBRUEsTUFBQSxHQUFTLGNBQWMsQ0FBQyxTQUFmLENBQXlCLFVBQXpCLEVBQXFDLGFBQXJDLENBRlQsQ0FBQTtBQUdBLFFBQUEsSUFBQSxDQUFBLE1BQUE7QUFBQSxtQkFBQTtTQUhBO0FBS0E7QUFBQSxhQUFBLDhDQUFBO2lDQUFBO2NBQW9DO0FBQ2xDLG1CQUFPLFVBQVA7V0FERjtBQUFBLFNBTkY7QUFBQSxPQU5pQjtJQUFBLENBUm5CO0FBdUJBO0FBQUE7Ozs7Ozs7T0F2QkE7QUFBQSxJQStCQSx5QkFBQSxFQUEyQixTQUFDLE1BQUQsRUFBUyxNQUFULEdBQUE7YUFDekIsZUFBQSxDQUFnQixNQUFoQixFQUF3QixTQUFDLElBQUQsR0FBQTtBQUN0QixZQUFBLFNBQUE7QUFBQSxRQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkIsRUFBMkIsSUFBM0IsQ0FBWixDQUFBO0FBQ0EsUUFBQSxJQUFvQixTQUFwQjtBQUFBLGlCQUFPLFNBQVAsQ0FBQTtTQUZzQjtNQUFBLENBQXhCLEVBR0UsSUFIRixFQUR5QjtJQUFBLENBL0IzQjtBQXFDQTtBQUFBOzs7Ozs7OztPQXJDQTtBQUFBLElBOENBLDZCQUFBLEVBQStCLFNBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsTUFBcEIsR0FBQTtBQUM3QixVQUFBLGdDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQW1CLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQStCLENBQUMsYUFBaEMsQ0FBQSxDQUFuQixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQW1CLEVBRG5CLENBQUE7QUFBQSxNQUVBLGdCQUFBLEdBQW1CLEVBRm5CLENBQUE7QUFBQSxNQUlBLGVBQUEsQ0FBZ0IsTUFBaEIsRUFBd0IsU0FBQyxJQUFELEVBQU8sVUFBUCxHQUFBO0FBQ3RCLFlBQUEsa0NBQUE7QUFBQSxRQUFBLFNBQUEsR0FBa0IsSUFBQyxDQUFBLDRCQUFELENBQThCLE1BQTlCLEVBQXNDLElBQXRDLENBQWxCLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBa0IsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsU0FBekIsRUFBb0MsS0FBcEMsQ0FEbEIsQ0FBQTtBQUFBLFFBRUEsZUFBQSxHQUFrQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsU0FBcEIsRUFBK0IsU0FBL0IsRUFBMEMsTUFBMUMsQ0FGbEIsQ0FBQTs7VUFJQSxnQkFBaUIsQ0FBQSxVQUFBLElBQXFCO1NBSnRDO0FBQUEsUUFLQSxnQkFBaUIsQ0FBQSxVQUFBLENBQVksQ0FBQSxJQUFBLENBQTdCLEdBQXNDLGVBTHRDLENBQUE7QUFPQSxRQUFBLElBQXlDLGVBQWUsQ0FBQyxPQUFoQixDQUFBLENBQXpDO0FBQUEsVUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosRUFBcUIsZUFBckIsQ0FBQSxDQUFBO1NBUnNCO01BQUEsQ0FBeEIsRUFVRSxJQVZGLENBSkEsQ0FBQTtBQWdCQSxhQUFPO0FBQUEsUUFDTCxPQUFBLEVBQWtCLE9BRGI7QUFBQSxRQUVMLGdCQUFBLEVBQWtCLGdCQUZiO09BQVAsQ0FqQjZCO0lBQUEsQ0E5Qy9CO0FBb0VBO0FBQUE7Ozs7Ozs7Ozs7T0FwRUE7QUFBQSxJQStFQSxrQkFBQSxFQUFvQixTQUFDLGFBQUQsRUFBZ0IsU0FBaEIsRUFBMkIsTUFBM0IsR0FBQTtBQUNsQixVQUFBLG1FQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWtCLEtBQWxCLENBQUE7QUFBQSxNQUNBLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQUEsQ0FEdEIsQ0FBQTtBQUdBO0FBQUEsV0FBQSw0Q0FBQTswQkFBQTtBQUNFLFFBQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFLLENBQUMsS0FBekIsRUFBZ0MsS0FBaEMsRUFBdUMsYUFBYSxDQUFDLFVBQXJELENBQWIsQ0FBQTtBQUVBLFFBQUEsSUFBRyxjQUFjLENBQUMsWUFBZixDQUE0QixTQUE1QixFQUF1QyxVQUFVLENBQUMsSUFBWCxDQUFBLENBQXZDLEVBQTBELE1BQTFELENBQUEsSUFBc0UsQ0FBQyxDQUFBLGNBQUEsSUFBc0IsTUFBTSxDQUFDLFFBQTlCLENBQXpFO0FBQ0UsVUFBQSxlQUFlLENBQUMsTUFBaEIsR0FBeUIsY0FBYyxDQUFDLFVBQWYsQ0FBMEIsVUFBVSxDQUFDLElBQVgsQ0FBQSxDQUExQixFQUE2QyxNQUE3QyxDQUF6QixDQUFBO0FBRUEsVUFBQSxJQUFHLE1BQU0sQ0FBQyxRQUFWO0FBQ0UsWUFBQSxlQUFlLENBQUMsR0FBaEIsQ0FBQSxDQUFBLENBREY7V0FGQTtBQUFBLFVBS0EsY0FBQSxHQUFpQixJQUxqQixDQURGO1NBQUEsTUFBQTtBQVNFLFVBQUEsSUFBRyxjQUFBLElBQW1CLENBQUEsTUFBVSxDQUFDLFFBQWpDO0FBQ0UsWUFBQSxlQUFlLENBQUMsS0FBaEIsSUFBeUIsVUFBekIsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLGVBQWUsQ0FBQyxNQUFoQixJQUEwQixVQUExQixDQUhGO1dBVEY7U0FIRjtBQUFBLE9BSEE7QUFBQSxNQW9CQSxlQUFlLENBQUMsR0FBaEIsQ0FBQSxDQXBCQSxDQUFBO0FBQUEsTUFxQkEsZUFBZSxDQUFDLEtBQWhCLEdBQXdCLGNBckJ4QixDQUFBO0FBdUJBLGFBQU8sZUFBUCxDQXhCa0I7SUFBQSxDQS9FcEI7QUF5R0E7QUFBQTs7Ozs7O09BekdBO0FBQUEsSUFnSEEsVUFBQSxFQUFZLFNBQUMsT0FBRCxFQUFVLGVBQVYsR0FBQTtBQUNWLFVBQUEscUNBQUE7QUFBQTtBQUFBO1dBQUEsb0RBQUE7MkJBQUE7QUFDRSxRQUFBLElBQU8sb0JBQUosSUFBbUIsT0FBTyxDQUFDLE1BQVIsR0FBaUIsT0FBUSxDQUFBLENBQUEsQ0FBL0M7d0JBQ0UsT0FBUSxDQUFBLENBQUEsQ0FBUixHQUFhLE9BQU8sQ0FBQyxRQUR2QjtTQUFBLE1BQUE7Z0NBQUE7U0FERjtBQUFBO3NCQURVO0lBQUEsQ0FoSFo7QUFxSEE7QUFBQTs7Ozs7O09BckhBO0FBQUEsSUE0SEEsdUJBQUEsRUFBeUIsU0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLFNBQWQsR0FBQTtBQUN2QixVQUFBLG9KQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxHQUFNLENBQWQsQ0FBQTtBQUFBLE1BQ0EsR0FBQSxHQUFRLEdBQUEsR0FBTSxDQURkLENBQUE7QUFBQSxNQUdBLGdCQUFBLEdBQW1CLEVBSG5CLENBQUE7QUFBQSxNQUlBLFNBQUEsR0FBYyxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsTUFBOUIsRUFBc0MsR0FBdEMsQ0FKZCxDQUFBO0FBQUEsTUFLQSxLQUFBLEdBQWMsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBK0IsQ0FBQyxhQUFoQyxDQUFBLENBTGQsQ0FBQTtBQUFBLE1BTUEsTUFBQSxHQUFjLGNBQWMsQ0FBQyxTQUFmLENBQXlCLFNBQXpCLEVBQW9DLEtBQXBDLENBTmQsQ0FBQTtBQUFBLE1BUUEsZUFBQSxHQUFrQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsU0FBcEIsRUFBK0IsU0FBL0IsRUFBMEMsTUFBMUMsQ0FSbEIsQ0FBQTtBQUFBLE1BVUEsZ0JBQWlCLENBQUEsR0FBQSxDQUFqQixHQUF3QixlQVZ4QixDQUFBO0FBQUEsTUFZQSxNQUFBLEdBQVksTUFBTSxDQUFDLHVCQUFQLENBQStCLEdBQS9CLENBWlosQ0FBQTtBQUFBLE1BYUEsS0FBQSxHQUFZLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FiWixDQUFBO0FBQUEsTUFjQSxTQUFBLEdBQVksZUFBZSxDQUFDLFNBQWhCLENBQUEsQ0FkWixDQUFBO0FBQUEsTUFnQkEsT0FBQSxHQUFhLEVBaEJiLENBQUE7QUFBQSxNQWlCQSxVQUFBLEdBQWlCLElBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxDQUFYLENBakJqQixDQUFBO0FBQUEsTUFrQkEsUUFBQSxHQUFpQixJQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsUUFBWCxDQWxCakIsQ0FBQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQUFxQixlQUFyQixDQXBCQSxDQUFBO0FBc0JBLGFBQU0sS0FBQSxHQUFRLENBQUEsQ0FBUixJQUFjLEdBQUEsR0FBTSxLQUExQixHQUFBO0FBQ0UsUUFBQSxJQUFHLEtBQUEsR0FBUSxDQUFBLENBQVg7QUFDRSxVQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsTUFBOUIsRUFBc0MsS0FBdEMsQ0FBWixDQUFBO0FBRUEsVUFBQSxJQUFHLG1CQUFBLElBQWUsTUFBTSxDQUFDLHVCQUFQLENBQStCLEtBQS9CLENBQUEsS0FBeUMsTUFBM0Q7QUFDRSxZQUFBLElBQUcsU0FBUyxDQUFDLFNBQVYsQ0FBQSxDQUFIO0FBQ0UsY0FBQSxLQUFBLElBQVMsQ0FBVCxDQURGO2FBQUEsTUFHSyxJQUFHLENBQUMsZUFBQSxHQUFrQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsU0FBcEIsRUFBK0IsU0FBL0IsRUFBMEMsTUFBMUMsQ0FBbkIsQ0FBQSxJQUF5RSxlQUFlLENBQUMsT0FBaEIsQ0FBQSxDQUE1RTtBQUNILGNBQUEsZ0JBQWlCLENBQUEsS0FBQSxDQUFqQixHQUEwQixlQUExQixDQUFBO0FBQUEsY0FDQSxJQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosRUFBcUIsZUFBckIsQ0FEQSxDQUFBO0FBQUEsY0FFQSxVQUFVLENBQUMsR0FBWCxHQUFrQixLQUZsQixDQUFBO0FBR0EsY0FBQSxJQUEwQixDQUFBLFNBQUEsSUFBa0IsZUFBZSxDQUFDLFNBQWhCLENBQUEsQ0FBNUM7QUFBQSxnQkFBQSxTQUFBLEdBQWtCLElBQWxCLENBQUE7ZUFIQTtBQUFBLGNBSUEsS0FBQSxJQUFrQixDQUpsQixDQURHO2FBQUEsTUFBQTtBQVFILGNBQUEsS0FBQSxHQUFRLENBQUEsQ0FBUixDQVJHO2FBSlA7V0FBQSxNQUFBO0FBZUUsWUFBQSxLQUFBLEdBQVEsQ0FBQSxDQUFSLENBZkY7V0FIRjtTQUFBO0FBb0JBLFFBQUEsSUFBRyxHQUFBLEdBQU0sS0FBQSxHQUFRLENBQWpCO0FBQ0UsVUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLDRCQUFELENBQThCLE1BQTlCLEVBQXNDLEdBQXRDLENBQVYsQ0FBQTtBQUVBLFVBQUEsSUFBRyxpQkFBQSxJQUFhLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixHQUEvQixDQUFBLEtBQXVDLE1BQXZEO0FBQ0UsWUFBQSxJQUFHLE9BQU8sQ0FBQyxTQUFSLENBQUEsQ0FBSDtBQUNFLGNBQUEsR0FBQSxJQUFPLENBQVAsQ0FERjthQUFBLE1BR0ssSUFBRyxDQUFDLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGtCQUFELENBQW9CLE9BQXBCLEVBQTZCLFNBQTdCLEVBQXdDLE1BQXhDLENBQW5CLENBQUEsSUFBdUUsZUFBZSxDQUFDLE9BQWhCLENBQUEsQ0FBMUU7QUFDSCxjQUFBLGdCQUFpQixDQUFBLEdBQUEsQ0FBakIsR0FBd0IsZUFBeEIsQ0FBQTtBQUFBLGNBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaLEVBQXFCLGVBQXJCLENBREEsQ0FBQTtBQUFBLGNBRUEsUUFBUSxDQUFDLEdBQVQsR0FBZ0IsR0FGaEIsQ0FBQTtBQUdBLGNBQUEsSUFBd0IsQ0FBQSxTQUFBLElBQWtCLGVBQWUsQ0FBQyxTQUFoQixDQUFBLENBQTFDO0FBQUEsZ0JBQUEsU0FBQSxHQUFnQixJQUFoQixDQUFBO2VBSEE7QUFBQSxjQUlBLEdBQUEsSUFBZ0IsQ0FKaEIsQ0FERzthQUFBLE1BQUE7QUFRSCxjQUFBLEdBQUEsR0FBTSxLQUFBLEdBQVEsQ0FBZCxDQVJHO2FBSlA7V0FBQSxNQUFBO0FBZUUsWUFBQSxHQUFBLEdBQU0sS0FBQSxHQUFRLENBQWQsQ0FmRjtXQUhGO1NBckJGO01BQUEsQ0F0QkE7QUErREEsTUFBQSxJQUFHLFNBQUg7QUFDRSxRQUFBLE9BQUEsR0FBVSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQUMsSUFBRCxHQUFBO2lCQUFVLElBQUEsR0FBTyxFQUFqQjtRQUFBLENBQVosQ0FBVixDQURGO09BL0RBO0FBa0VBLGFBQU87QUFBQSxRQUNMLEtBQUEsRUFBc0IsSUFBQSxLQUFBLENBQU0sVUFBTixFQUFrQixRQUFsQixDQURqQjtBQUFBLFFBRUwsT0FBQSxFQUFrQixPQUZiO0FBQUEsUUFHTCxnQkFBQSxFQUFrQixnQkFIYjtPQUFQLENBbkV1QjtJQUFBLENBNUh6QjtBQXFNQTtBQUFBOzs7Ozs7O09Bck1BO0FBQUEsSUE2TUEsNEJBQUEsRUFBOEIsU0FBQyxNQUFELEVBQVMsR0FBVCxHQUFBO2FBQzVCLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLG1CQUFyQyxDQUF5RCxHQUF6RCxFQUQ0QjtJQUFBLENBN005QjtBQWdOQTtBQUFBOzs7Ozs7Ozs7T0FoTkE7QUFBQSxJQTBOQSxpQkFBQSxFQUFtQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsVUFBZixHQUFBO0FBQ2pCLFVBQUEsaUJBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxLQUF5QixDQUFDLHNCQUExQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFFQSxNQUFBLElBQWUsS0FBSyxDQUFDLFNBQXJCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FGQTtBQUlBLE1BQUEsSUFBRyxxQ0FBSDtBQUNFLFFBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQWhCLEVBQW1CLEtBQUssQ0FBQyx1QkFBekIsQ0FBVixDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsSUFBQyxDQUFBLHNCQUFELENBQXdCLE9BQXhCLEVBQWlDLFVBQWpDLENBRFYsQ0FBQTtBQUFBLFFBRUEsS0FBQSxHQUFVLE9BQUEsR0FBVSxLQUFLLENBQUMsU0FBTixDQUFnQixLQUFLLENBQUMsdUJBQXRCLENBRnBCLENBREY7T0FKQTtBQVVBLE1BQUEsSUFBRywwQ0FBSDtBQUNFLFFBQUEsUUFBQSxHQUFXLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQUssQ0FBQyw0QkFBdEIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLHNCQUFELENBQXdCLFFBQXhCLEVBQWtDLFVBQWxDLENBRFgsQ0FBQTtBQUFBLFFBRUEsS0FBQSxHQUFXLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQWhCLEVBQW1CLEtBQUssQ0FBQyw0QkFBekIsQ0FBQSxHQUF5RCxRQUZwRSxDQURGO09BVkE7QUFlQSxhQUFPLEtBQVAsQ0FoQmlCO0lBQUEsQ0ExTm5CO0FBNE9BO0FBQUE7Ozs7Ozs7O09BNU9BO0FBQUEsSUFxUEEsc0JBQUEsRUFBd0IsU0FBQyxNQUFELEVBQVMsVUFBVCxHQUFBO0FBQ3RCLE1BQUEsSUFBRyx3QkFBSDtBQUNFLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQW1CLElBQUEsTUFBQSxDQUFPLFVBQVUsQ0FBQyxLQUFsQixFQUF5QixHQUF6QixDQUFuQixFQUFrRCxHQUFsRCxDQUFULENBREY7T0FBQTtBQUdBLE1BQUEsSUFBRyxzQkFBSDtBQUNFLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQW1CLElBQUEsTUFBQSxDQUFPLFVBQVUsQ0FBQyxHQUFsQixFQUF1QixHQUF2QixDQUFuQixFQUFnRCxJQUFoRCxDQUFULENBREY7T0FIQTtBQU1BLGFBQU8sTUFBUCxDQVBzQjtJQUFBLENBclB4QjtHQVZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/aligner/lib/helper.coffee
