(function() {
  var $, CompositeDisposable, RailroadDiagramElement, Regex2RailRoadDiagram,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom-space-pen-views').$;

  Regex2RailRoadDiagram = require('./regex-to-railroad.coffee').Regex2RailRoadDiagram;

  CompositeDisposable = require('atom').CompositeDisposable;

  RailroadDiagramElement = (function(_super) {
    __extends(RailroadDiagramElement, _super);

    function RailroadDiagramElement() {
      return RailroadDiagramElement.__super__.constructor.apply(this, arguments);
    }

    RailroadDiagramElement.prototype.createdCallback = function() {};

    RailroadDiagramElement.prototype.initialize = function(model) {
      this.model = model;
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
      this.currentRegex = null;
      this.subscriptions = null;
      return this;
    };

    RailroadDiagramElement.prototype.setModel = function(model) {
      this.model = model;
    };

    RailroadDiagramElement.prototype.removeChildren = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.remove());
      }
      return _results;
    };

    RailroadDiagramElement.prototype.destroy = function() {
      var _ref;
      this.removeChildren();
      this.panel.remove();
      this.remove();
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    RailroadDiagramElement.prototype.showDiagram = function(regex, options) {
      var e, _i, _len, _ref, _ref1;
      if (this.currentRegex === regex && !this.hidden) {
        return;
      }
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      this.subscriptions = new CompositeDisposable;
      this.removeChildren();
      try {
        Regex2RailRoadDiagram(regex, this, options);
        _ref1 = $(this).find('g[title]');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          e = _ref1[_i];
          this.subscriptions.add(atom.tooltips.add(e, {
            title: $(e).attr('title')
          }));
        }
        this.currentRegex = regex;
      } catch (_error) {
        e = _error;
        this.showError(regex, e);
      }
      return this.panel.show();
    };

    RailroadDiagramElement.prototype.showError = function(regex, e) {
      var sp;
      console.log("caught error when trying to display regex " + regex, e.stack);
      if (e.offset) {
        sp = " ".repeat(e.offset);
        return this.innerHTML = "<div class=\"error-message\"><pre class=\"text-error\">" + regex + "\n" + sp + "^ " + e.message + "</pre></div>";
      } else {
        return this.innerHTML = "<div class=\"error-message\"><pre>" + regex + "</pre><p class=\"text-error\">" + e.message + "</p></div>";
      }
    };

    RailroadDiagramElement.prototype.assertHidden = function() {
      var _ref;
      if (!this.hidden) {
        this.panel.hide();
      }
      this.currentRegex = null;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    return RailroadDiagramElement;

  })(HTMLElement);

  module.exports = RailroadDiagramElement = document.registerElement('regex-railroad-diagram', {
    prototype: RailroadDiagramElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcmVnZXgtcmFpbHJvYWQtZGlhZ3JhbS9saWIvcmFpbHJvYWQtZGlhZ3JhbS1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQyx3QkFBeUIsT0FBQSxDQUFRLDRCQUFSLEVBQXpCLHFCQURELENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUtNO0FBQ0osNkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFDQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBLENBQWpCLENBQUE7O0FBQUEscUNBRUEsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsUUFBQSxLQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFFBQVksT0FBQSxFQUFTLEtBQXJCO09BQTlCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFEaEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFGakIsQ0FBQTthQUdBLEtBSlU7SUFBQSxDQUZaLENBQUE7O0FBQUEscUNBUUEsUUFBQSxHQUFVLFNBQUUsS0FBRixHQUFBO0FBQVUsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQVY7SUFBQSxDQVJWLENBQUE7O0FBQUEscUNBVUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLCtCQUFBO0FB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

//# sourceURL=/home/alenz/.atom/packages/regex-railroad-diagram/lib/railroad-diagram-element.coffee
