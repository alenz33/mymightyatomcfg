(function() {
  var ChildProcess, Path, ScriptRunnerProcess, Shellwords;

  ChildProcess = require('child_process');

  Path = require('path');

  Shellwords = require('shellwords');

  module.exports = ScriptRunnerProcess = (function() {
    ScriptRunnerProcess.run = function(view, cmd, env, editor) {
      var scriptRunnerProcess;
      scriptRunnerProcess = new ScriptRunnerProcess(view);
      scriptRunnerProcess.execute(cmd, env, editor);
      return scriptRunnerProcess;
    };

    function ScriptRunnerProcess(view) {
      this.view = view;
      this.child = null;
    }

    ScriptRunnerProcess.prototype.detach = function() {
      return this.view = null;
    };

    ScriptRunnerProcess.prototype.stop = function(signal) {
      if (signal == null) {
        signal = 'SIGINT';
      }
      if (this.child) {
        console.log("Sending", signal, "to child", this.child, "pid", this.child.pid);
        process.kill(-this.child.pid, signal);
        if (this.view) {
          return this.view.append('<Sending ' + signal + '>', 'stdin');
        }
      }
    };

    ScriptRunnerProcess.prototype.execute = function(cmd, env, editor) {
      var appendBuffer, args, cwd, startTime;
      cwd = atom.project.path;
      args = Shellwords.split(cmd);
      if (editor.getPath()) {
        editor.save();
        cwd = Path.dirname(editor.getPath());
      }
      if (editor.getPath() && !editor.buffer.isModified()) {
        args.push(editor.getPath());
        appendBuffer = false;
      } else {
        appendBuffer = true;
      }
      cmd = args.join(' ');
      args.unshift(__dirname + "/script-wrapper.py");
      this.child = ChildProcess.spawn(args[0], args.slice(1), {
        cwd: cwd,
        env: env,
        detached: true
      });
      this.view.header('Running: ' + cmd + ' (pgid ' + this.child.pid + ')');
      this.child.stderr.on('data', (function(_this) {
        return function(data) {
          if (_this.view != null) {
            _this.view.append(data, 'stderr');
            return _this.view.scrollToBottom();
          }
        };
      })(this));
      this.child.stdout.on('data', (function(_this) {
        return function(data) {
          if (_this.view != null) {
            _this.view.append(data, 'stdout');
            return _this.view.scrollToBottom();
          }
        };
      })(this));
      this.child.on('close', (function(_this) {
        return function(code, signal) {
          var duration;
          _this.child = null;
          if (_this.view) {
            duration = ' after ' + ((new Date - startTime) / 1000) + ' seconds';
            if (signal) {
              return _this.view.footer('Exited with signal ' + signal + duration);
            } else {
              code || (code = 0);
              return _this.view.footer('Exited with status ' + code + duration);
            }
          }
        };
      })(this));
      startTime = new Date;
      if (appendBuffer) {
        this.child.stdin.write(editor.getText());
      }
      return this.child.stdin.end();
    };

    return ScriptRunnerProcess;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvc2NyaXB0LXJ1bm5lci9saWIvc2NyaXB0LXJ1bm5lci1wcm9jZXNzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUFmLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLG1CQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLE1BQWpCLEdBQUE7QUFDSixVQUFBLG1CQUFBO0FBQUEsTUFBQSxtQkFBQSxHQUEwQixJQUFBLG1CQUFBLENBQW9CLElBQXBCLENBQTFCLENBQUE7QUFBQSxNQUVBLG1CQUFtQixDQUFDLE9BQXBCLENBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLE1BQXRDLENBRkEsQ0FBQTtBQUlBLGFBQU8sbUJBQVAsQ0FMSTtJQUFBLENBQU4sQ0FBQTs7QUFPYSxJQUFBLDZCQUFDLElBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFEVCxDQURXO0lBQUEsQ0FQYjs7QUFBQSxrQ0FXQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBQUQsR0FBUSxLQURGO0lBQUEsQ0FYUixDQUFBOztBQUFBLGtDQWNBLElBQUEsR0FBTSxTQUFDLE1BQUQsR0FBQTs7UUFBQyxTQUFTO09BQ2Q7QUFBQSxNQUFBLElBQUcsSUFBQyxD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

//# sourceURL=/home/alenz/.atom/packages/script-runner/lib/script-runner-process.coffee
