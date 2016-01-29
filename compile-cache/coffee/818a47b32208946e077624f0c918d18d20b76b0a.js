(function() {
  var $, CompositeDisposable, Disposable, Emitter, ResizablePanel, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  _ref1 = require('atom'), Emitter = _ref1.Emitter, Disposable = _ref1.Disposable, CompositeDisposable = _ref1.CompositeDisposable;

  module.exports = ResizablePanel = (function() {
    function ResizablePanel(handle) {
      this.handle = handle;
      this.panelResize = __bind(this.panelResize, this);
      this.panelResizeStopped = __bind(this.panelResizeStopped, this);
      this.panelResizeStarted = __bind(this.panelResizeStarted, this);
      this.handle.on('mousedown', (function(_this) {
        return function(e) {
          return _this.panelResizeStarted(e);
        };
      })(this));
    }

    ResizablePanel.prototype.panelResizeStarted = function() {
      $(document).on('mousemove', this.panelResize);
      return $(document).on('mouseup', this.panelResizeStopped);
    };

    ResizablePanel.prototype.panelResizeStopped = function() {
      $(document).off('mousemove', this.panelResize);
      return $(document).off('mouseup', this.panelResizeStopped);
    };

    ResizablePanel.prototype.panelResize = function(_arg) {
      var pageX, which;
      pageX = _arg.pageX, which = _arg.which;
      if (which !== 1) {
        return this.panelResizeStopped();
      }
      return this.handle.parent().width($(document.body).width() - pageX);
    };

    return ResizablePanel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcHl0aG9uLW5vc2V0ZXN0cy9saWIvcmVzaXphYmxlcGFuZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDhFQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLFFBQTZDLE9BQUEsQ0FBUSxNQUFSLENBQTdDLEVBQUMsZ0JBQUEsT0FBRCxFQUFVLG1CQUFBLFVBQVYsRUFBc0IsNEJBQUEsbUJBRHRCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRVMsSUFBQSx3QkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsV0FBWCxFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQU8sS0FBQyxDQUFBLGtCQUFELENBQW9CLENBQXBCLEVBQVA7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixDQUFBLENBRFc7SUFBQSxDQUFiOztBQUFBLDZCQUlBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtBQUNsQixNQUFBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxFQUFaLENBQWUsV0FBZixFQUE0QixJQUFDLENBQUEsV0FBN0IsQ0FBQSxDQUFBO2FBQ0EsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEVBQVosQ0FBZSxTQUFmLEVBQTBCLElBQUMsQ0FBQSxrQkFBM0IsRUFGa0I7SUFBQSxDQUpwQixDQUFBOztBQUFBLDZCQVFBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtBQUNsQixNQUFBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFdBQWhCLEVBQTZCLElBQUMsQ0FBQSxXQUE5QixDQUFBLENBQUE7YUFDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsR0FBWixDQUFnQixTQUFoQixFQUEyQixJQUFDLENBQUEsa0JBQTVCLEVBRmtCO0lBQUEsQ0FScEIsQ0FBQTs7QUFBQSw2QkFZQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLFlBQUE7QUFBQSxNQURhLGFBQUEsT0FBTyxhQUFBLEtBQ3BCLENBQUE7QUFBQSxNQUFBLElBQW9DLEtBQUEsS0FBUyxDQUE3QztBQUFBLGVBQU8sSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FBUCxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxDQUFnQixDQUFDLEtBQWpCLENBQXVCLENBQUEsQ0FBRSxRQUFRLENBQUMsSUFBWCxDQUFnQixDQUFDLEtBQWpCLENBQUEsQ0FBQSxHQUEyQixLQUFsRCxFQUZXO0lBQUEsQ0FaYixDQUFBOzswQkFBQTs7TUFORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/alenz/.atom/packages/python-nosetests/lib/resizablepanel.coffee
