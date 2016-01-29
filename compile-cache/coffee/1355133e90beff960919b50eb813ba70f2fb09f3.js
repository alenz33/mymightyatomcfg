(function() {
  var $$, CompositeDisposable, Disposable, ListView, View, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), View = _ref.View, $$ = _ref.$$;

  _ref1 = require('atom'), Disposable = _ref1.Disposable, CompositeDisposable = _ref1.CompositeDisposable;

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.content = function() {
      return this.div({
        "class": 'listview'
      }, (function(_this) {
        return function() {
          return _this.ul({
            "class": 'root list-tree has-collapsable-children',
            outlet: 'root'
          });
        };
      })(this));
    };

    ListView.prototype.setOnSelect = function(func) {
      return this.onselect = func;
    };

    ListView.prototype.clear = function() {
      return this.root.html('');
    };

    ListView.prototype.load = function(data) {
      var mod, mod_ul, tc, _i, _len, _ref2, _results;
      this.clear();
      _ref2 = data.modules;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        mod = _ref2[_i];
        mod_ul = this.addModule(mod);
        _results.push((function() {
          var _j, _len1, _ref3, _results1;
          _ref3 = mod.testcases;
          _results1 = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            tc = _ref3[_j];
            _results1.push(this.addTestCase(mod_ul, tc));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ListView.prototype.addModule = function(mod) {
      var div, li;
      li = $$(function() {
        return this.li({
          "class": 'list-nested-item'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'list-item'
            }, function() {
              return _this.span(mod.name);
            });
            return _this.ul({
              "class": 'list-tree'
            });
          };
        })(this));
      });
      div = li.find('div');
      div.on('click', (function(_this) {
        return function() {
          return li.toggleClass('collapsed');
        };
      })(this));
      if (mod.nr_success > 0) {
        div.append(this.createBadge(mod.nr_success, 'success'));
      }
      if (mod.nr_failed > 0) {
        div.append(this.createBadge(mod.nr_failed, 'warning'));
      }
      if (mod.nr_error > 0) {
        div.append(this.createBadge(mod.nr_error, 'error'));
      }
      if (mod.nr_error + mod.nr_failed === 0) {
        li.addClass('collapsed');
      }
      this.root.append(li);
      return li.find('ul');
    };

    ListView.prototype.addTestCase = function(ul, test) {
      var li, title_class;
      switch (test.result) {
        case "success":
          title_class = 'text-success';
          break;
        case "failed":
          title_class = 'text-warning';
          break;
        case "error":
          title_class = 'text-error';
          break;
        default:
          title_class = 'text-info';
      }
      li = $$(function() {
        return this.li({
          "class": 'list-nested-item'
        }, (function(_this) {
          return function() {
            return _this.span({
              "class": title_class
            }, test.name);
          };
        })(this));
      });
      li.on('click', (function(_this) {
        return function() {
          _this.root.find('li').removeClass('active');
          li.addClass('active');
          return _this.onselect(test);
        };
      })(this));
      return ul.append(li);
    };

    ListView.prototype.createBadge = function(text, cls) {
      var span;
      span = document.createElement('span');
      span.textContent = text;
      if (atom.config.get('python-nosetests.colorfullBadges')) {
        span.classList.add('badge', 'badge-small', 'badge-' + cls);
      } else {
        span.classList.add('badge', 'badge-small', 'text-' + cls);
      }
      return span;
    };

    return ListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcHl0aG9uLW5vc2V0ZXN0cy9saWIvbGlzdHZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGdFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxXQUFSLENBQWIsRUFBQyxZQUFBLElBQUQsRUFBTyxVQUFBLEVBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsbUJBQUEsVUFBRCxFQUFhLDRCQUFBLG1CQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sVUFBUDtPQUFMLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3RCLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyx5Q0FBUDtBQUFBLFlBQWtELE1BQUEsRUFBUSxNQUExRDtXQUFKLEVBRHNCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx1QkFJQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZLEtBREQ7SUFBQSxDQUpiLENBQUE7O0FBQUEsdUJBT0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEVBQVgsRUFESztJQUFBLENBUFAsQ0FBQTs7QUFBQSx1QkFVQSxJQUFBLEdBQU0sU0FBQyxJQUFE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

//# sourceURL=/home/alenz/.atom/packages/python-nosetests/lib/listview.coffee
