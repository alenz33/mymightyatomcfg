(function() {
  var ParseRegex, Regex2RailRoadDiagram, RegexRailroadDiagram, WorkspaceView, _ref;

  WorkspaceView = require('atom').WorkspaceView;

  RegexRailroadDiagram = require('../lib/regex-railroad-diagram');

  _ref = require('../lib/regex-to-railroad'), ParseRegex = _ref.ParseRegex, Regex2RailRoadDiagram = _ref.Regex2RailRoadDiagram;

  describe("RegexRailroadDiagram", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      activationPromise = atom.packages.activatePackage('regex-railroad-diagram');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        debugger;
      });
    });
    describe("regex-to-railroad diagram converter", function() {
      it("parses a regex with alternatives", function() {
        var r;
        r = ParseRegex(/a|b|c/);
        return expect(r.toString()).toEqual({
          type: 'alternate',
          offset: 0,
          text: 'a|b|c',
          left: {
            type: 'match',
            offset: 0,
            text: 'a',
            body: [
              {
                type: 'literal',
                offset: 0,
                text: 'a',
                body: 'a',
                escaped: false
              }
            ]
          },
          right: {
            type: 'alternate',
            offset: 2,
            text: 'b|c',
            left: {
              type: 'match',
              offset: 2,
              text: 'b',
              body: [
                {
                  type: 'literal',
                  offset: 2,
                  text: 'b',
                  body: 'b',
                  escaped: false
                }
              ]
            },
            right: {
              type: 'match',
              offset: 4,
              text: 'c',
              body: [
                {
                  type: 'literal',
                  offset: 4,
                  text: 'c',
                  body: 'c',
                  escaped: false
                }
              ]
            }
          }
        }.toString());
      });
      return it("parses a regex", function() {
        var r;
        r = Regex2RailRoadDiagram(/foo*/, null);
        return expect(r).toBe("foo");
      });
    });
    return describe("when the regex-railroad-diagram:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.regex-railroad-diagram')).not.toExist();
        atom.workspaceView.trigger('regex-railroad-diagram:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.regex-railroad-diagram')).toExist();
          atom.workspaceView.trigger('regex-railroad-diagram:toggle');
          return expect(atom.workspaceView.find('.regex-railroad-diagram')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcmVnZXgtcmFpbHJvYWQtZGlhZ3JhbS9zcGVjL3JlZ2V4LXJhaWxyb2FkLWRpYWdyYW0tc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEVBQUE7O0FBQUEsRUFBQyxnQkFBaUIsT0FBQSxDQUFRLE1BQVIsRUFBakIsYUFBRCxDQUFBOztBQUFBLEVBQ0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLCtCQUFSLENBRHZCLENBQUE7O0FBQUEsRUFHQSxPQUFzQyxPQUFBLENBQVEsMEJBQVIsQ0FBdEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsNkJBQUEscUJBSGIsQ0FBQTs7QUFBQSxFQVdBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxpQkFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsZ0JBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QixDQURwQixDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLGtCQURjO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGlCQURHO01BQUEsQ0FBTCxFQU5TO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVdBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7QUFFOUMsTUFBQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxH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

//# sourceURL=/home/alenz/.atom/packages/regex-railroad-diagram/spec/regex-railroad-diagram-spec.coffee
