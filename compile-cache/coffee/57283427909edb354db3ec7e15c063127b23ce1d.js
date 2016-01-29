(function() {
  var Helpers, XRegExp, child_process, fs, path, xcache;

  child_process = require('child_process');

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
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return new Promise(function(resolve, reject) {
        var data, spawnedProcess;
        spawnedProcess = child_process.spawn(command, args, options);
        data = [];
        if (options.stream === 'stdout') {
          spawnedProcess.stdout.on('data', function(d) {
            return data.push(d.toString());
          });
        } else if (options.stream === 'stderr') {
          spawnedProcess.stderr.on('data', function(d) {
            return data.push(d.toString());
          });
        }
        if (options.stdin) {
          spawnedProcess.stdin.write(options.stdin.toString());
          spawnedProcess.stdin.end();
        }
        spawnedProcess.on('error', function(err) {
          return reject(err);
        });
        return spawnedProcess.on('close', function() {
          return resolve(data.join(''));
        });
      });
    },
    execFilePath: function(command, args, filePath, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      if (!filePath) {
        throw new Error("No File Path to work with.");
      }
      return new Promise(function(resolve) {
        if (!options.cwd) {
          options.cwd = path.dirname(filePath);
        }
        args.push(filePath);
        return resolve(Helpers.exec(command, args, options));
      });
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref;
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
      _ref = data.split(/\r?\n/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXBlcDgvbm9kZV9tb2R1bGVzL2F0b20tbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxHQUFBLENBQUEsR0FKVCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLElBTFYsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FJZjtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBcUIsT0FBckIsR0FBQTs7UUFBVSxPQUFPO09BQ3JCOztRQUR5QixVQUFVO09BQ25DOztRQUFBLE9BQU8sQ0FBQyxTQUFVO09BQWxCO0FBQ0EsTUFBQSxJQUFBLENBQUEsU0FBc0QsQ0FBQyxNQUF2RDtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FBVixDQUFBO09BREE7QUFFQSxhQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNqQixZQUFBLG9CQUFBO0FBQUEsUUFBQSxjQUFBLEdBQWlCLGFBQWEsQ0FBQyxLQUFkLENBQW9CLE9BQXBCLEVBQTZCLElBQTdCLEVBQW1DLE9BQW5DLENBQWpCLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxFQURQLENBQUE7QUFFQSxR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

//# sourceURL=/home/alenz/.atom/packages/linter-pep8/node_modules/atom-linter/lib/helpers.coffee
