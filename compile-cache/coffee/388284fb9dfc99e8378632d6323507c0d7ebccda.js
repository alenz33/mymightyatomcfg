(function() {
  var ErrorView, HeaderView, ListView, PythonNosetestsView, ResizablePanel, SplitView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  ResizablePanel = require('./resizablepanel');

  SplitView = require('./splitview');

  ListView = require('./listview');

  ErrorView = require('./errorview');

  module.exports = PythonNosetestsView = (function(_super) {
    __extends(PythonNosetestsView, _super);

    PythonNosetestsView.content = function() {
      return this.div({
        "class": 'python-nosetests'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'resizable-panel-handle'
          });
          return _this.div({
            "class": 'mainview'
          }, function() {
            _this.subview('headerview', new HeaderView());
            _this.subview('listview', new ListView());
            _this.div({
              "class": 'bar'
            });
            return _this.subview('errorview', new ErrorView());
          });
        };
      })(this));
    };

    PythonNosetestsView.prototype.initialize = function() {
      new ResizablePanel(this.find('.resizable-panel-handle'));
      this.splitview = new SplitView(this.find('.bar'));
      return this.listview.setOnSelect((function(_this) {
        return function(test) {
          if ('error' in test) {
            _this.errorview.load(test.error);
            return _this.splitview.setRatio();
          } else {
            return _this.splitview.full_a();
          }
        };
      })(this));
    };

    function PythonNosetestsView() {
      PythonNosetestsView.__super__.constructor.apply(this, arguments);
    }

    PythonNosetestsView.prototype.mute = function() {
      return this.find('.mainview').addClass('muted');
    };

    PythonNosetestsView.prototype.unmute = function() {
      return this.find('.mainview').removeClass('muted');
    };

    PythonNosetestsView.prototype.load = function(data) {
      this.listview.load(data);
      this.errorview.clear();
      this.splitview.full_a();
      return this.unmute();
    };

    return PythonNosetestsView;

  })(View);

  HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.content = function() {
      return this.div({
        "class": 'header'
      }, (function(_this) {
        return function() {
          return _this.text('Python Nosetests');
        };
      })(this));
    };

    return HeaderView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcHl0aG9uLW5vc2V0ZXN0cy9saWIvdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLFdBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FMWixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLDBDQUFBLENBQUE7O0FBQUEsSUFBQSxtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sa0JBQVA7T0FBTCxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHdCQUFQO1dBQUwsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxVQUFQO1dBQUwsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFlBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsVUFBQSxDQUFBLENBQTNCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxVQUFULEVBQXlCLElBQUEsUUFBQSxDQUFBLENBQXpCLENB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

//# sourceURL=/home/alenz/.atom/packages/python-nosetests/lib/view.coffee
