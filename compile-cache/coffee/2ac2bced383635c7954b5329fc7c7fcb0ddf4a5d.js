(function() {
  var TreeViewGitStatus, fs, path, temp;

  TreeViewGitStatus = require('../lib/main');

  fs = require('fs-plus');

  path = require('path');

  temp = require('temp').track();

  describe("TreeViewGitStatus", function() {
    var extractGitRepoFixture, fixturesPath, gitStatus, treeView, validateProjectPaths, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], gitStatus = _ref[1], treeView = _ref[2], fixturesPath = _ref[3];
    beforeEach(function() {
      fixturesPath = atom.project.getPaths()[0];
      atom.project.removePath(fixturesPath);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('tree-view-git-status').then(function(pkg) {
          gitStatus = pkg.mainModule;
          treeView = gitStatus.treeView;
          return gitStatus.ignoreRepository((path.resolve(fixturesPath, '..', '..').split(path.sep)).join('/'));
        });
      });
    });
    afterEach(function() {
      return temp.cleanup();
    });
    it('activates the TreeViewGitStatus package', function() {
      expect(gitStatus).toBeDefined();
      return expect(gitStatus.treeView).toBeDefined();
    });
    it('adds valid Git repositories to the repository map', function() {
      var projPaths;
      projPaths = [extractGitRepoFixture(fixturesPath, 'git-project')];
      atom.project.setPaths(projPaths);
      validateProjectPaths(projPaths);
      expect(gitStatus.toggled).toBe(true);
      expect(atom.project.getRepositories().length).toBe(1);
      return expect(gitStatus.repositoryMap.size).toBe(1);
    });
    it('disables the TreeViewGitStatus when toggled', function() {
      var projPaths, root, rootPath, _i, _j, _len, _len1, _ref1, _ref2;
      projPaths = [extractGitRepoFixture(fixturesPath, 'git-project')];
      atom.project.setPaths(projPaths);
      validateProjectPaths(projPaths);
      expect(gitStatus.toggled).toBe(true);
      expect(gitStatus.repositoryMap.size).toBe(1);
      _ref1 = treeView.roots;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        root = _ref1[_i];
        rootPath = gitStatus.normalizePath(root.directoryName.dataset.path);
        expect(gitStatus.repositoryMap.keys().next().value).toBe(rootPath);
        expect(gitStatus.repositoryMap.has(rootPath)).toBe(true);
        expect(root.header.querySelector('span.tree-view-git-status')).toExist();
      }
      gitStatus.toggle();
      _ref2 = treeView.roots;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        root = _ref2[_j];
        expect(root.header.querySelector('span.tree-view-git-status')).not.toExist();
      }
      expect(gitStatus.toggled).toBe(false);
      expect(gitStatus.subscriptions.disposed).toBe(true);
      expect(gitStatus.repositorySubscriptions.disposed).toBe(true);
      expect(gitStatus.repositoryMap.size).toBe(0);
      return expect(gitStatus.ignoredRepositories.size).not.toBeNull();
    });
    it('skips adding the TreeViewGitStatus on none Git projects', function() {
      var projPaths, root, _i, _len, _ref1, _results;
      projPaths = [path.join(fixturesPath, 'none-git-project')];
      atom.project.setPaths(projPaths);
      validateProjectPaths(projPaths);
      expect(gitStatus.toggled).toBe(true);
      _ref1 = treeView.roots;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        root = _ref1[_i];
        _results.push(expect(root.header.querySelector('span.tree-view-git-status')).not.toExist());
      }
      return _results;
    });
    describe('when deactivated', function() {
      beforeEach(function() {
        var projPaths;
        projPaths = [extractGitRepoFixture(fixturesPath, 'git-project')];
        atom.project.setPaths(projPaths);
        validateProjectPaths(projPaths);
        expect(gitStatus.toggled).toBe(true);
        expect(atom.project.getRepositories().length).toBe(1);
        return runs(function() {
          return gitStatus.deactivate();
        });
      });
      it('destroys the TreeViewGitStatus instance', function() {
        expect(gitStatus.active).toBe(false);
        expect(gitStatus.toggled).toBe(false);
        expect(gitStatus.subscriptions).toBeNull();
        expect(gitStatus.treeView).toBeNull();
        expect(gitStatus.repositorySubscriptions).toBeNull();
        expect(gitStatus.treeViewRootsMap).toBeNull();
        expect(gitStatus.repositoryMap).toBeNull();
        return expect(gitStatus.ignoredRepositories).toBeNull();
      });
      return it('destroys the Git Status elements that were added to the DOM', function() {
        var root, _i, _len, _ref1, _results;
        _ref1 = treeView.roots;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          root = _ref1[_i];
          _results.push(expect(root.header.querySelector('span.tree-view-git-status')).not.toExist());
        }
        return _results;
      });
    });
    extractGitRepoFixture = function(fixturesPath, dotGitFixture) {
      var dotGit, dotGitFixturePath;
      dotGitFixturePath = path.join(fixturesPath, dotGitFixture, 'git.git');
      dotGit = path.join(temp.mkdirSync('repo'), '.git');
      fs.copySync(dotGitFixturePath, dotGit);
      return path.resolve(dotGit, '..');
    };
    return validateProjectPaths = function(projPaths) {
      var pPath, _i, _len, _ref1;
      expect(atom.project.getPaths().length).toBe(projPaths.length);
      _ref1 = atom.project.getPaths();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        pPath = _ref1[_i];
        expect(projPaths.indexOf(pPath)).toBeGreaterThan(-1);
      }
      return expect(treeView.roots.length).toBe(projPaths.length);
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1zdGF0dXMvc3BlYy90cmVlLXZpZXctZ2l0LXN0YXR1cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxhQUFSLENBQXBCLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUhQLENBQUE7O0FBQUEsRUFVQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsc0dBQUE7QUFBQSxJQUFBLE9BQXdELEVBQXhELEVBQUMsMEJBQUQsRUFBbUIsbUJBQW5CLEVBQThCLGtCQUE5QixFQUF3QyxzQkFBeEMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUF2QyxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsWUFBeEIsQ0FEQSxDQUFBO0FBQUEsTUFHQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBSG5CLENBQUE7QUFBQSxNQUlBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUpBLENBQUE7YUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENB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

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-status/spec/tree-view-git-status-spec.coffee
