(function() {
  var TreeViewBundler;

  TreeViewBundler = require('../lib/tree-view-bundler');

  describe("TreeViewBundler", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('tree-view-bundler');
    });
    return describe("when the tree-view-bundler:update event is triggered", function() {
      it("shows bundler as folder and gems for it", function() {});
      return it("hides unused unlisted gems", function() {});
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWJ1bmRsZXIvc3BlYy90cmVlLXZpZXctYnVuZGxlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsMEJBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLG1CQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsc0RBQVQsRUFBaUUsU0FBQSxHQUFBO0FBQy9ELE1BQUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQSxDQUE5QyxDQUFBLENBQUE7YUFFQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBLENBQWpDLEVBSCtEO0lBQUEsQ0FBakUsRUFQMEI7RUFBQSxDQUE1QixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/tree-view-bundler/spec/tree-view-bundler-spec.coffee
