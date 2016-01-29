(function() {
  var BufferedNodeProcess, BufferedProcess, Helpers, XRegExp, fs, path, xcache, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, BufferedNodeProcess = _ref.BufferedNodeProcess;

  path = require('path');

  fs = require('fs');

  path = require('path');

  xcache = new Map;

  XRegExp = null;

  module.exports = Helpers = {
    exec: function(command, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(command, args, options, false);
    },
    execNode: function(filePath, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(filePath, args, options, true);
    },
    _exec: function(command, args, options, isNodeExecutable) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (isNodeExecutable == null) {
        isNodeExecutable = false;
      }
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (options.throwOnStdErr == null) {
        options.throwOnStdErr = false;
      }
      return new Promise(function(resolve, reject) {
        var data, exit, prop, spawnedProcess, stderr, stdout, value, _ref1;
        data = {
          stdout: [],
          stderr: []
        };
        stdout = function(output) {
          return data.stdout.push(output.toString());
        };
        stderr = function(output) {
          return data.stderr.push(output.toString());
        };
        exit = function() {
          if (options.stream === 'stdout') {
            if (data.stderr.length && options.throwOnStdErr) {
              return reject(data.stderr.join(''));
            } else {
              return resolve(data.stdout.join(''));
            }
          } else {
            return resolve(data.stderr.join(''));
          }
        };
        if (isNodeExecutable) {
          if (options.env == null) {
            options.env = {};
          }
          _ref1 = process.env;
          for (prop in _ref1) {
            value = _ref1[prop];
            if (prop !== 'OS') {
              options.env[prop] = value;
            }
          }
          spawnedProcess = new BufferedNodeProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        } else {
          spawnedProcess = new BufferedProcess({
            command: command,
            args: args,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        }
        spawnedProcess.onWillThrowError(reject);
        if (options.stdin) {
          spawnedProcess.process.stdin.write(options.stdin.toString());
          return spawnedProcess.process.stdin.end();
        }
      });
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref1;
      if (options == null) {
        options = {
          baseReduction: 1
        };
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex));
      }
      if (typeof data !== 'string') {
        throw new Error("Input must be a string");
      }
      _ref1 = data.split(/\r?\n/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        match = XRegExp.exec(line, regex);
        if (match) {
          if (!options.baseReduction) {
            options.baseReduction = 1;
          }
          lineStart = 0;
          if (match.line) {
            lineStart = match.line - options.baseReduction;
          }
          if (match.lineStart) {
            lineStart = match.lineStart - options.baseReduction;
          }
          colStart = 0;
          if (match.col) {
            colStart = match.col - options.baseReduction;
          }
          if (match.colStart) {
            colStart = match.colStart - options.baseReduction;
          }
          lineEnd = 0;
          if (match.line) {
            lineEnd = match.line - options.baseReduction;
          }
          if (match.lineEnd) {
            lineEnd = match.lineEnd - options.baseReduction;
          }
          colEnd = 0;
          if (match.col) {
            colEnd = match.col - options.baseReduction;
          }
          if (match.colEnd) {
            colEnd = match.colEnd - options.baseReduction;
          }
          filePath = match.file;
          if (options.filePath) {
            filePath = options.filePath;
          }
          toReturn.push({
            type: match.type,
            text: match.message,
            filePath: filePath,
            range: [[lineStart, colStart], [lineEnd, colEnd]]
          });
        }
      }
      return toReturn;
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, name, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLWNwcGxpbnQvbm9kZV9tb2R1bGVzL2F0b20tbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4RUFBQTs7QUFBQSxFQUFBLE9BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsdUJBQUEsZUFBRCxFQUFrQiwyQkFBQSxtQkFBbEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxHQUFBLENBQUEsR0FKVCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLElBTFYsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FJZjtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBcUIsT0FBckIsR0FBQTs7UUFBVSxPQUFPO09BQ3JCOztRQUR5QixVQUFVO09BQ25DO0FBQUEsTUFBQSxJQUFBLENBQUEsU0FBc0QsQ0FBQyxNQUF2RDtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FBVixDQUFBO09BQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBUCxFQUFnQixJQUFoQixFQUFzQixPQUF0QixFQUErQixLQUEvQixDQUFQLENBRkk7SUFBQSxDQUFOO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQyxRQUFELEVBQVcsSUFBWCxFQUFzQixPQUF0QixHQUFBOztRQUFXLE9BQU87T0FDMUI7O1FBRDhCLFVBQVU7T0FD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

//# sourceURL=/home/alenz/.atom/packages/linter-cpplint/node_modules/atom-linter/lib/helpers.coffee
