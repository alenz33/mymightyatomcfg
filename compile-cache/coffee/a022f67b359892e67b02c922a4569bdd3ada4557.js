(function() {
  var PythonNosetestsRunner, child_process, fs, path;

  child_process = require('child_process');

  fs = require('fs');

  path = require('path');

  module.exports = PythonNosetestsRunner = {
    last_nosetestsfile: null,
    run: function(settings) {
      var command, current_dir, cwd, data, filecontent, nosetestsfile, start_time;
      start_time = new Date().getTime() / 1000;
      current_dir = this.getCurrentDir();
      if (current_dir) {
        nosetestsfile = this.findNoseTestsJson(current_dir);
      }
      if (!nosetestsfile) {
        if (this.last_nosetestsfile) {
          if (fs.existsSync(this.last_nosetestsfile)) {
            nosetestsfile = this.last_nosetestsfile;
          }
        }
      }
      if (nosetestsfile) {
        filecontent = fs.readFileSync(nosetestsfile, 'UTF8');
        data = JSON.parse(filecontent);
        command = data.metadata.command;
        cwd = data.metadata.cwd;
        this.last_nosetestsfile = nosetestsfile;
      } else {
        settings.error("Could not find 'nosetests.json' in any of the parent folders of the active file.");
        return;
      }
      return child_process.exec(command, {
        cwd: cwd
      }, (function(_this) {
        return function() {
          if (!fs.existsSync(nosetestsfile)) {
            settings.error("Could not find '" + nosetestsfile + "' after running the tests.");
            return;
          }
          filecontent = fs.readFileSync(nosetestsfile, 'UTF8');
          data = JSON.parse(filecontent);
          if (data.metadata.time < start_time) {
            settings.error('Error: timestamp of nosetests.json file is before starting time.');
            return;
          }
          return settings.success(data);
        };
      })(this));
    },
    findNoseTestsJson: function(dir) {
      var nosetestsfile;
      nosetestsfile = path.join(dir, 'nosetests.json');
      if (!this.pathInAnyProject(nosetestsfile)) {
        return null;
      }
      if (fs.existsSync(nosetestsfile)) {
        return nosetestsfile;
      } else {
        return this.findNoseTestsJson(path.dirname(dir));
      }
    },
    getCurrentDir: function() {
      var active_editor;
      active_editor = atom.workspace.getActiveTextEditor();
      if (active_editor) {
        return path.dirname(active_editor.getPath());
      } else {
        return null;
      }
    },
    pathInAnyProject: function(directory) {
      var project_dir, _i, _len, _ref;
      _ref = atom.project.getDirectories();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        project_dir = _ref[_i];
        if (project_dir.contains(directory)) {
          return true;
        }
      }
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcHl0aG9uLW5vc2V0ZXN0cy9saWIvcnVubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIscUJBQUEsR0FFZjtBQUFBLElBQUEsa0JBQUEsRUFBb0IsSUFBcEI7QUFBQSxJQUVBLEdBQUEsRUFBSyxTQUFDLFFBQUQsR0FBQTtBQU1ILFVBQUEsdUVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBaUIsSUFBQSxJQUFBLENBQUEsQ0FBTSxDQUFDLE9BQVAsQ0FBQSxDQUFKLEdBQXFCLElBQWxDLENBQUE7QUFBQSxNQUVBLFdBQUEsR0FBYyxJQUFDLENBQUEsYUFBRCxDQUFBLENBRmQsQ0FBQTtBQUlBLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixXQUFuQixDQUFoQixDQURGO09BSkE7QUFRQSxNQUFBLElBQUcsQ0FBQSxhQUFIO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxrQkFBSjtBQUNFLFVBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUMsQ0FBQSxrQkFBZixDQUFIO0FBQ0UsWUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxrQkFBakIsQ0FERjtXQURGO1NBREY7T0FSQTtBQWFBLE1BQUEsSUFBRyxhQUFIO0FBQ0UsUUFBQSxXQUFBLEdBQWMsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsYUFB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

//# sourceURL=/home/alenz/.atom/packages/python-nosetests/lib/runner.coffee
