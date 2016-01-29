(function() {
  var Aligner, CompositeDisposable, configs, extend, formatter, helper, operatorConfig, providerManager;

  operatorConfig = require('./operator-config');

  helper = require('./helper');

  providerManager = require('./provider-manager');

  formatter = require('./formatter');

  configs = require('../config');

  extend = require('extend');

  CompositeDisposable = require('atom').CompositeDisposable;

  Aligner = (function() {
    function Aligner() {}

    Aligner.prototype.config = operatorConfig.getAtomConfig();


    /*
    @param {Editor} editor
     */

    Aligner.prototype.align = function(editor) {
      var range, rangesWithContent, _i, _len, _ref;
      rangesWithContent = [];
      _ref = editor.getSelectedBufferRanges();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        range = _ref[_i];
        if (range.isEmpty()) {
          this.alignAtRow(editor, range.start.row);
        } else {
          rangesWithContent.push(range);
        }
      }
      if (rangesWithContent.length > 0) {
        this.alignRanges(editor, rangesWithContent);
      }
    };

    Aligner.prototype.alignAtRow = function(editor, row) {
      var character, offsets, range, sectionizedLines, _ref;
      character = helper.getAlignCharacter(editor, row);
      if (!character) {
        return;
      }
      _ref = helper.getSameIndentationRange(editor, row, character), range = _ref.range, offsets = _ref.offsets, sectionizedLines = _ref.sectionizedLines;
      return formatter.formatRange(editor, range, character, offsets, sectionizedLines);
    };

    Aligner.prototype.alignRanges = function(editor, ranges) {
      var character, offsets, range, rangeIndex, sectionizedLines, _i, _len, _ref, _results;
      character = helper.getAlignCharacterInRanges(editor, ranges);
      if (!character) {
        return;
      }
      _ref = helper.getOffsetsAndSectionizedLines(editor, character, ranges), offsets = _ref.offsets, sectionizedLines = _ref.sectionizedLines;
      _results = [];
      for (rangeIndex = _i = 0, _len = ranges.length; _i < _len; rangeIndex = ++_i) {
        range = ranges[rangeIndex];
        _results.push(formatter.formatRange(editor, range, character, offsets, sectionizedLines[rangeIndex]));
      }
      return _results;
    };

    Aligner.prototype.activate = function() {
      var alignerConfig;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.config.observe('aligner', function(value) {
        return operatorConfig.updateConfigWithAtom('aligner', value);
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', 'aligner:align', (function(_this) {
        return function() {
          return _this.align(atom.workspace.getActiveTextEditor());
        };
      })(this)));
      alignerConfig = extend(true, {}, configs);
      extend(true, alignerConfig.config, atom.config.get('aligner'));
      this.disposables.add(operatorConfig.add('aligner', alignerConfig));
      return this.disposables.add(atom.config.observe('aligner', function(value) {
        return operatorConfig.updateConfigWithAtom('aligner', value);
      }));
    };

    Aligner.prototype.deactivate = function() {
      this.disposables.dispose();
      return this.disposables = null;
    };

    Aligner.prototype.registerProviders = function(provider) {
      return this.disposables.add(providerManager.register(provider));
    };

    return Aligner;

  })();

  module.exports = new Aligner();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUdBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQkFBUixDQUFsQixDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFrQixPQUFBLENBQVEsVUFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBa0IsT0FBQSxDQUFRLGFBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBa0IsT0FBQSxDQUFRLFdBQVIsQ0FKbEIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBa0IsT0FBQSxDQUFRLFFBQVIsQ0FMbEIsQ0FBQTs7QUFBQSxFQU1DLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFORCxDQUFBOztBQUFBLEVBUU07eUJBQ0o7O0FBQUEsc0JBQUEsTUFBQSxHQUFRLGNBQWMsQ0FBQyxhQUFmLENBQUEsQ0FBUixDQUFBOztBQUVBO0FBQUE7O09BRkE7O0FBQUEsc0JBS0EsS0FBQSxHQUFPLFNBQUMsTUFBRCxHQUFBO0FBQ0wsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsaUJBQUEsR0FBb0IsRUFBcEIsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTt5QkFBQTtBQUVFLFFBQUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFBLENBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQUFvQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQWhDLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFJRSxVQUFBLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLEtBQXZCLENBQUEsQ0FKRjtTQUZG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

//# sourceURL=/home/alenz/.atom/packages/aligner/lib/main.coffee
