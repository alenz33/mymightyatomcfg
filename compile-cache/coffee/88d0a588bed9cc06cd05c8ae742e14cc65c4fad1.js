(function() {
  var CompositeDisposable, TreeViewGitModifiedPaneView, TreeViewGitModifiedView, requirePackages;

  requirePackages = require('atom-utils').requirePackages;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  TreeViewGitModifiedPaneView = require('./tree-view-git-modified-pane-view');

  module.exports = TreeViewGitModifiedView = (function() {
    function TreeViewGitModifiedView(serializedState) {
      this.element = document.createElement('li');
      this.treeViewGitModifiedPaneViewArray = [];
      this.paneSub = new CompositeDisposable;
      this.loadRepos();
      this.paneSub.add(atom.project.onDidChangePaths((function(_this) {
        return function(path) {
          return _this.loadRepos();
        };
      })(this)));
    }

    TreeViewGitModifiedView.prototype.loadRepos = function() {
      var self, tree, _i, _len, _ref;
      self = this;
      _ref = this.treeViewGitModifiedPaneViewArray;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tree = _ref[_i];
        tree.hide();
      }
      return Promise.all(atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project))).then(function(repos) {
        var repo, treeViewGitModifiedPaneView, _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = repos.length; _j < _len1; _j++) {
          repo = repos[_j];
          if (repo.repo === null) {
            _results.push((function() {
              var _k, _len2, _ref1, _results1;
              _ref1 = self.treeViewGitModifiedPaneViewArray;
              _results1 = [];
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                tree = _ref1[_k];
                if (repo.path === tree.repo.path) {
                  _results1.push(tree.show());
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          } else {
            treeViewGitModifiedPaneView = new TreeViewGitModifiedPaneView(repo);
            treeViewGitModifiedPaneView.setRepo(repo);
            self.treeViewGitModifiedPaneViewArray.push(treeViewGitModifiedPaneView);
            self.element.appendChild(treeViewGitModifiedPaneView.element);
            _results.push(self.paneSub.add(atom.workspace.observePanes((function(_this) {
              return function(pane) {
                return treeViewGitModifiedPaneView.setPane(pane);
              };
            })(this))));
          }
        }
        return _results;
      });
    };

    TreeViewGitModifiedView.prototype.serialize = function() {};

    TreeViewGitModifiedView.prototype.destroy = function() {
      this.element.remove();
      return this.paneSub.dispose();
    };

    TreeViewGitModifiedView.prototype.getElement = function() {
      return this.element;
    };

    TreeViewGitModifiedView.prototype.toggle = function() {
      if (this.element.parentElement != null) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    TreeViewGitModifiedView.prototype.hide = function() {
      return this.element.remove();
    };

    TreeViewGitModifiedView.prototype.show = function() {
      return requirePackages('tree-view').then((function(_this) {
        return function(_arg) {
          var parentElement, treeView;
          treeView = _arg[0];
          treeView.treeView.find('.tree-view-scroller').css('background', treeView.treeView.find('.tree-view').css('background'));
          parentElement = treeView.treeView.element.querySelector('.tree-view-scroller .tree-view');
          return parentElement.insertBefore(_this.element, parentElement.firstChild);
        };
      })(this));
    };

    return TreeViewGitModifiedView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1tb2RpZmllZC9saWIvdHJlZS12aWV3LWdpdC1tb2RpZmllZC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRkFBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsWUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUdBLDJCQUFBLEdBQThCLE9BQUEsQ0FBUSxvQ0FBUixDQUg5QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsaUNBQUMsZUFBRCxHQUFBO0FBR1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQVgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGdDQUFELEdBQW9DLEVBRnBDLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLG1CQUpYLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FOQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDekMsS0FBQyxDQUFBLFNBQUQsQ0FBQSxFQUR5QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQWIsQ0FSQSxDQUhXO0lBQUEsQ0FBYjs7QUFBQSxzQ0FzQkEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsMEJBQUE7QUFBQSxNQUFBLElBQUEs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

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-modified/lib/tree-view-git-modified-view.coffee
