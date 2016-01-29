(function() {
  var ShellEnvironment;

  ShellEnvironment = require('shell-environment');

  ShellEnvironment.loginEnvironment((function(_this) {
    return function(error, environment) {
      if (environment) {
        return console.log(environment);
      } else {
        return console.log(error);
      }
    };
  })(this));

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvc2NyaXB0LXJ1bm5lci9leGFtcGxlcy9zaGVsbC1lbnZpcm9ubWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsbUJBQVIsQ0FBbkIsQ0FBQTs7QUFBQSxFQUVBLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQyxLQUFELEVBQVEsV0FBUixHQUFBO0FBQzlCLE1BQUEsSUFBRyxXQUFIO2VBQ0ksT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaLEVBREo7T0FBQSxNQUFBO2VBR0ksT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaLEVBSEo7T0FEOEI7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/script-runner/examples/shell-environment.coffee
