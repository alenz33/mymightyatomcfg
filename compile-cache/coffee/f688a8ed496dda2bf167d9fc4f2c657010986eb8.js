(function() {
  var CompositeDisposable, TreeViewBundler, TreeViewBundlerView, fs;

  CompositeDisposable = require('atom').CompositeDisposable;

  TreeViewBundlerView = require('./tree-view-bundler-view');

  fs = require('fs');

  module.exports = TreeViewBundler = {
    treeView: null,
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      atom.packages.activatePackage('tree-view').then((function(_this) {
        return function(treeViewPkg) {
          _this.treeView = treeViewPkg.mainModule.createView();
          _this.subscribeUpdateEvents();
          return _this.update();
        };
      })(this))["catch"](function(error) {
        return console.error(error, error.stack);
      });
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'tree-view-bundler:update': (function(_this) {
          return function() {
            return _this.update();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      if (this.treeView != null) {
        this.clearRoots(this.treeView.roots);
      }
      this.subscriptions = null;
      return this.treeView = null;
    },
    serialize: function() {},
    update: function() {
      if (!this.treeView) {
        return;
      }
      return this.treeView.roots.forEach(function(root) {
        return fs.exists("" + (root.getPath()) + "/Gemfile", (function(_this) {
          return function(exists) {
            var bundlerView;
            if (exists) {
              bundlerView = new TreeViewBundlerView(root.getPath());
              return root.entries.appendChild(bundlerView.getElement());
            }
          };
        })(this));
      });
    },
    subscribeUpdateEvents: function() {
      return this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWJ1bmRsZXIvbGliL3RyZWUtdmlldy1idW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2REFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDBCQUFSLENBRHRCLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsZUFBQSxHQUNmO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxXQUFELEdBQUE7QUFDOUMsVUFBQSxLQUFDLENBQUEsUUFBRCxHQUFZLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBdkIsQ0FBQSxDQUFaLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxxQkFBRCxDQUFBLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBSDhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsQ0FLQSxDQUFDLE9BQUQsQ0FMQSxDQUtPLFNBQUMsS0FBRCxHQUFBO2VBQ0wsT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLEVBQXFCLEtBQUssQ0FBQyxLQUEzQixFQURLO01BQUEsQ0FMUCxDQUZBLENBQUE7YUFXQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7T0FBcEMsQ0FBbkIsRUFaUTtJQUFBLENBSFY7QUFBQSxJQWlCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcscUJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUF0QixDQUFBLENBREY7T0FEQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFIakIsQ0FBQTthQUlBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FMRjtJQUFBLENBakJaO0FBQUEsSUF3QkEsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQXhCWDtBQUFBLElBMEJBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsUUFBZjtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBaEIsQ0FBd0IsU0FBQyxJQUFELEdBQUE7ZUFDdEIsRUFBRSxDQUFDLE1BQUgsQ0FBVSxFQUFBLEdBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFBLENBQUQsQ0FBRixHQUFrQixVQUE1QixFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ3JDLGdCQUFBLFdBQUE7QUFBQSxZQUFBLElBQUcsTUFBSDtBQUNFLGNBQUEsV0FBQSxHQUFrQixJQUFBLG1CQUFBLENBQW9CLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBcEIsQ0FBbEIsQ0FBQTtxQkFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQWIsQ0FBeUIsV0FBVyxDQUFDLFVBQVosQ0FBQSxDQUF6QixFQUZGO2FBRHFDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsRUFEc0I7TUFBQSxDQUF4QixFQUhNO0lBQUEsQ0ExQlI7QUFBQSxJQW1DQSxxQkFBQSxFQUF1QixTQUFBLEdBQUE7YUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDL0MsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUQrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQW5CLEVBRHFCO0lBQUEsQ0FuQ3ZCO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/tree-view-bundler/lib/tree-view-bundler.coffee
