(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      useCargo: {
        type: 'boolean',
        "default": true,
        description: "Use Cargo if it's possible"
      },
      rustcPath: {
        type: 'string',
        "default": 'rustc',
        description: "Path to Rust's compiler `rustc`"
      },
      rustcBuildTest: {
        type: 'boolean',
        "default": false,
        description: "Lint test code, when using `rustc`"
      },
      cargoPath: {
        type: 'string',
        "default": 'cargo',
        description: "Path to Rust's package manager `cargo`"
      },
      cargoCommand: {
        type: 'string',
        "default": 'build',
        "enum": ['build', 'check', 'test', 'rustc'],
        description: "Use 'check' for fast linting (you need to install `cargo-check`). Use 'test' to lint test code, too. Use 'rustc' for fast linting (note: does not build the project)."
      },
      cargoManifestFilename: {
        type: 'string',
        "default": 'Cargo.toml',
        description: 'Cargo manifest filename'
      },
      jobsNumber: {
        type: 'integer',
        "default": 2,
        "enum": [1, 2, 4, 6, 8, 10],
        description: 'Number of jobs to run Cargo in parallel'
      }
    },
    activate: function() {
      console.log('Linter-Rust: package loaded, ready to get initialized by AtomLinter.');
      if (!atom.packages.getLoadedPackage('linter')) {
        atom.notifications.addError('Linter package not found', {
          detail: '[linter-rust] `linter` package not found. Please install https://github.com/AtomLinter/Linter'
        });
      }
      if (!atom.packages.getLoadedPackage('language-rust')) {
        atom.notifications.addError('Language-rust package not found', {
          detail: '[linter-rust] `language-rust` package not found. Please install https://github.com/zargony/atom-language-rust'
        });
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-rust.rustcPath', (function(_this) {
        return function(rustcPath) {
          return _this.rustcPath = rustcPath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.rustcBuildTest', (function(_this) {
        return function(rustcBuildTest) {
          return _this.rustcBuildTest = rustcBuildTest;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.cargoPath', (function(_this) {
        return function(cargoPath) {
          return _this.cargoPath = cargoPath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.cargoPath', (function(_this) {
        return function(cargoCommand) {
          return _this.cargoCommand = cargoCommand;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.useCargo', (function(_this) {
        return function(useCargo) {
          return _this.useCargo = useCargo;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.cargoManifestFilename', (function(_this) {
        return function(cargoManifestFilename) {
          return _this.cargoManifestFilename = cargoManifestFilename;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-rust.jobsNumber', (function(_this) {
        return function(jobsNumber) {
          return _this.jobsNumber = jobsNumber;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var LinterRust;
      LinterRust = require('./linter-rust');
      this.provider = new LinterRust();
      return {
        name: 'Rust',
        grammarScopes: ['source.rust'],
        scope: 'project',
        lint: this.provider.lint,
        lintOnFly: false
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXJ1c3QvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsNEJBRmI7T0FERjtBQUFBLE1BSUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE9BRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQUxGO0FBQUEsTUFRQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLG9DQUZiO09BVEY7QUFBQSxNQVlBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsd0NBRmI7T0FiRjtBQUFBLE1BZ0JBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxNQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQixPQUEzQixDQUZOO0FBQUEsUUFHQSxXQUFBLEVBQWEsdUtBSGI7T0FqQkY7QUFBQSxNQXdCQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVB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

//# sourceURL=/home/alenz/.atom/packages/linter-rust/lib/init.coffee
