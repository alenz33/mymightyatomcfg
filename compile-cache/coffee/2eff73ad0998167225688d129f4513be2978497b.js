(function() {
  var TreeViewGitModified;

  TreeViewGitModified = require('../lib/tree-view-git-modified');

  describe("TreeViewGitModified", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('tree-view-git-modified');
    });
    return describe("when the tree-view-git-modified:show event is triggered", function() {
      return it("shows the modal panel", function() {
        expect(workspaceElement.querySelector('.tree-view-git-modified')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'tree-view-git-modified:show');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(workspaceElement.querySelector('.tree-view-git-modified')).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1tb2RpZmllZC9zcGVjL3RyZWUtdmlldy1naXQtbW9kaWZpZWQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsK0JBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMseURBQVQsRUFBb0UsU0FBQSxHQUFBO2FBQ2xFLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFHMUIsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IseUJBQS9CLENBQVAsQ0FBaUUsQ0FBQyxHQUFHLENBQUMsT0FBdEUsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDLENBSkEsQ0FBQTtBQUFBLFFBTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQU5BLENBQUE7ZUFTQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQix5QkFBL0IsQ0FBUCxDQUFpRSxDQUFDLE9BQWxFLENBQUEsRUFERztRQUFBLENBQUwsRUFaMEI7TUFBQSxDQUE1QixFQURrRTtJQUFBLENBQXBFLEVBUDhCO0VBQUEsQ0FBaEMsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-modified/spec/tree-view-git-modified-spec.coffee
