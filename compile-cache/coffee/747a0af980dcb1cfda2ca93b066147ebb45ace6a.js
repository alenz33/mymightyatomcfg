(function() {
  var CompositeDisposable, TreeViewGitModified, TreeViewGitModifiedView, requirePackages;

  CompositeDisposable = require('atom').CompositeDisposable;

  requirePackages = require('atom-utils').requirePackages;

  TreeViewGitModifiedView = require('./tree-view-git-modified-view');

  module.exports = TreeViewGitModified = {
    treeViewGitModifiedView: null,
    subscriptions: null,
    isVisible: true,
    activate: function(state) {
      this.treeViewGitModifiedView = new TreeViewGitModifiedView(state.treeViewGitModifiedViewState);
      this.isVisible = state.isVisible;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'tree-view-git-modified:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'tree-view-git-modified:openAll': (function(_this) {
          return function() {
            return _this.openAll();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'tree-view-git-modified:show': (function(_this) {
          return function() {
            return _this.show();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'tree-view-git-modified:hide': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this)
      }));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function(path) {
          return _this.show();
        };
      })(this)));
      return requirePackages('tree-view').then((function(_this) {
        return function(_arg) {
          var treeView;
          treeView = _arg[0];
          if (!_this.treeViewGitModifiedView) {
            _this.treeViewGitModifiedView = new TreeViewGitModifiedView;
          }
          if ((treeView.treeView && _this.isVisible) || (_this.isVisible === void 0)) {
            _this.treeViewGitModifiedView.show();
          }
          atom.commands.add('atom-workspace', 'tree-view:toggle', function() {
            var _ref;
            if ((_ref = treeView.treeView) != null ? _ref.is(':visible') : void 0) {
              return _this.treeViewGitModifiedView.hide();
            } else {
              if (_this.isVisible) {
                return _this.treeViewGitModifiedView.show();
              }
            }
          });
          return atom.commands.add('atom-workspace', 'tree-view:show', function() {
            if (_this.isVisible) {
              return _this.treeViewGitModifiedView.show();
            }
          });
        };
      })(this));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.treeViewGitModifiedView.destroy();
    },
    serialize: function() {
      return {
        isVisible: this.isVisible,
        treeViewGitModifiedViewState: this.treeViewGitModifiedView.serialize()
      };
    },
    toggle: function() {
      if (this.isVisible) {
        this.treeViewGitModifiedView.hide();
      } else {
        this.treeViewGitModifiedView.show();
      }
      return this.isVisible = !this.isVisible;
    },
    show: function() {
      this.treeViewGitModifiedView.show();
      return this.isVisible = true;
    },
    hide: function() {
      this.treeViewGitModifiedView.hide();
      return this.isVisible = false;
    },
    openAll: function() {
      var self;
      self = this;
      return Promise.all(atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project))).then(function(repos) {
        var filePath, repo, _i, _len, _results;
        if (repos.length > 0) {
          _results = [];
          for (_i = 0, _len = repos.length; _i < _len; _i++) {
            repo = repos[_i];
            if (repo != null) {
              _results.push((function() {
                var _results1;
                _results1 = [];
                for (filePath in repo.statuses) {
                  if (repo.isPathModified(filePath) || repo.isPathNew(filePath)) {
                    _results1.push(atom.workspace.open(repo.repo.workingDirectory + '/' + filePath));
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              })());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          return atom.beep();
        }
      }, function(err) {
        return console.log(err);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1tb2RpZmllZC9saWIvdHJlZS12aWV3LWdpdC1tb2RpZmllZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsWUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQSx1QkFBQSxHQUEwQixPQUFBLENBQVEsK0JBQVIsQ0FGMUIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG1CQUFBLEdBRWY7QUFBQSxJQUFBLHVCQUFBLEVBQXlCLElBQXpCO0FBQUEsSUFDQSxhQUFBLEVBQWUsSUFEZjtBQUFBLElBRUEsU0FBQSxFQUFXLElBRlg7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLHVCQUFELEdBQStCLElBQUEsdUJBQUEsQ0FBd0IsS0FBSyxDQUFDLDRCQUE5QixDQUEvQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQUssQ0FBQyxTQURuQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSmpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENB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

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-modified/lib/tree-view-git-modified.coffee
