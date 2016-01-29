(function() {
  var Convert, ScriptRunnerView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  Convert = require('ansi-to-html');

  module.exports = ScriptRunnerView = (function(_super) {
    __extends(ScriptRunnerView, _super);

    atom.deserializers.add(ScriptRunnerView);

    ScriptRunnerView.deserialize = function(_arg) {
      var footer, header, output, title, view;
      title = _arg.title, header = _arg.header, output = _arg.output, footer = _arg.footer;
      view = new ScriptRunnerView(title);
      view._header.html(header);
      view._output.html(output);
      view._footer.html(footer);
      return view;
    };

    ScriptRunnerView.content = function() {
      return this.div({
        "class": 'script-runner',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h1('Script Runner');
          _this.div({
            "class": 'header'
          });
          _this.pre({
            "class": 'output'
          });
          return _this.div({
            "class": 'footer'
          });
        };
      })(this));
    };

    function ScriptRunnerView(title) {
      ScriptRunnerView.__super__.constructor.apply(this, arguments);
      atom.commands.add('div.script-runner', 'run:copy', (function(_this) {
        return function() {
          return _this.copyToClipboard();
        };
      })(this));
      this.convert = new Convert({
        escapeXML: true
      });
      this._header = this.find('.header');
      this._output = this.find('.output');
      this._footer = this.find('.footer');
      this.setTitle(title);
    }

    ScriptRunnerView.prototype.serialize = function() {
      return {
        deserializer: 'ScriptRunnerView',
        title: this.title,
        header: this._header.html(),
        output: this._output.html(),
        footer: this._footer.html()
      };
    };

    ScriptRunnerView.prototype.copyToClipboard = function() {
      return atom.clipboard.write(window.getSelection().toString());
    };

    ScriptRunnerView.prototype.getTitle = function() {
      return "Script Runner: " + this.title;
    };

    ScriptRunnerView.prototype.setTitle = function(title) {
      this.title = title;
      return this.find('h1').html(this.getTitle());
    };

    ScriptRunnerView.prototype.clear = function() {
      this._output.html('');
      this._header.html('');
      return this._footer.html('');
    };

    ScriptRunnerView.prototype.append = function(text, className) {
      var span;
      span = document.createElement('span');
      span.innerHTML = this.convert.toHtml([text]);
      span.className = className || 'stdout';
      return this._output.append(span);
    };

    ScriptRunnerView.prototype.header = function(text) {
      return this._header.html(text);
    };

    ScriptRunnerView.prototype.footer = function(text) {
      return this._footer.html(text);
    };

    return ScriptRunnerView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvc2NyaXB0LXJ1bm5lci9saWIvc2NyaXB0LXJ1bm5lci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsc0JBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGNBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7O0FBQUEsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLGdCQUF2QixDQUFBLENBQUE7O0FBQUEsSUFFQSxnQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsbUNBQUE7QUFBQSxNQURjLGFBQUEsT0FBTyxjQUFBLFFBQVEsY0FBQSxRQUFRLGNBQUEsTUFDckMsQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFXLElBQUEsZ0JBQUEsQ0FBaUIsS0FBakIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBa0IsTUFBbEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBa0IsTUFBbEIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBa0IsTUFBbEIsQ0FIQSxDQUFBO0FBSUEsYUFBTyxJQUFQLENBTFk7SUFBQSxDQUZkLENBQUE7O0FBQUEsSUFTQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sZUFBUDtBQUFBLFFBQXdCLFFBQUEsRUFB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

//# sourceURL=/home/alenz/.atom/packages/script-runner/lib/script-runner-view.coffee
