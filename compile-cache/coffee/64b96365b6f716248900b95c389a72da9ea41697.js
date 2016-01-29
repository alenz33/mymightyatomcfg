(function() {
  var BufferedProcess, CompositeDisposable, DefinitionsView, Disposable, InterpreterLookup, RenameView, Selector, UsagesView, filter, log, selectorsMatchScopeChain, _, _ref;

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Selector = require('selector-kit').Selector;

  DefinitionsView = require('./definitions-view');

  UsagesView = require('./usages-view');

  RenameView = require('./rename-view');

  InterpreterLookup = require('./interpreters-lookup');

  log = require('./log');

  _ = require('underscore');

  filter = void 0;

  module.exports = {
    selector: '.source.python',
    disableForSelector: '.source.python .comment, .source.python .string',
    inclusionPriority: 2,
    suggestionPriority: 3,
    excludeLowerPriority: false,
    cacheSize: 10,
    _addEventListener: function(editor, eventName, handler) {
      var disposable, editorView;
      editorView = atom.views.getView(editor);
      editorView.addEventListener(eventName, handler);
      disposable = new Disposable(function() {
        log.debug('Unsubscribing from event listener ', eventName, handler);
        return editorView.removeEventListener(eventName, handler);
      });
      return disposable;
    },
    _noExecutableError: function(error) {
      if (this.providerNoExecutable) {
        return;
      }
      log.warning('No python executable found', error);
      atom.notifications.addWarning('autocomplete-python unable to find python binary.', {
        detail: "Please set path to python executable manually in package\nsettings and restart your editor. Be sure to migrate on new settings\nif everything worked on previous version.\nDetailed error message: " + error + "\n\nCurrent config: " + (atom.config.get('autocomplete-python.pythonPaths')),
        dismissable: true
      });
      return this.providerNoExecutable = true;
    },
    _spawnDaemon: function() {
      var interpreter;
      interpreter = InterpreterLookup.getInterpreter();
      log.debug('Using interpreter', interpreter);
      this.provider = new BufferedProcess({
        command: interpreter || 'python',
        args: [__dirname + '/completion.py'],
        stdout: (function(_this) {
          return function(data) {
            return _this._deserialize(data);
          };
        })(this),
        stderr: (function(_this) {
          return function(data) {
            if (data.indexOf('is not recognized as an internal or external') > -1) {
              return _this._noExecutableError(data);
            }
            log.debug("autocomplete-python traceback output: " + data);
            if (data.indexOf('jedi') > -1) {
              if (atom.config.get('autocomplete-python.outputProviderErrors')) {
                return atom.notifications.addWarning('Looks like this error originated from Jedi. Please do not\nreport such issues in autocomplete-python issue tracker. Report\nthem directly to Jedi. Turn off `outputProviderErrors` setting\nto hide such errors in future. Traceback output:', {
                  detail: "" + data,
                  dismissable: true
                });
              }
            } else {
              return atom.notifications.addError('autocomplete-python traceback output:', {
                detail: "" + data,
                dismissable: true
              });
            }
          };
        })(this),
        exit: (function(_this) {
          return function(code) {
            return log.warning('Process exit with', code, _this.provider);
          };
        })(this)
      });
      this.provider.onWillThrowError((function(_this) {
        return function(_arg) {
          var error, handle;
          error = _arg.error, handle = _arg.handle;
          if (error.code === 'ENOENT' && error.syscall.indexOf('spawn') === 0) {
            _this._noExecutableError(error);
            _this.dispose();
            return handle();
          } else {
            throw error;
          }
        };
      })(this));
      this.provider.process.stdin.on('error', function(err) {
        return log.debug('stdin', err);
      });
      return setTimeout((function(_this) {
        return function() {
          log.debug('Killing python process after timeout...');
          if (_this.provider && _this.provider.process) {
            return _this.provider.kill();
          }
        };
      })(this), 60 * 10 * 1000);
    },
    constructor: function() {
      var err, selector;
      this.requests = {};
      this.responses = {};
      this.provider = null;
      this.disposables = new CompositeDisposable;
      this.subscriptions = {};
      this.definitionsView = null;
      this.usagesView = null;
      this.renameView = null;
      this.snippetsManager = null;
      try {
        this.triggerCompletionRegex = RegExp(atom.config.get('autocomplete-python.triggerCompletionRegex'));
      } catch (_error) {
        err = _error;
        atom.notifications.addWarning('autocomplete-python invalid regexp to trigger autocompletions.\nFalling back to default value.', {
          detail: "Original exception: " + err,
          dismissable: true
        });
        atom.config.set('autocomplete-python.triggerCompletionRegex', '([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)');
        this.triggerCompletionRegex = /([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)/;
      }
      selector = 'atom-text-editor[data-grammar~=python]';
      atom.commands.add(selector, 'autocomplete-python:go-to-definition', (function(_this) {
        return function() {
          return _this.goToDefinition();
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:complete-arguments', (function(_this) {
        return function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return _this._completeArguments(editor, editor.getCursorBufferPosition(), true);
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:show-usages', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          if (_this.usagesView) {
            _this.usagesView.destroy();
          }
          _this.usagesView = new UsagesView();
          return _this.getUsages(editor, bufferPosition).then(function(usages) {
            return _this.usagesView.setItems(usages);
          });
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:rename', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          return _this.getUsages(editor, bufferPosition).then(function(usages) {
            if (_this.renameView) {
              _this.renameView.destroy();
            }
            if (usages.length > 0) {
              _this.renameView = new RenameView(usages);
              return _this.renameView.onInput(function(newName) {
                var fileName, project, _ref1, _ref2, _relative, _results;
                _ref1 = _.groupBy(usages, 'fileName');
                _results = [];
                for (fileName in _ref1) {
                  usages = _ref1[fileName];
                  _ref2 = atom.project.relativizePath(fileName), project = _ref2[0], _relative = _ref2[1];
                  if (project) {
                    _results.push(_this._updateUsagesInFile(fileName, usages, newName));
                  } else {
                    _results.push(log.debug('Ignoring file outside of project', fileName));
                  }
                }
                return _results;
              });
            } else {
              if (_this.usagesView) {
                _this.usagesView.destroy();
              }
              _this.usagesView = new UsagesView();
              return _this.usagesView.setItems(usages);
            }
          });
        };
      })(this));
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._handleGrammarChangeEvent(editor, editor.getGrammar());
          return editor.displayBuffer.onDidChangeGrammar(function(grammar) {
            return _this._handleGrammarChangeEvent(editor, grammar);
          });
        };
      })(this));
    },
    _updateUsagesInFile: function(fileName, usages, newName) {
      var columnOffset;
      columnOffset = {};
      return atom.workspace.open(fileName, {
        activateItem: false
      }).then(function(editor) {
        var buffer, column, line, name, usage, _i, _len;
        buffer = editor.getBuffer();
        for (_i = 0, _len = usages.length; _i < _len; _i++) {
          usage = usages[_i];
          name = usage.name, line = usage.line, column = usage.column;
          if (columnOffset[line] == null) {
            columnOffset[line] = 0;
          }
          log.debug('Replacing', usage, 'with', newName, 'in', editor.id);
          log.debug('Offset for line', line, 'is', columnOffset[line]);
          buffer.setTextInRange([[line - 1, column + columnOffset[line]], [line - 1, column + name.length + columnOffset[line]]], newName);
          columnOffset[line] += newName.length - name.length;
        }
        return buffer.save();
      });
    },
    _handleGrammarChangeEvent: function(editor, grammar) {
      var disposable, eventId, eventName;
      eventName = 'keyup';
      eventId = "" + editor.displayBuffer.id + "." + eventName;
      if (grammar.scopeName === 'source.python') {
        disposable = this._addEventListener(editor, eventName, (function(_this) {
          return function(e) {
            var germanBracket, otherBracket, qwertyBracket, _ref1;
            qwertyBracket = 'U+0028';
            germanBracket = 'U+0038';
            otherBracket = 'U+0039';
            if ((_ref1 = e.keyIdentifier) === qwertyBracket || _ref1 === germanBracket || _ref1 === otherBracket) {
              log.debug('Trying to complete arguments on keyup event', e);
              return _this._completeArguments(editor, editor.getCursorBufferPosition());
            }
          };
        })(this));
        this.disposables.add(disposable);
        this.subscriptions[eventId] = disposable;
        return log.debug('Subscribed on event', eventId);
      } else {
        if (eventId in this.subscriptions) {
          this.subscriptions[eventId].dispose();
          return log.debug('Unsubscribed from event', eventId);
        }
      }
    },
    _serialize: function(request) {
      log.debug('Serializing request to be sent to Jedi', request);
      return JSON.stringify(request);
    },
    _sendRequest: function(data, respawned) {
      var process;
      log.debug('Pending requests:', Object.keys(this.requests).length, this.requests);
      if (Object.keys(this.requests).length > 10) {
        log.debug('Cleaning up request queue to avoid overflow, ignoring request');
        this.requests = {};
        if (this.provider && this.provider.process) {
          log.debug('Killing python process');
          this.provider.kill();
          return;
        }
      }
      if (this.provider && this.provider.process) {
        process = this.provider.process;
        if (process.exitCode === null && process.signalCode === null) {
          if (this.provider.process.pid) {
            return this.provider.process.stdin.write(data + '\n');
          } else {
            return log.debug('Attempt to communicate with terminated process', this.provider);
          }
        } else if (respawned) {
          atom.notifications.addWarning(["Failed to spawn daemon for autocomplete-python.", "Completions will not work anymore", "unless you restart your editor."].join(' '), {
            detail: ["exitCode: " + process.exitCode, "signalCode: " + process.signalCode].join('\n'),
            dismissable: true
          });
          return this.dispose();
        } else {
          this._spawnDaemon();
          this._sendRequest(data, {
            respawned: true
          });
          return log.debug('Re-spawning python process...');
        }
      } else {
        log.debug('Spawning python process...');
        this._spawnDaemon();
        return this._sendRequest(data);
      }
    },
    _deserialize: function(response) {
      var bufferPosition, cacheSizeDelta, editor, id, ids, resolve, responseSource, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _results;
      log.debug('Deserealizing response from Jedi', response);
      log.debug("Got " + (response.trim().split('\n').length) + " lines");
      _ref1 = response.trim().split('\n');
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        responseSource = _ref1[_i];
        response = JSON.parse(responseSource);
        if (response['arguments']) {
          editor = this.requests[response['id']];
          if (typeof editor === 'object') {
            bufferPosition = editor.getCursorBufferPosition();
            if (response['id'] === this._generateRequestId(editor, bufferPosition)) {
              if ((_ref2 = this.snippetsManager) != null) {
                _ref2.insertSnippet(response['arguments'], editor);
              }
            }
          }
        } else {
          resolve = this.requests[response['id']];
          if (typeof resolve === 'function') {
            resolve(response['results']);
          }
        }
        cacheSizeDelta = Object.keys(this.responses).length > this.cacheSize;
        if (cacheSizeDelta > 0) {
          ids = Object.keys(this.responses).sort((function(_this) {
            return function(a, b) {
              return _this.responses[a]['timestamp'] - _this.responses[b]['timestamp'];
            };
          })(this));
          _ref3 = ids.slice(0, cacheSizeDelta);
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            id = _ref3[_j];
            log.debug('Removing old item from cache with ID', id);
            delete this.responses[id];
          }
        }
        this.responses[response['id']] = {
          source: responseSource,
          timestamp: Date.now()
        };
        log.debug('Cached request with ID', response['id']);
        _results.push(delete this.requests[response['id']]);
      }
      return _results;
    },
    _generateRequestId: function(editor, bufferPosition, text) {
      if (!text) {
        text = editor.getText();
      }
      return require('crypto').createHash('md5').update([editor.getPath(), text, bufferPosition.row, bufferPosition.column].join()).digest('hex');
    },
    _generateRequestConfig: function() {
      var args, extraPaths;
      extraPaths = InterpreterLookup.applySubstitutions(atom.config.get('autocomplete-python.extraPaths').split(';'));
      args = {
        'extraPaths': extraPaths,
        'useSnippets': atom.config.get('autocomplete-python.useSnippets'),
        'caseInsensitiveCompletion': atom.config.get('autocomplete-python.caseInsensitiveCompletion'),
        'showDescriptions': atom.config.get('autocomplete-python.showDescriptions'),
        'fuzzyMatcher': atom.config.get('autocomplete-python.fuzzyMatcher')
      };
      return args;
    },
    setSnippetsManager: function(snippetsManager) {
      this.snippetsManager = snippetsManager;
    },
    _completeArguments: function(editor, bufferPosition, force) {
      var disableForSelector, line, lines, payload, scopeChain, scopeDescriptor, suffix, useSnippets;
      useSnippets = atom.config.get('autocomplete-python.useSnippets');
      if (!force && useSnippets === 'none') {
        return;
      }
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = Selector.create(this.disableForSelector);
      if (selectorsMatchScopeChain(disableForSelector, scopeChain)) {
        log.debug('Ignoring argument completion inside of', scopeChain);
        return;
      }
      lines = editor.getBuffer().getLines();
      line = lines[bufferPosition.row];
      suffix = line.slice(bufferPosition.column, line.length);
      if (!/^(\)(?:$|\s)|\s|$)/.test(suffix)) {
        log.debug('Ignoring argument completion with suffix', suffix);
        return;
      }
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'arguments',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function() {
          return _this.requests[payload.id] = editor;
        };
      })(this));
    },
    _fuzzyFilter: function(candidates, query) {
      if (candidates.length !== 0 && (query !== ' ' && query !== '.')) {
        if (filter == null) {
          filter = require('fuzzaldrin-plus').filter;
        }
        candidates = filter(candidates, query, {
          key: 'text'
        });
      }
      return candidates;
    },
    getSuggestions: function(_arg) {
      var bufferPosition, editor, lastIdentifier, line, lines, matches, payload, prefix, requestId, scopeDescriptor;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      if (!this.triggerCompletionRegex.test(prefix)) {
        return [];
      }
      bufferPosition = {
        row: bufferPosition.row,
        column: bufferPosition.column
      };
      lines = editor.getBuffer().getLines();
      if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
        line = lines[bufferPosition.row];
        lastIdentifier = /\.?[a-zA-Z_][a-zA-Z0-9_]*$/.exec(line.slice(0, bufferPosition.column));
        if (lastIdentifier) {
          bufferPosition.column = lastIdentifier.index + 1;
          lines[bufferPosition.row] = line.slice(0, bufferPosition.column);
        }
      }
      requestId = this._generateRequestId(editor, bufferPosition, lines.join('\n'));
      if (requestId in this.responses) {
        log.debug('Using cached response with ID', requestId);
        matches = JSON.parse(this.responses[requestId]['source'])['results'];
        if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
          return this._fuzzyFilter(matches, prefix);
        } else {
          return matches;
        }
      }
      payload = {
        id: requestId,
        prefix: prefix,
        lookup: 'completions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
            return _this.requests[payload.id] = function(matches) {
              return resolve(_this._fuzzyFilter(matches, prefix));
            };
          } else {
            return _this.requests[payload.id] = resolve;
          }
        };
      })(this));
    },
    getDefinitions: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'definitions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    getUsages: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'usages',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    goToDefinition: function(editor, bufferPosition) {
      if (!editor) {
        editor = atom.workspace.getActiveTextEditor();
      }
      if (!bufferPosition) {
        bufferPosition = editor.getCursorBufferPosition();
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new DefinitionsView();
      return this.getDefinitions(editor, bufferPosition).then((function(_this) {
        return function(results) {
          _this.definitionsView.setItems(results);
          if (results.length === 1) {
            return _this.definitionsView.confirmed(results[0]);
          }
        };
      })(this));
    },
    dispose: function() {
      this.disposables.dispose();
      if (this.provider) {
        return this.provider.kill();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNLQUFBOztBQUFBLEVBQUEsT0FBcUQsT0FBQSxDQUFRLE1BQVIsQ0FBckQsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBQWIsRUFBa0MsdUJBQUEsZUFBbEMsQ0FBQTs7QUFBQSxFQUNDLDJCQUE0QixPQUFBLENBQVEsaUJBQVIsRUFBNUIsd0JBREQsQ0FBQTs7QUFBQSxFQUVDLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWixRQUZELENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FOcEIsQ0FBQTs7QUFBQSxFQU9BLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQVBOLENBQUE7O0FBQUEsRUFRQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FSSixDQUFBOztBQUFBLEVBU0EsTUFBQSxHQUFTLE1BVFQsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxnQkFBVjtBQUFBLElBQ0Esa0JBQUEsRUFBb0IsaURBRHBCO0FBQUEsSUFFQSxpQkFBQSxFQUFtQixDQUZuQjtBQUFBLElBR0Esa0JBQUEsRUFBb0IsQ0FIcEI7QUFBQSxJQUlBLG9CQUFBLEVBQXNCLEtBSnRCO0FBQUEsSUFLQSxTQUFBLEVBQVcsRUFMWDtBQUFB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

//# sourceURL=/home/alenz/.atom/packages/autocomplete-python/lib/provider.coffee
