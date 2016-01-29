(function() {
  module.exports = {
    config: {
      pep8ExecutablePath: {
        type: 'string',
        "default": 'pep8'
      },
      maxLineLength: {
        type: 'integer',
        "default": 0
      },
      ignoreErrorCodes: {
        type: 'array',
        "default": [],
        description: 'For a list of code visit http://pep8.readthedocs.org/en/latest/intro.html#error-codes'
      }
    },
    activate: function() {},
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        grammarScopes: ['source.python'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var filePath, ignoreCodes, maxLineLength, parameters;
          filePath = textEditor.getPath();
          parameters = [];
          if (maxLineLength = atom.config.get('linter-pep8.maxLineLength')) {
            parameters.push("--max-line-length=" + maxLineLength);
          }
          if (ignoreCodes = atom.config.get('linter-pep8.ignoreErrorCodes')) {
            parameters.push("--ignore=" + (ignoreCodes.join(',')));
          }
          parameters.push('-');
          return helpers.exec(atom.config.get('linter-pep8.pep8ExecutablePath'), parameters, {
            stdin: textEditor.getText()
          }).then(function(result) {
            var col, line, match, regex, toReturn;
            toReturn = [];
            regex = /stdin:(\d+):(\d+):(.*)/g;
            while ((match = regex.exec(result)) !== null) {
              line = parseInt(match[1]) || 0;
              col = parseInt(match[2]) || 0;
              toReturn.push({
                type: "Error",
                text: match[3],
                filePath: filePath,
                range: [[line - 1, col - 1], [line - 1, col]]
              });
            }
            return toReturn;
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXBlcDgvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxNQURUO09BREY7QUFBQSxNQUdBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQURUO09BSkY7QUFBQSxNQU1BLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHVGQUZiO09BUEY7S0FERjtBQUFBLElBWUEsUUFBQSxFQUFVLFNBQUEsR0FBQSxDQVpWO0FBQUEsSUFjQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxpQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSLENBQVYsQ0FBQTthQUNBLFFBQUEsR0FDRTtBQUFBLFFBQUEsYUFBQSxFQUFlLENBQUMsZUFBRCxDQUFmO0FBQUEsUUFDQSxLQUFBLEVBQU8sTUFEUDtBQUFBLFFBRUEsU0FBQSxFQUFXLElBRlg7QUFBQSxRQUdBLElBQUEsRUFBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLGNBQUEsZ0RBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVgsQ0FBQTtBQUFBLFVBQ0EsVUFBQSxHQUFhLEVBRGIsQ0FBQTtBQUVBLFVBQUEsSUFBRyxhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsQ0FBbkI7QUFDRSxZQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWlCLG9CQUFBLEdBQW9CLGFBQXJDLENBQUEsQ0FERjtXQUZBO0FBSUEsVUFBQSxJQUFHLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQWpCO0FBQ0UsWUFBQSxVQUFVLENBQUMsSUFBWCxDQUFpQixXQUFBLEdBQVUsQ0FBQyxXQUFXLENBQUMsSUFBWixDQUFpQixHQUFqQixDQUFELENBQTNCLENBQUEsQ0FERjtXQUpBO0FBQUEsVUFNQSxVQUFVLENBQUMsSUFBWCxDQUFnQixHQUFoQixDQU5BLENBQUE7QUFPQSxpQkFBTyxPQUFPLENBQUMsSUFBUixDQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FBYixFQUFnRSxVQUFoRSxFQUE0RTtBQUFBLFlBQUMsS0FBQSxFQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBUjtXQUE1RSxDQUEwRyxDQUFDLElBQTNHLENBQWdILFNBQUMsTUFBRCxHQUFBO0FBQ3JILGdCQUFBLGlDQUFBO0FBQUEsWUFBQSxRQUFBLEdBQVcsRUFBWCxDQUFBO0FBQUEsWUFDQSxLQUFBLEdBQVEseUJBRFIsQ0FBQTtBQUVBLG1CQUFNLENBQUMsS0FBQSxHQUFRLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxDQUFULENBQUEsS0FBa0MsSUFBeEMsR0FBQTtBQUNFLGNBQUEsSUFBQSxHQUFPLFFBQUEsQ0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLENBQUEsSUFBc0IsQ0FBN0IsQ0FBQTtBQUFBLGNBQ0EsR0FBQSxHQUFNLFFBQUEsQ0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLENBQUEsSUFBc0IsQ0FENUIsQ0FBQTtBQUFBLGNBRUEsUUFBUSxDQUFDLElBQVQsQ0FBYztBQUFBLGdCQUNaLElBQUEsRUFBTSxPQURNO0FBQUEsZ0JBRVosSUFBQSxFQUFNLEtBQU0sQ0FBQSxDQUFBLENBRkE7QUFBQSxnQkFHWixVQUFBLFFBSFk7QUFBQSxnQkFJWixLQUFBLEVBQU8sQ0FBQyxDQUFDLElBQUEsR0FBTyxDQUFSLEVBQVcsR0FBQSxHQUFNLENBQWpCLENBQUQsRUFBc0IsQ0FBQyxJQUFBLEdBQU8sQ0FBUixFQUFXLEdBQVgsQ0FBdEIsQ0FKSztlQUFkLENBRkEsQ0FERjtZQUFBLENBRkE7QUFXQSxtQkFBTyxRQUFQLENBWnFIO1VBQUEsQ0FBaEgsQ0FBUCxDQVJJO1FBQUEsQ0FITjtRQUhXO0lBQUEsQ0FkZjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/linter-pep8/lib/main.coffee
