(function() {
  var CompositeDisposable, TreeViewGitModifiedPaneView, TreeViewGitModifiedView, requirePackages;

  requirePackages = require('atom-utils').requirePackages;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  TreeViewGitModifiedPaneView = require('./tree-view-git-modified-pane-view');

  module.exports = TreeViewGitModifiedView = (function() {
    function TreeViewGitModifiedView(serializedState) {
      this.element = document.createElement('div');
      this.element.classList.add('tree-view-git-modified');
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
        tree.destroy();
      }
      return Promise.all(atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project))).then(function(repos) {
        var repo, treeViewGitModifiedPaneView, _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = repos.length; _j < _len1; _j++) {
          repo = repos[_j];
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
          var treeView;
          treeView = _arg[0];
          treeView.treeView.find('.tree-view-scroller').css('background', treeView.treeView.find('.tree-view').css('background'));
          return treeView.treeView.prepend(_this.element);
        };
      })(this));
    };

    return TreeViewGitModifiedView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1tb2RpZmllZC9saWIvdHJlZS12aWV3LWdpdC1tb2RpZmllZC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRkFBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsWUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUdBLDJCQUFBLEdBQThCLE9BQUEsQ0FBUSxvQ0FBUixDQUg5QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsaUNBQUMsZUFBRCxHQUFBO0FBR1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsd0JBQXZCLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGdDQUFELEdBQW9DLEVBSnBDLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLG1CQU5YLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FSQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDdkMsS0FBQyxDQUFBLFNBQUQsQ0FBQSxFQUR1QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQWIsQ0FWQSxDQUhXO0lBQUEs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

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-modified/lib/tree-view-git-modified-view.coffee
