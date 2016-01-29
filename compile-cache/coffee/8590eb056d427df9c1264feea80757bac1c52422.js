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
      },
      convertAllErrorsToWarnings: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      return require('atom-package-deps').install();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        name: 'pep8',
        grammarScopes: ['source.python'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var filePath, ignoreCodes, maxLineLength, msgtype, parameters;
          filePath = textEditor.getPath();
          parameters = [];
          if (maxLineLength = atom.config.get('linter-pep8.maxLineLength')) {
            parameters.push("--max-line-length=" + maxLineLength);
          }
          if (ignoreCodes = atom.config.get('linter-pep8.ignoreErrorCodes')) {
            parameters.push("--ignore=" + (ignoreCodes.join(',')));
          }
          parameters.push('-');
          msgtype = atom.config.get('linter-pep8.convertAllErrorsToWarnings') ? 'Warning' : 'Error';
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
                type: msgtype,
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXBlcDgvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxNQURUO09BREY7QUFBQSxNQUdBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQURUO09BSkY7QUFBQSxNQU1BLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHVGQUZiO09BUEY7QUFBQSxNQVVBLDBCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQVhGO0tBREY7QUFBQSxJQWVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFBLENBQVEsbUJBQVIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFBLEVBRFE7SUFBQSxDQWZWO0FBQUEsSUFrQkEsYUFBQSxFQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsaUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUFWLENBQUE7YUFDQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsUUFDQSxhQUFBLEVBQWUsQ0FBQyxlQUFELENBRGY7QUFBQSxRQUVBLEtBQUEsRUFBTyxNQUZQO0FBQUEsUUFHQSxTQUFBLEVBQVcsSUFIWDtBQUFBLFFBSUEsSUFBQSxFQUFNLFNBQUMsVUFBRCxHQUFBO0FBQ0osY0FBQSx5REFBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBWCxDQUFBO0FBQUEsVUFDQSxVQUFBLEdBQWEsRUFEYixDQUFBO0FBRUEsVUFBQSxJQUFHLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixDQUFuQjtBQUNFLFlBQUEsVUFBVSxDQUFDLElBQVgsQ0FBaUIsb0JBQUEsR0FBb0IsYUFBckMsQ0FBQSxDQURGO1dBRkE7QUFJQSxVQUFBLElBQUcsV0FBQSxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBakI7QUFDRSxZQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWlCLFdBQUEsR0FBVSxDQUFDLFdBQVcsQ0FBQyxJQUFaLENBQWlCLEdBQWpCLENBQUQsQ0FBM0IsQ0FBQSxDQURGO1dBSkE7QUFBQSxVQU1BLFVBQVUsQ0FBQyxJQUFYLENBQWdCLEdBQWhCLENBTkEsQ0FBQTtBQUFBLFVBT0EsT0FBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsQ0FBSCxHQUFrRSxTQUFsRSxHQUFpRixPQVAzRixDQUFBO0FBUUEsaUJBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQWIsRUFBZ0UsVUFBaEUsRUFBNEU7QUFBQSxZQUFDLEtBQUEsRUFBTyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVI7V0FBNUUsQ0FBMEcsQ0FBQyxJQUEzRyxDQUFnSCxTQUFDLE1BQUQsR0FBQTtBQUNySCxnQkFBQSxpQ0FBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLEVBQVgsQ0FBQTtBQUFBLFlBQ0EsS0FBQSxHQUFRLHlCQURSLENBQUE7QUFFQSxtQkFBTSxDQUFDLEtBQUEsR0FBUSxLQUFLLENBQUMsSUFBTixDQUFXLE1BQVgsQ0FBVCxDQUFBLEtBQWtDLElBQXhDLEdBQUE7QUFDRSxjQUFBLElBQUEsR0FBTyxRQUFBLENBQVMsS0FBTSxDQUFBLENBQUEsQ0FBZixDQUFBLElBQXNCLENBQTdCLENBQUE7QUFBQSxjQUNBLEdBQUEsR0FBTSxRQUFBLENBQVMsS0FBTSxDQUFBLENBQUEsQ0FBZixDQUFBLElBQXNCLENBRDVCLENBQUE7QUFBQSxjQUVBLFFBQVEsQ0FBQyxJQUFULENBQWM7QUFBQSxnQkFDWixJQUFBLEVBQU0sT0FETTtBQUFBLGdCQUVaLElBQUEsRUFBTSxLQUFNLENBQUEsQ0FBQSxDQUZBO0FBQUEsZ0JBR1osVUFBQSxRQUhZO0FBQUEsZ0JBSVosS0FBQSxFQUFPLENBQUMsQ0FBQyxJQUFBLEdBQU8sQ0FBUixFQUFXLEdBQUEsR0FBTSxDQUFqQixDQUFELEVBQXNCLENBQUMsSUFBQSxHQUFPLENBQVIsRUFBVyxHQUFYLENBQXRCLENBSks7ZUFBZCxDQUZBLENBREY7WUFBQSxDQUZBO0FBV0EsbUJBQU8sUUFBUCxDQVpxSDtVQUFBLENBQWhILENBQVAsQ0FUSTtRQUFBLENBSk47UUFIVztJQUFBLENBbEJmO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/linter-pep8/lib/main.coffee
