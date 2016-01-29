(function() {
  var BufferedProcess, BundlerDirectory, CompositeDisposable, Directory, DirectoryView, File, FileView, TreeViewBundlerView, fs, path, treeViewPath, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  _ = require('underscore-plus');

  fs = require('fs');

  path = require('path');

  treeViewPath = atom.packages.resolvePackagePath('tree-view');

  DirectoryView = require("" + treeViewPath + "/lib/directory-view");

  Directory = require("" + treeViewPath + "/lib/directory");

  FileView = require("" + treeViewPath + "/lib/file-view");

  File = require("" + treeViewPath + "/lib/file");

  BundlerDirectory = (function(_super) {
    __extends(BundlerDirectory, _super);

    function BundlerDirectory() {
      return BundlerDirectory.__super__.constructor.apply(this, arguments);
    }

    BundlerDirectory.prototype.preloadGems = function() {
      var args, command, exit, gems, options, stderr, stdout;
      this.directories = [];
      gems = [];
      command = 'bundle';
      args = ['show', '--paths'];
      options = {
        cwd: this.fullProjectPath,
        env: process.env
      };
      stdout = (function(_this) {
        return function(output) {
          return _.each(output.split("\n"), function(gemLine) {
            var match;
            match = gemLine.match('^.*\/(.*)-(.*)?');
            if (match != null) {
              return gems.push({
                path: match[0],
                name: match[1],
                version: match[2]
              });
            }
          });
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {};
      })(this);
      exit = (function(_this) {
        return function(code) {
          if (0 === code) {
            return gems.forEach(function(gem) {
              return _this.directories.push(new Directory({
                name: "" + gem.name + " " + gem.version,
                fullPath: gem.path,
                symlink: false,
                expansionState: {
                  isExpanded: false
                },
                ignoredPatterns: []
              }));
            });
          }
        };
      })(this);
      return new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    BundlerDirectory.prototype.getEntries = function() {
      return this.sortEntries(this.directories);
    };

    return BundlerDirectory;

  })(Directory);

  TreeViewBundlerView = (function() {
    function TreeViewBundlerView(fullProjectPath) {
      var directory;
      this.gnoredPaths = [];
      directory = new BundlerDirectory({
        name: 'Bundled Gems',
        fullPath: '',
        symlink: false,
        isRoot: true,
        expansionState: {
          isExpanded: false
        },
        ignoredPaths: this.ignoredPaths
      });
      directory.fullProjectPath = fullProjectPath;
      directory.preloadGems();
      this.view = new DirectoryView();
      this.view.initialize(directory);
    }

    TreeViewBundlerView.prototype.getElement = function() {
      return this.view;
    };

    return TreeViewBundlerView;

  })();

  module.exports = TreeViewBundlerView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWJ1bmRsZXIvbGliL3RyZWUtdmlldy1idW5kbGVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsMkJBQUEsbUJBQWxCLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsV0FBakMsQ0FKZixDQUFBOztBQUFBLEVBT0EsYUFBQSxHQUFnQixPQUFBLENBQVEsRUFBQSxHQUFHLFlBQUgsR0FBZ0IscUJBQXhCLENBUGhCLENBQUE7O0FBQUEsRUFRQSxTQUFBLEdBQVksT0FBQSxDQUFRLEVBQUEsR0FBRyxZQUFILEdBQWdCLGdCQUF4QixDQVJaLENBQUE7O0FBQUEsRUFTQSxRQUFBLEdBQVcsT0FBQSxDQUFRLEVBQUEsR0FBRyxZQUFILEdBQWdCLGdCQUF4QixDQVRYLENBQUE7O0FBQUEsRUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLEVBQUEsR0FBRyxZQUFILEdBQWdCLFdBQXhCLENBVlAsQ0FBQTs7QUFBQSxFQWFNO0FBQ0YsdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLGtEQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBQWYs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

//# sourceURL=/home/alenz/.atom/packages/tree-view-bundler/lib/tree-view-bundler-view.coffee
