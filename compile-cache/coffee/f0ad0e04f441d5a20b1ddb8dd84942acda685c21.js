(function() {
  var CompositeDisposable, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  module.exports = {
    config: {
      lineLength: {
        type: 'integer',
        "default": '80'
      },
      filters: {
        type: 'string',
        "default": ''
      },
      extensions: {
        type: 'string',
        "default": 'c++,cc,cpp,cu,cuh,h,hpp'
      },
      executablePath: {
        type: 'string',
        "default": path.join(__dirname, '..', 'bin', 'cpplint.py')
      }
    },
    activate: function() {
      require('atom-package-deps').install('linter-cpplint');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-cpplint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.cpplintPath = executablePath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-cpplint.lineLength', (function(_this) {
        return function() {
          return _this.updateParameters();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-cpplint.filters', (function(_this) {
        return function() {
          return _this.updateParameters();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-cpplint.extensions', (function(_this) {
        return function() {
          return _this.updateParameters();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        name: 'cpplint',
        grammarScopes: ['source.cpp'],
        scope: 'file',
        lintOnFly: false,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, parameters;
            filePath = textEditor.getPath();
            parameters = _this.parameters.slice();
            parameters.push(filePath);
            return helpers.exec(_this.cpplintPath, parameters, {
              stream: 'stderr'
            }).then(function(result) {
              var line, match, message, range, regex, toReturn;
              toReturn = [];
              regex = /.+:(\d+):(.+)\[\d+\]/g;
              while ((match = regex.exec(result)) !== null) {
                line = parseInt(match[1]) || 1;
                message = match[2];
                line = Math.max(0, line - 1);
                range = [[line, 0], [line, textEditor.getBuffer().lineLengthForRow(line)]];
                toReturn.push({
                  type: 'Warning',
                  text: message,
                  filePath: filePath,
                  range: range
                });
              }
              return toReturn;
            });
          };
        })(this)
      };
    },
    updateParameters: function() {
      var extensions, filters, lineLength, parameters;
      lineLength = atom.config.get('linter-cpplint.lineLength');
      filters = atom.config.get('linter-cpplint.filters');
      extensions = atom.config.get('linter-cpplint.extensions');
      parameters = [];
      if (lineLength) {
        parameters.push('--linelength', lineLength);
      }
      if (filters) {
        parameters.push('--filter', filters);
      }
      if (extensions) {
        parameters.push('--extensions', extensions);
      }
      return this.parameters = parameters;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLWNwcGxpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQUpGO0FBQUEsTUFNQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMseUJBRFQ7T0FQRjtBQUFBLE1BU0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxZQUFsQyxDQURUO09BVkY7S0FERjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsZ0JBQXJDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFD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

//# sourceURL=/home/alenz/.atom/packages/linter-cpplint/lib/init.coffee
