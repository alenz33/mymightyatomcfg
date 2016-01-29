(function() {
  var BufferedProcess, LinterRust, XRegExp, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  BufferedProcess = require('atom').BufferedProcess;

  XRegExp = require('xregexp').XRegExp;

  LinterRust = (function() {
    function LinterRust() {
      this.locateCargo = __bind(this.locateCargo, this);
      this.initCmd = __bind(this.initCmd, this);
      this.parse = __bind(this.parse, this);
      this.lint = __bind(this.lint, this);
    }

    LinterRust.prototype.cargoDependencyDir = "target/debug/deps";

    LinterRust.prototype.lintProcess = null;

    LinterRust.prototype.pattern = XRegExp('(?<file>[^\n\r]+):(?<from_line>\\d+):(?<from_col>\\d+):\\s*(?<to_line>\\d+):(?<to_col>\\d+)\\s+((?<error>error|fatal error)|(?<warning>warning)|(?<info>note|help)):\\s+(?<message>.+?)[\n\r]+($|(?=[^\n\r]+:\\d+))', 's');

    LinterRust.prototype.lint = function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var PATH, args, command, curDir, exit, file, options, results, stderr, stdout;
          results = [];
          file = _this.initCmd(textEditor.getPath());
          curDir = path.dirname(file);
          PATH = path.dirname(_this.cmd[0]);
          options = process.env;
          options.PATH = PATH + path.delimiter + options.PATH;
          options.cwd = curDir;
          _this.cmd.push(file);
          command = _this.cmd[0];
          args = _this.cmd.slice(1);
          stdout = function(data) {
            if (atom.inDevMode()) {
              return console.log(data);
            }
          };
          stderr = function(err) {
            return results.push(err);
          };
          exit = function(code) {
            var messages;
            if (code === 101 || code === 0) {
              messages = _this.parse(results.join(''));
              messages.forEach(function(message) {
                if (!(path.isAbsolute(message.filePath))) {
                  return message.filePath = path.join(curDir, message.filePath);
                }
              });
              return resolve(messages);
            } else {
              return resolve([]);
            }
          };
          _this.lintProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          return _this.lintProcess.onWillThrowError(function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            atom.notifications.addError("Failed to run " + command, {
              detail: "" + error.message,
              dismissable: true
            });
            handle();
            return resolve([]);
          });
        };
      })(this));
    };

    LinterRust.prototype.parse = function(output) {
      var lastMessage, messages;
      messages = [];
      lastMessage = null;
      XRegExp.forEach(output, this.pattern, function(match) {
        var range;
        if (match.from_col === match.to_col) {
          match.to_col = parseInt(match.to_col) + 1;
        }
        range = [[match.from_line - 1, match.from_col - 1], [match.to_line - 1, match.to_col - 1]];
        if (match.info && lastMessage) {
          lastMessage.trace || (lastMessage.trace = []);
          return lastMessage.trace.push({
            type: "Trace",
            text: match.message,
            filePath: match.file,
            range: range
          });
        } else {
          lastMessage = {
            type: match.error ? "Error" : "Warning",
            text: match.message,
            filePath: match.file,
            range: range
          };
          return messages.push(lastMessage);
        }
      });
      return messages;
    };

    LinterRust.prototype.config = function(key) {
      return atom.config.get("linter-rust." + key);
    };

    LinterRust.prototype.initCmd = function(editingFile) {
      var cargoManifestPath, cargoPath, rustcPath;
      cargoManifestPath = this.locateCargo(path.dirname(editingFile));
      rustcPath = this.config('rustcPath');
      cargoPath = this.config('cargoPath');
      if (!this.config('useCargo') || !cargoManifestPath) {
        if (this.config('buildTest')) {
          this.cmd = [rustcPath, '--cfg', 'test', '-Z', 'no-trans', '--color', 'never'];
        } else {
          this.cmd = [rustcPath, '-Z', 'no-trans', '--color', 'never'];
        }
        if (cargoManifestPath) {
          this.cmd.push('-L');
          this.cmd.push(path.join(path.dirname(cargoManifestPath), this.cargoDependencyDir));
        }
        return editingFile;
      } else {
        if (this.config('buildTest')) {
          this.cmd = [cargoPath, 'test', '--no-run', '-j', this.config('jobsNumber'), '--manifest-path'];
        } else {
          this.cmd = [cargoPath, 'build', '-j', this.config('jobsNumber'), '--manifest-path'];
        }
        return cargoManifestPath;
      }
    };

    LinterRust.prototype.locateCargo = function(curDir) {
      var cargoManifestFilename, directory, root_dir;
      root_dir = /^win/.test(process.platform) ? /^.:\\$/ : /^\/$/;
      cargoManifestFilename = this.config('cargoManifestFilename');
      directory = path.resolve(curDir);
      while (true) {
        if (fs.existsSync(path.join(directory, cargoManifestFilename))) {
          return path.join(directory, cargoManifestFilename);
        }
        if (root_dir.test(directory)) {
          break;
        }
        directory = path.resolve(path.join(directory, '..'));
      }
      return false;
    };

    return LinterRust;

  })();

  module.exports = LinterRust;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXJ1c3QvbGliL2xpbnRlci1ydXN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBR0MsVUFBVyxPQUFBLENBQVEsU0FBUixFQUFYLE9BSEQsQ0FBQTs7QUFBQSxFQU1NOzs7Ozs7S0FDSjs7QUFBQSx5QkFBQSxrQkFBQSxHQUFvQixtQkFBcEIsQ0FBQTs7QUFBQSx5QkFDQSxXQUFBLEdBQWEsSUFEYixDQUFBOztBQUFBLHlCQUVBLE9BQUEsR0FBUyxPQUFBLENBQVEscU5BQVIsRUFHdUMsR0FIdkMsQ0FGVCxDQUFBOztBQUFBLHlCQU9BLElBQUEsR0FBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNqQixjQUFBLHlFQUFBO0FBQUEsVUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsVUFDQSxJQUFBLEdBQU8sS0FBQyxDQUFBLE9BQUQsQ0FBWSxVQUFVLENBQUMsT0FBZCxDQUFBLENBQVQsQ0FEUCxDQUFBO0FBQUEsVUFFQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBRlQsQ0FBQTtBQUFBLFVBR0EsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQWxCLENB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

//# sourceURL=/home/alenz/.atom/packages/linter-rust/lib/linter-rust.coffee
