(function() {
  var CompositeDisposable, Disposable, Module, ProviderManager, ProviderMetadata, Selector, applyEdits, scopeChainForScopeDescriptor, specificity, stableSort, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  Selector = require('selector-kit').Selector;

  specificity = require('clear-cut').specificity;

  ProviderMetadata = require('./provider-metadata');

  stableSort = require('stable');

  Module = (function() {
    function Module() {
      this.formatCode = __bind(this.formatCode, this);
    }

    Module.prototype.activate = function() {
      this.providerManager = new ProviderManager;
      this.disposible = new CompositeDisposable;
      this.registerCommands();
    };

    Module.prototype.deactivate = function() {
      this.disposible.dispose();
    };

    Module.prototype.registerCommands = function() {
      return this.disposible.add(atom.commands.add('atom-text-editor', 'formatter:format-code', this.formatCode));
    };

    Module.prototype.formatCode = function() {
      var cursor, editor, edits, newText, provider, providers, scopeDescriptor, selected, selection, text;
      editor = atom.workspace.getActiveTextEditor();
      cursor = editor.getLastCursor();
      if (cursor == null) {
        return;
      }
      selection = editor.getSelectedBufferRange();
      if (!selection.isEmpty()) {
        selection = {
          start: {
            line: selection.start.row,
            col: selection.start.column
          },
          end: {
            line: selection.end.row,
            col: selection.end.column
          }
        };
      } else {
        selection = null;
      }
      scopeDescriptor = cursor.getScopeDescriptor();
      providers = this.providerManager.providersForScopeDescriptor(scopeDescriptor);
      if (!(providers.length > 0)) {
        return;
      }
      provider = providers[0];
      if (provider.getCodeEdits) {
        edits = Promise.resolve(provider.getCodeEdits({
          editor: editor,
          selection: selection
        }));
        return edits.then(function(edits) {
          return applyEdits(editor, edits);
        });
      } else if (provider.getNewText) {
        text = editor.getSelectedText();
        if (!text) {
          selected = false;
          text = editor.getText();
        }
        if (!text) {
          return;
        }
        newText = Promise.resolve(provider.getNewText(text));
        return newText.then(function(newText) {
          if (selected) {
            return editor.replaceSelectedText(newText);
          } else {
            return editor.setText(newText);
          }
        });
      }
    };


    /*
    Section: Services API
     */

    Module.prototype.consumeFormatter = function(providers) {
      var provider, registrations, _i, _len;
      if ((providers != null) && !Array.isArray(providers)) {
        providers = [providers];
      }
      if (!((providers != null ? providers.length : void 0) > 0)) {
        return;
      }
      registrations = new CompositeDisposable;
      for (_i = 0, _len = providers.length; _i < _len; _i++) {
        provider = providers[_i];
        registrations.add(this.providerManager.registerProvider(provider));
      }
      return registrations;
    };

    return Module;

  })();

  applyEdits = function(editor, edits) {
    return editor.transact(function() {
      var edit, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = edits.length; _i < _len; _i++) {
        edit = edits[_i];
        _results.push(editor.setTextInBufferRange([[edit.start.line, edit.start.col], [edit.end.line, edit.end.col]], edit.newText));
      }
      return _results;
    });
  };

  ProviderManager = (function() {
    function ProviderManager() {
      this.providersForScopeDescriptor = __bind(this.providersForScopeDescriptor, this);
      this.providers = [];
    }

    ProviderManager.prototype.registerProvider = function(provider) {
      if (provider == null) {
        return;
      }
      return this.providers.push(new ProviderMetadata(provider));
    };

    ProviderManager.prototype.providersForScopeDescriptor = function(scopeDescriptor) {
      var lowestIncludedPriority, matchingProviders, provider, providerMetadata, scopeChain, _i, _len, _ref1, _ref2;
      scopeChain = scopeChainForScopeDescriptor(scopeDescriptor);
      if (!scopeChain) {
        return [];
      }
      matchingProviders = [];
      lowestIncludedPriority = 0;
      _ref1 = this.providers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        providerMetadata = _ref1[_i];
        provider = providerMetadata.provider;
        if (providerMetadata.matchesScopeChain(scopeChain)) {
          matchingProviders.push(provider);
          if (provider.excludeLowerPriority != null) {
            lowestIncludedPriority = Math.max(lowestIncludedPriority, (_ref2 = provider.inclusionPriority) != null ? _ref2 : 0);
          }
        }
      }
      matchingProviders = (function() {
        var _j, _len1, _ref3, _results;
        _results = [];
        for (_j = 0, _len1 = matchingProviders.length; _j < _len1; _j++) {
          provider = matchingProviders[_j];
          if (((_ref3 = provider.inclusionPriority) != null ? _ref3 : 0) >= lowestIncludedPriority) {
            _results.push(provider);
          }
        }
        return _results;
      })();
      return stableSort(matchingProviders, (function(_this) {
        return function(providerA, providerB) {
          var difference, specificityA, specificityB, _ref3, _ref4;
          specificityA = _this.metadataForProvider(providerA).getSpecificity(scopeChain);
          specificityB = _this.metadataForProvider(providerB).getSpecificity(scopeChain);
          difference = specificityB - specificityA;
          if (difference === 0) {
            difference = ((_ref3 = providerB.suggestionPriority) != null ? _ref3 : 1) - ((_ref4 = providerA.suggestionPriority) != null ? _ref4 : 1);
          }
          return difference;
        };
      })(this));
    };

    return ProviderManager;

  })();

  scopeChainForScopeDescriptor = function(scopeDescriptor) {
    var json, scopeChain, type;
    type = typeof scopeDescriptor;
    if (type === 'string') {
      return scopeDescriptor;
    } else if (type === 'object' && ((scopeDescriptor != null ? scopeDescriptor.getScopeChain : void 0) != null)) {
      scopeChain = scopeDescriptor.getScopeChain();
      if ((scopeChain != null) && (scopeChain.replace == null)) {
        json = JSON.stringify(scopeDescriptor);
        console.log(scopeDescriptor, json);
        throw new Error("01: ScopeChain is not correct type: " + type + "; " + json);
      }
      return scopeChain;
    } else {
      json = JSON.stringify(scopeDescriptor);
      console.log(scopeDescriptor, json);
      throw new Error("02: ScopeChain is not correct type: " + type + "; " + json);
    }
  };

  module.exports = new Module;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvZm9ybWF0dGVyL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2SkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBQWIsQ0FBQTs7QUFBQSxFQUNDLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWixRQURELENBQUE7O0FBQUEsRUFFQyxjQUFlLE9BQUEsQ0FBUSxXQUFSLEVBQWYsV0FGRCxDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBSG5CLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVIsQ0FKYixDQUFBOztBQUFBLEVBTU07OztLQUVKOztBQUFBLHFCQUFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEdBQUEsQ0FBQSxlQUFuQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEdBQUEsQ0FBQSxtQkFEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUZBLENBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEscUJBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQURVO0lBQUEsQ0FOWixDQUFBOztBQUFBLHFCQVVBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTthQUNoQixJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyx1QkFBdEMsRUFBK0QsSUFBQyxDQUFB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

//# sourceURL=/home/alenz/.atom/packages/formatter/lib/main.coffee
