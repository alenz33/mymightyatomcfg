(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      rustcPath: {
        type: 'string',
        "default": 'rustc',
        description: "Path to Rust's compiler `rustc`."
      },
      cargoPath: {
        type: 'string',
        "default": 'cargo',
        description: "Path to Rust's package manager `cargo`."
      },
      useCargo: {
        type: 'boolean',
        "default": true,
        description: "Use Cargo if it's possible"
      },
      buildTest: {
        type: 'boolean',
        "default": false,
        description: "Lint test code"
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
      this.subscriptions.add(atom.config.observe('linter-rust.cargoPath', (function(_this) {
        return function(cargoPath) {
          return _this.cargoPath = cargoPath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.useCargo', (function(_this) {
        return function(useCargo) {
          return _this.useCargo = useCargo;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-rust.buildTest', (function(_this) {
        return function(buildTest) {
          return _this.useCargo = buildTest;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXJ1c3QvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsa0NBRmI7T0FERjtBQUFBLE1BSUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE9BRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5Q0FGYjtPQUxGO0FBQUEsTUFRQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDRCQUZiO09BVEY7QUFBQSxNQVlBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsZ0JBRmI7T0FiRjtBQUFBLE1BZ0JBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsWUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlCQUZiO09BakJGO0FBQUEsTUFvQkEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBRFQ7QUFBQSxRQUVBLE1BQUEsRUFBTSxDQUFDLENBQUQsRUFBSSxD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

//# sourceURL=/home/alenz/.atom/packages/linter-rust/lib/init.coffee
