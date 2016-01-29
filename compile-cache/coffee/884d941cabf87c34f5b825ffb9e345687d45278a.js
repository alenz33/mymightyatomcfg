(function() {
  var PythonDebugger;

  PythonDebugger = require('../lib/python-debugger');

  describe("PythonDebugger", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('pythonDebugger');
    });
    return describe("when the python-debugger:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.python-debugger')).not.toExist();
        atom.workspaceView.trigger('python-debugger:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.python-debugger')).toExist();
          atom.workspaceView.trigger('python-debugger:toggle');
          return expect(atom.workspaceView.find('.python-debugger')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYXRvbS1weXRob24tZGVidWdnZXIvc3BlYy9weXRob24tZGVidWdnZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsaUJBQUE7QUFBQSxJQUFBLGlCQUFBLEdBQW9CLElBQXBCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxhQUFMLEdBQXFCLEdBQUEsQ0FBQSxhQUFyQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGdCQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQSxHQUFBO2FBQzdELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixrQkFBeEIsQ0FBUCxDQUFtRCxDQUFDLEdBQUcsQ0FBQyxPQUF4RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQix3QkFBM0IsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLGtCQUF4QixDQUFQLENBQW1ELENBQUMsT0FBcEQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsd0JBQTNCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixrQkFBeEIsQ0FBUCxDQUFtRCxDQUFDLEdBQUcsQ0FBQyxPQUF4RCxDQUFBLEVBSEc7UUFBQSxDQUFMLEVBVndDO01BQUEsQ0FBMUMsRUFENkQ7SUFBQSxDQUEvRCxFQVB5QjtFQUFBLENBQTNCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/atom-python-debugger/spec/python-debugger-spec.coffee
