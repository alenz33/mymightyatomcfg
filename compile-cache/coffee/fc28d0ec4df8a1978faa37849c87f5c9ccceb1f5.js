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
      require('atom-package-deps').install();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLWNwcGxpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQUpGO0FBQUEsTUFNQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMseUJBRFQ7T0FQRjtBQUFBLE1BU0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxZQUFsQyxDQURUO09BVkY7S0FERjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENB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

//# sourceURL=/home/alenz/.atom/packages/linter-cpplint/lib/init.coffee
