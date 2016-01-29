(function() {
  var ChildProcess, exportsCommand;

  console.log(process.env);

  ChildProcess = require('child_process');

  exportsCommand = process.env.SHELL + " -lc export";

  ChildProcess.exec(exportsCommand, function(error, stdout, stderr) {
    var definition, key, value, _i, _len, _ref, _ref1, _results;
    _ref = stdout.trim().split('\n');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      definition = _ref[_i];
      _ref1 = definition.split('=', 2), key = _ref1[0], value = _ref1[1];
      _results.push(process.env[key] = value);
    }
    return _results;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvc2NyaXB0LXJ1bm5lci9leGFtcGxlcy9lbnZpcm9ubWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQU8sQ0FBQyxHQUFwQixDQUFBLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVIsQ0FGZixDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQVosR0FBb0IsYUFMckMsQ0FBQTs7QUFBQSxFQVFBLFlBQVksQ0FBQyxJQUFiLENBQWtCLGNBQWxCLEVBQWtDLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsTUFBaEIsR0FBQTtBQUNqQyxRQUFBLHVEQUFBO0FBQUE7QUFBQTtTQUFBLDJDQUFBOzRCQUFBO0FBQ0MsTUFBQSxRQUFlLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLENBQXRCLENBQWYsRUFBQyxjQUFELEVBQU0sZ0JBQU4sQ0FBQTtBQUFBLG9CQUNBLE9BQU8sQ0FBQyxHQUFJLENBQUEsR0FBQSxDQUFaLEdBQW1CLE1BRG5CLENBREQ7QUFBQTtvQkFEaUM7RUFBQSxDQUFsQyxDQVJBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/script-runner/examples/environment.coffee
