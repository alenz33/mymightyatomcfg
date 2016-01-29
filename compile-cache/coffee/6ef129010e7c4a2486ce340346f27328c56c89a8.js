(function() {
  var EscapeCharacterRegex, parseScopeChain, selectorForScopeChain, selectorsMatchScopeChain, slick;

  slick = require('atom-slick');

  EscapeCharacterRegex = /[-!"#$%&'*+,/:;=?@|^~()<>{}[\]]/g;

  parseScopeChain = function(scopeChain) {
    var scope, _i, _len, _ref, _ref1, _results;
    scopeChain = scopeChain.replace(EscapeCharacterRegex, function(match) {
      return "\\" + match[0];
    });
    _ref1 = (_ref = slick.parse(scopeChain)[0]) != null ? _ref : [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      scope = _ref1[_i];
      _results.push(scope);
    }
    return _results;
  };

  selectorForScopeChain = function(selectors, scopeChain) {
    var scopes, selector, _i, _len;
    for (_i = 0, _len = selectors.length; _i < _len; _i++) {
      selector = selectors[_i];
      scopes = parseScopeChain(scopeChain);
      while (scopes.length > 0) {
        if (selector.matches(scopes)) {
          return selector;
        }
        scopes.pop();
      }
    }
    return null;
  };

  selectorsMatchScopeChain = function(selectors, scopeChain) {
    return selectorForScopeChain(selectors, scopeChain) != null;
  };

  module.exports = {
    parseScopeChain: parseScopeChain,
    selectorsMatchScopeChain: selectorsMatchScopeChain,
    selectorForScopeChain: selectorForScopeChain
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvZm9ybWF0dGVyL2xpYi9zY29wZS1oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSw2RkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsWUFBUixDQUFSLENBQUE7O0FBQUEsRUFFQSxvQkFBQSxHQUF1QixrQ0FGdkIsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsU0FBQyxVQUFELEdBQUE7QUFDaEIsUUFBQSxzQ0FBQTtBQUFBLElBQUEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxPQUFYLENBQW1CLG9CQUFuQixFQUF5QyxTQUFDLEtBQUQsR0FBQTthQUFZLElBQUEsR0FBSSxLQUFNLENBQUEsQ0FBQSxFQUF0QjtJQUFBLENBQXpDLENBQWIsQ0FBQTtBQUNBO0FBQUE7U0FBQSw0Q0FBQTt3QkFBQTtBQUFBLG9CQUFBLE1BQUEsQ0FBQTtBQUFBO29CQUZnQjtFQUFBLENBSmxCLENBQUE7O0FBQUEsRUFRQSxxQkFBQSxHQUF3QixTQUFDLFNBQUQsRUFBWSxVQUFaLEdBQUE7QUFDdEIsUUFBQSwwQkFBQTtBQUFBLFNBQUEsZ0RBQUE7K0JBQUE7QUFDRSxNQUFBLE1BQUEsR0FBUyxlQUFBLENBQWdCLFVBQWhCLENBQVQsQ0FBQTtBQUNBLGFBQU0sTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBdEIsR0FBQTtBQUNFLFFBQUEsSUFBbUIsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsTUFBakIsQ0FBbkI7QUFBQSxpQkFBTyxRQUFQLENBQUE7U0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLEdBQVAsQ0FBQSxDQURBLENBREY7TUFBQSxDQUZGO0FBQUEsS0FBQTtXQUtBLEtBTnNCO0VBQUEsQ0FSeEIsQ0FBQTs7QUFBQSxFQWdCQSx3QkFBQSxHQUEyQixTQUFDLFNBQUQsRUFBWSxVQUFaLEdBQUE7V0FDekIscURBRHlCO0VBQUEsQ0FoQjNCLENBQUE7O0FBQUEsRUFtQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLGlCQUFBLGVBQUQ7QUFBQSxJQUFrQiwwQkFBQSx3QkFBbEI7QUFBQSxJQUE0Qyx1QkFBQSxxQkFBNUM7R0FuQmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/formatter/lib/scope-helpers.coffee
