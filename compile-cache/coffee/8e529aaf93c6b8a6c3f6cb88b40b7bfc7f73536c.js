(function() {
  var $$, ErrorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), View = _ref.View, $$ = _ref.$$;

  module.exports = ErrorView = (function(_super) {
    __extends(ErrorView, _super);

    function ErrorView() {
      return ErrorView.__super__.constructor.apply(this, arguments);
    }

    ErrorView.content = function() {
      return this.div({
        "class": 'errorview'
      }, (function(_this) {
        return function() {
          return _this.ul({
            "class": 'root',
            outlet: 'root'
          });
        };
      })(this));
    };

    ErrorView.prototype.serialize = function() {};

    ErrorView.prototype.destroy = function() {};

    ErrorView.prototype.clear = function() {
      return this.root.html('');
    };

    ErrorView.prototype.load = function(error) {
      var tb, _i, _ref1, _results;
      this.clear();
      this.addMessage(error.message);
      _ref1 = error.traceback;
      _results = [];
      for (_i = _ref1.length - 1; _i >= 0; _i += -1) {
        tb = _ref1[_i];
        _results.push(this.addTrace(tb));
      }
      return _results;
    };

    ErrorView.prototype.addTrace = function(tb) {
      var li;
      li = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'filename'
            }, tb.filename + ':' + tb.linenr);
            _this.div({
              "class": 'function'
            }, function() {
              _this.text("In function ");
              _this.span(tb["function"]);
              return _this.text(":");
            });
            return _this.div({
              "class": 'code'
            }, tb.line);
          };
        })(this));
      });
      if (!this.isProjectFile(tb.filename)) {
        li.addClass('mute');
      }
      li.on('click', (function(_this) {
        return function() {
          return atom.workspace.open(tb.filename, {
            initialLine: tb.linenr - 1,
            searchAllPanes: true
          });
        };
      })(this));
      return this.root.append(li);
    };

    ErrorView.prototype.addMessage = function(message) {
      var li;
      li = $$(function() {
        return this.li({
          "class": 'message'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'code'
            }, message);
          };
        })(this));
      });
      return this.root.append(li);
    };

    ErrorView.prototype.isProjectFile = function(filename) {
      var dir, _i, _len, _ref1;
      _ref1 = atom.project.getDirectories();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        dir = _ref1[_i];
        if (dir.contains(filename)) {
          return true;
        }
      }
      return false;
    };

    return ErrorView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcHl0aG9uLW5vc2V0ZXN0cy9saWIvZXJyb3J2aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsV0FBUixDQUFiLEVBQUMsWUFBQSxJQUFELEVBQU8sVUFBQSxFQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sV0FBUDtPQUFMLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3ZCLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO0FBQUEsWUFBZSxNQUFBLEVBQU8sTUFBdEI7V0FBSixFQUR1QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsd0JBS0EsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQUxYLENBQUE7O0FBQUEsd0JBUUEsT0FBQSxHQUFTLFNBQUEsR0FBQSxDQVJULENBQUE7O0FBQUEsd0JBVUEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEVBQVgsRUFESztJQUFBLENBVlAsQ0FBQTs7QUFBQSx3QkFhQSxJQUFBLEdBQU0sU0FBQyxLQUFELEdBQUE7QUFDSixVQUFBLHVCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxLQUFLLENBQUMsT0FBbEIsQ0FIQSxDQUFBO0FBS0E7QUFBQTtXQUFBLHdDQUFBO3VCQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxFQUFWLEVBQUEsQ0FERjtBQUFBO3NCQU5JO0lBQUEsQ0FiTixDQUFBOztBQUFBLHdCQXNCQSxRQUFBLEdBQVUsU0FBQyxFQUFELEdBQUE7QUFFUixVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ04sSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNGLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFVBQVA7YUFBTCxFQUF3QixFQUFFLENBQUMsUUFBSCxHQUFZLEdBQVosR0FBZ0IsRUFBRSxDQUFDLE1BQTNDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFVBQVA7YUFBTCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNLGNBQU4sQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsSUFBRCxDQUFNLEVBQUUsQ0FBQyxVQUFELENBQVIsQ0FEQSxDQUFBO3FCQUVBLEtBQUMsQ0FBQSxJQUFELENBQU0sR0FBTixFQUhzQjtZQUFBLENBQXhCLENBREEsQ0FBQTttQkFLQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sTUFBUDthQUFMLEVBQW9CLEVBQUUsQ0FBQyxJQUF2QixFQU5FO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSixFQURNO01BQUEsQ0FBSCxDQUFMLENBQUE7QUFXQSxNQUFBLElBQUcsQ0FBQSxJQUFLLENBQUEsYUFBRCxDQUFlLEVBQUUsQ0FBQyxRQUFsQixDQUFQO0FBQ0UsUUFBQSxFQUFFLENBQUMsUUFBSCxDQUFZLE1BQVosQ0FBQSxDQURGO09BWEE7QUFBQSxNQWNBLEVBQUUsQ0FBQyxFQUFILENBQU0sT0FBTixFQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEVBQUUsQ0FBQyxRQUF2QixFQUFpQztBQUFBLFlBQUEsV0FBQSxFQUFhLEVBQUUsQ0FBQyxNQUFILEdBQVUsQ0FBdkI7QUFBQSxZQUEwQixjQUFBLEVBQWdCLElBQTFDO1dBQWpDLEVBRGE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLENBZEEsQ0FBQTthQWlCQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxFQUFiLEVBbkJRO0lBQUEsQ0F0QlYsQ0FBQTs7QUFBQSx3QkEyQ0EsVUFBQSxHQUFZLFNBQUMsT0FBRCxHQUFBO0FBRVYsVUFBQSxFQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNOLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxVQUFBLE9BQUEsRUFBTyxTQUFQO1NBQUosRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ3BCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxNQUFQO2FBQUwsRUFBb0IsT0FBcEIsRUFEb0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixFQURNO01BQUEsQ0FBSCxDQUFMLENBQUE7YUFJQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxFQUFiLEVBTlU7SUFBQSxDQTNDWixDQUFBOztBQUFBLHdCQW1EQSxhQUFBLEdBQWUsU0FBQyxRQUFELEdBQUE7QUFFYixVQUFBLG9CQUFBO0FBQUE7QUFBQSxXQUFBLDRDQUFBO3dCQUFBO0FBQ0csUUFBQSxJQUFHLEdBQUcsQ0FBQyxRQUFKLENBQWEsUUFBYixDQUFIO0FBQ0UsaUJBQU8sSUFBUCxDQURGO1NBREg7QUFBQSxPQUFBO0FBR0EsYUFBTyxLQUFQLENBTGE7SUFBQSxDQW5EZixDQUFBOztxQkFBQTs7S0FGc0IsS0FIeEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/python-nosetests/lib/errorview.coffee
