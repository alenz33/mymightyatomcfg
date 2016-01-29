(function() {
  var ChildProcess, ConfigObserver, ScriptRunner, ScriptRunnerProcess, ScriptRunnerView, ShellEnvironment;

  ConfigObserver = require('atom').ConfigObserver;

  ScriptRunnerProcess = require('./script-runner-process');

  ScriptRunnerView = require('./script-runner-view');

  ChildProcess = require('child_process');

  ShellEnvironment = require('shell-environment');

  ScriptRunner = (function() {
    function ScriptRunner() {}

    ScriptRunner.prototype.commandMap = [
      {
        scope: '^source\\.coffee',
        command: 'coffee'
      }, {
        scope: '^source\\.js',
        command: 'node'
      }, {
        scope: '^source\\.ruby',
        command: 'ruby'
      }, {
        scope: '^source\\.python',
        command: 'python'
      }, {
        scope: '^source\\.go',
        command: 'go run'
      }, {
        scope: '^text\\.html\\.php',
        command: 'php'
      }, {
        scope: 'Shell Script (Bash)',
        command: 'bash'
      }, {
        path: 'spec\\.coffee$',
        command: 'jasmine-node --coffee'
      }, {
        path: '\\.sh$',
        command: 'bash'
      }
    ];

    ScriptRunner.prototype.destroy = function() {
      return this.killAllProcesses();
    };

    ScriptRunner.prototype.activate = function() {
      this.runners = [];
      this.runnerPane = null;
      return atom.commands.add('atom-workspace', {
        'run:script': (function(_this) {
          return function(event) {
            return _this.run();
          };
        })(this),
        'run:terminate': (function(_this) {
          return function(event) {
            return _this.stop();
          };
        })(this)
      });
    };

    ScriptRunner.prototype.killProcess = function(runner, detach) {
      if (detach == null) {
        detach = false;
      }
      if (runner != null) {
        if (runner.process != null) {
          runner.process.stop('SIGTERM');
          if (detach) {
            runner.process.detach();
            return runner.process = null;
          }
        }
      }
    };

    ScriptRunner.prototype.killAllProcesses = function(detach) {
      var runner, _i, _len, _ref, _results;
      if (detach == null) {
        detach = false;
      }
      _ref = this.runners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        runner = _ref[_i];
        if (runner.process != null) {
          runner.process.stop('SIGTERM');
          if (detach) {
            runner.process.detach();
            _results.push(runner.process = null);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ScriptRunner.prototype.createRunnerView = function(editor) {
      var runner;
      if (this.pane == null) {
        this.pane = atom.workspace.getActivePane().splitRight();
        this.pane.onDidDestroy((function(_this) {
          return function() {
            _this.killAllProcesses(true);
            return _this.pane = null;
          };
        })(this));
        this.pane.onWillDestroyItem((function(_this) {
          return function(evt) {
            var runner;
            runner = _this.getRunnerBy(evt.item);
            return _this.killProcess(runner, true);
          };
        })(this));
      }
      runner = this.getRunnerBy(editor, 'editor');
      if (runner == null) {
        runner = {
          editor: editor,
          view: new ScriptRunnerView(editor.getTitle()),
          process: null
        };
        this.runners.push(runner);
      } else {
        runner.view.setTitle(editor.getTitle());
      }
      return runner;
    };

    ScriptRunner.prototype.run = function() {
      var cmd, editor, path, runner;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      path = editor.getPath();
      cmd = this.commandFor(editor);
      if (cmd == null) {
        alert("Not sure how to run '" + path + "' :/");
        return false;
      }
      runner = this.createRunnerView(editor);
      this.killProcess(runner, true);
      this.pane.activateItem(runner.view);
      runner.view.clear();
      return ShellEnvironment.loginEnvironment((function(_this) {
        return function(error, environment) {
          if (environment) {
            return runner.process = ScriptRunnerProcess.run(runner.view, cmd, environment, editor);
          } else {
            throw new Error(error);
          }
        };
      })(this));
    };

    ScriptRunner.prototype.stop = function() {
      var runner;
      if (!this.pane) {
        return;
      }
      runner = this.getRunnerBy(this.pane.getActiveItem());
      return this.killProcess(runner);
    };

    ScriptRunner.prototype.commandFor = function(editor) {
      var firstLine, method, path, scope, _i, _len, _ref;
      firstLine = editor.lineTextForBufferRow(0);
      if (firstLine.match('^#!')) {
        return firstLine.substr(2);
      }
      path = editor.getPath();
      scope = editor.getRootScopeDescriptor().scopes[0];
      _ref = this.commandMap;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        if (method.fileName && (path != null)) {
          if (path.match(method.path)) {
            return method.command;
          }
        } else if (method.scope) {
          if (scope.match(method.scope)) {
            return method.command;
          }
        }
      }
    };

    ScriptRunner.prototype.getRunnerBy = function(attr_obj, attr_name) {
      var runner, _i, _len, _ref;
      if (attr_name == null) {
        attr_name = 'view';
      }
      _ref = this.runners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        runner = _ref[_i];
        if (runner[attr_name] === attr_obj) {
          return runner;
        }
      }
      return null;
    };

    return ScriptRunner;

  })();

  module.exports = new ScriptRunner;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvc2NyaXB0LXJ1bm5lci9saWIvc2NyaXB0LXJ1bm5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUdBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLE1BQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBRUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBRnRCLENBQUE7O0FBQUEsRUFHQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVIsQ0FIbkIsQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUxmLENBQUE7O0FBQUEsRUFNQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsbUJBQVIsQ0FObkIsQ0FBQTs7QUFBQSxFQVFNOzhCQUNKOztBQUFBLDJCQUFBLFVBQUEsR0FBWTtNQUNWO0FBQUEsUUFBQyxLQUFBLEVBQU8sa0JBQVI7QUFBQSxRQUE0QixPQUFBLEVBQVMsUUFBckM7T0FEVSxFQUVWO0FBQUEsUUFBQyxLQUFBLEVBQU8sY0FBUjtBQUFBLFFBQXdCLE9BQUEsRUFBUyxNQUFqQztPQUZVLEVBR1Y7QUFBQSxRQUFDLEtBQUEsRUFBTyxnQkFBUjtBQUFBLFFBQTBCLE9BQUEsRUFBUyxNQUFuQztPQUhVLEVBSVY7QUFBQSxRQUFDLEtBQUEsRUFBTyxrQkFBUjtBQUFBLFFBQTRCLE9BQUEsRUFBUyxRQUFyQztPQUpVLEVBS1Y7QUFBQSxRQUFDLEtBQUEsRUFBTyxjQUFSO0FBQUEsUUFBd0IsT0FBQSxFQUFTLFFBQWpDO09BTFUsRUFNVjtBQUFBLFFBQUMsS0FBQSxFQUFPLG9CQUFSO0FBQUEsUUFBOEIsT0FBQSxFQUFTLEtBQXZDO09BTlUsRUFPVjtBQUFBLFFBQUMsS0FBQSxFQUFPLHFCQUFSO0FBQUEsUUFBK0IsT0FB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

//# sourceURL=/home/alenz/.atom/packages/script-runner/lib/script-runner.coffee
