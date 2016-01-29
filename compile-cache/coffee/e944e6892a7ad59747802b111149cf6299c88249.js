(function() {
  var CompositeDisposable, PythonNosetests, PythonNosetestsView, Runner, url;

  url = require('url');

  CompositeDisposable = require('atom').CompositeDisposable;

  PythonNosetestsView = require('./view');

  Runner = require('./runner');

  module.exports = PythonNosetests = {
    view: null,
    panel: null,
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'python-nosetests:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'python-nosetests:hide': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.view.destroy();
      return this.panel.destroy();
    },
    run: function() {
      if (this.view) {
        this.view.mute();
      }
      return Runner.run({
        success: (function(_this) {
          return function(data) {
            if (!_this.view) {
              _this.view = new PythonNosetestsView();
            }
            if (!_this.panel) {
              _this.panel = atom.workspace.addRightPanel({
                item: _this.view,
                visible: false
              });
            }
            _this.panel.show();
            return _this.view.load(data);
          };
        })(this),
        error: (function(_this) {
          return function(message) {
            atom.notifications.addWarning(message, {
              dismissable: true
            });
            if (_this.view) {
              return _this.view.unmute();
            }
          };
        })(this)
      });
    },
    hide: function() {
      return this.panel.hide();
    },
    config: {
      colorfullBadges: {
        title: 'Colorfull Badges',
        description: 'If enabled, the background color of the badges indicating the number of succeeded, failed and error test cases will be colorfull.',
        type: 'boolean',
        "default": false
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcHl0aG9uLW5vc2V0ZXN0cy9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFFQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsUUFBUixDQUZ0QixDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSlQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBQUEsR0FDZjtBQUFBLElBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxJQUNBLEtBQUEsRUFBTyxJQURQO0FBQUEsSUFFQSxhQUFBLEVBQWUsSUFGZjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUdSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsc0JBQUEsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLEdBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7T0FBcEMsQ0FBbkIsQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO09BQXBDLENBQW5CLEVBUFE7SUFBQSxDQUpWO0FBQUEsSUFhQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLEVBSFU7SUFBQSxDQWJaO0FBQUEsSUFrQkEsR0FBQSxFQUFLLFNBQUEsR0FBQTtBQUVILE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUEsQ0FBQSxDQURGO09BQUE7YUFHQSxNQUFNLENBQUMsR0FBUCxDQUFXO0FBQUEsUUFDVCxPQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLElBQUQsR0FBQTtBQUNQLFlBQUEsSUFBRyxDQUFBLEtBQUssQ0FBQSxJQUFSO0FBQ0UsY0FBQSxLQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsbUJBQUEsQ0FBQSxDQUFaLENBREY7YUFBQTtBQUdBLFlBQUEsSUFBRyxDQUFBLEtBQUssQ0FBQSxLQUFSO0FBQ0UsY0FBQSxLQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLGdCQUFBLElBQUEsRUFBTSxLQUFDLENBQUEsSUFBUDtBQUFBLGdCQUFhLE9BQUEsRUFBUyxLQUF0QjtlQUE3QixDQUFULENBREY7YUFIQTtBQUFBLFlBTUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FOQSxDQUFBO21CQU9BLEtBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLElBQVgsRUFSTztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREE7QUFBQSxRQWFULEtBQUEsRUFBTyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ04sWUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLE9BQTlCLEVBQXVDO0FBQUEsY0FBQSxXQUFBLEVBQWEsSUFBYjthQUF2QyxDQUFBLENBQUE7QUFFQSxZQUFBLElBQUcsS0FBQyxDQUFBLElBQUo7cUJBQ0UsS0FBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQUEsRUFERjthQUhNO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FiRTtPQUFYLEVBTEc7SUFBQSxDQWxCTDtBQUFBLElBNENBLElBQUEsRUFBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxFQURJO0lBQUEsQ0E1Q047QUFBQSxJQStDQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsbUlBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtPQURGO0tBaERGO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/python-nosetests/lib/main.coffee
