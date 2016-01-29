(function() {
  var ScriptRunner;

  ScriptRunner = require('../lib/script-runner');

  describe("ScriptRunner", function() {
    var activationPromise, workspaceElement;
    activationPromise = null;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getVew(atom.workspace);
      return activationPromise = atom.packages.activatePackage('script-runner');
    });
    return describe("when the script-runner:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(workspaceElement.find('.script-runner')).not.toExist();
        atom.commands.dispatch(workspaceElement('script-runner:toggle'));
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(workspaceElement.find('.script-runner')).toExist();
          atom.commands.dispatch(workspaceElement('script-runner:toggle'));
          return expect(workspaceElement.find('.script-runner')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvc2NyaXB0LXJ1bm5lci9zcGVjL3NjcmlwdC1ydW5uZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsbUNBQUE7QUFBQSxJQUFBLGlCQUFBLEdBQW9CLElBQXBCLENBQUE7QUFBQSxJQUNBLGdCQUFBLEdBQW1CLElBRG5CLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBWCxDQUFrQixJQUFJLENBQUMsU0FBdkIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUhBLENBQUE7V0FPQSxRQUFBLENBQVMsa0RBQVQsRUFBNkQsU0FBQSxHQUFBO2FBQzNELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsZ0JBQXRCLENBQVAsQ0FBK0MsQ0FBQyxHQUFHLENBQUMsT0FBcEQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBQSxDQUFpQixzQkFBakIsQ0FBdkIsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixnQkFBdEIsQ0FBUCxDQUErQyxDQUFDLE9BQWhELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQUEsQ0FBaUIsc0JBQWpCLENBQXZCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsZ0JBQXRCLENBQVAsQ0FBK0MsQ0FBQyxHQUFHLENBQUMsT0FBcEQsQ0FBQSxFQUhHO1FBQUEsQ0FBTCxFQVZ3QztNQUFBLENBQTFDLEVBRDJEO0lBQUEsQ0FBN0QsRUFSdUI7RUFBQSxDQUF6QixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/script-runner/spec/script-runner-spec.coffee
