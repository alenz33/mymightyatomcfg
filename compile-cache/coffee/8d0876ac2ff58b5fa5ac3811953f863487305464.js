(function() {
  var ProviderMetadata, Selector, selectorForScopeChain, selectorsMatchScopeChain, specificity, _ref;

  specificity = require('clear-cut').specificity;

  Selector = require('selector-kit').Selector;

  _ref = require('./scope-helpers'), selectorForScopeChain = _ref.selectorForScopeChain, selectorsMatchScopeChain = _ref.selectorsMatchScopeChain;

  module.exports = ProviderMetadata = (function() {
    function ProviderMetadata(provider) {
      this.provider = provider;
      this.selectors = Selector.create(this.provider.selector);
      if (this.provider.disableForSelector != null) {
        this.disableForSelectors = Selector.create(this.provider.disableForSelector);
      }
    }

    ProviderMetadata.prototype.matchesScopeChain = function(scopeChain) {
      if (this.disableForSelectors != null) {
        if (selectorsMatchScopeChain(this.disableForSelectors, scopeChain)) {
          return false;
        }
      }
      if (selectorsMatchScopeChain(this.selectors, scopeChain)) {
        return true;
      } else {
        return false;
      }
    };

    ProviderMetadata.prototype.getSpecificity = function(scopeChain) {
      var selector;
      if (selector = selectorForScopeChain(this.selectors, scopeChain)) {
        return selector.getSpecificity();
      } else {
        return 0;
      }
    };

    return ProviderMetadata;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvZm9ybWF0dGVyL2xpYi9wcm92aWRlci1tZXRhZGF0YS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsOEZBQUE7O0FBQUEsRUFBQyxjQUFlLE9BQUEsQ0FBUSxXQUFSLEVBQWYsV0FBRCxDQUFBOztBQUFBLEVBQ0MsV0FBWSxPQUFBLENBQVEsY0FBUixFQUFaLFFBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQW9ELE9BQUEsQ0FBUSxpQkFBUixDQUFwRCxFQUFDLDZCQUFBLHFCQUFELEVBQXdCLGdDQUFBLHdCQUZ4QixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsMEJBQUUsUUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUExQixDQUFiLENBQUE7QUFDQSxNQUFBLElBQXdFLHdDQUF4RTtBQUFBLFFBQUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQTFCLENBQXZCLENBQUE7T0FGVztJQUFBLENBQWI7O0FBQUEsK0JBSUEsaUJBQUEsR0FBbUIsU0FBQyxVQUFELEdBQUE7QUFDakIsTUFBQSxJQUFHLGdDQUFIO0FBQ0UsUUFBQSxJQUFnQix3QkFBQSxDQUF5QixJQUFDLENBQUEsbUJBQTFCLEVBQStDLFVBQS9DLENBQWhCO0FBQUEsaUJBQU8sS0FBUCxDQUFBO1NBREY7T0FBQTtBQUdBLE1BQUEsSUFBRyx3QkFBQSxDQUF5QixJQUFDLENBQUEsU0FBMUIsRUFBcUMsVUFBckMsQ0FBSDtlQUNFLEtBREY7T0FBQSxNQUFBO2VBR0UsTUFIRjtPQUppQjtJQUFBLENBSm5CLENBQUE7O0FBQUEsK0JBYUEsY0FBQSxHQUFnQixTQUFDLFVBQUQsR0FBQTtBQUNkLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBRyxRQUFBLEdBQVcscUJBQUEsQ0FBc0IsSUFBQyxDQUFBLFNBQXZCLEVBQWtDLFVBQWxDLENBQWQ7ZUFDRSxRQUFRLENBQUMsY0FBVCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFIRjtPQURjO0lBQUEsQ0FiaEIsQ0FBQTs7NEJBQUE7O01BTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/formatter/lib/provider-metadata.coffee
