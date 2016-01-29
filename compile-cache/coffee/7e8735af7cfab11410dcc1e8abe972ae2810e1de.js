(function() {
  var $, CompositeDisposable, TreeViewOpenFilesPaneView, _;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require('lodash');

  $ = require('space-pen').$;

  module.exports = TreeViewOpenFilesPaneView = (function() {
    function TreeViewOpenFilesPaneView(repo) {
      var headerSpan, repoName, repoPath, self;
      this.items = [];
      this.panes = [];
      this.activeItem = null;
      this.repo = repo;
      this.paneSub = new CompositeDisposable;
      repoPath = repo.repo.workingDirectory;
      repoName = repoPath.split('/')[repoPath.split('/').length - 1];
      this.element = document.createElement('li');
      this.element.setAttribute('is', 'tree-view-git-modified');
      this.element.classList.add('tree-view-git-modified', 'list-nested-item', 'expanded');
      this.container = document.createElement('ol');
      this.container.classList.add('entries', 'list-tree');
      this.header = document.createElement('div');
      this.header.classList.add('header', 'list-item');
      headerSpan = document.createElement('span');
      headerSpan.classList.add('name', 'icon', 'icon-mark-github');
      headerSpan.setAttribute('data-name', 'Git Modified: ' + repoName);
      headerSpan.innerText = 'Git Modified: ' + repoName;
      this.header.appendChild(headerSpan);
      this.element.appendChild(this.header);
      this.element.appendChild(this.container);
      $(this.header).on('click', function() {
        var nested;
        nested = $(this).closest('.list-nested-item');
        nested.toggleClass('expanded');
        return nested.toggleClass('collapsed');
      });
      self = this;
      $(this.element).on('click', '.list-item[is=tree-view-file]', function() {
        return atom.workspace.open(self.entryForElement(this).item);
      });
    }

    TreeViewOpenFilesPaneView.prototype.setRepo = function(repo) {
      var self;
      self = this;
      this.repo = repo;
      this.reloadStatuses(self, repo);
      if (repo) {
        if (repo.emitter) {
          repo.onDidChangeStatuses((function(_this) {
            return function() {
              return self.reloadStatuses(self, repo, function(err) {
                return console.log(err);
              });
            };
          })(this));
        }
        if (repo.emitter) {
          return repo.onDidChangeStatus((function(_this) {
            return function(item) {
              return self.reloadStatuses(self, repo, function(err) {
                return console.log(err);
              });
            };
          })(this));
        }
      } else {
        return self.removeAll();
      }
    };

    TreeViewOpenFilesPaneView.prototype.reloadStatuses = function(self, repo) {
      var filePath, repoPath;
      if (self.isReloading) {
        return console.warn('Already performing reloadStatuses -- skipping this one!');
      } else if (repo != null) {
        self.isReloading = true;
        self.removeAll();
        repoPath = repo.repo.workingDirectory;
        for (filePath in repo.statuses) {
          if (repo.isPathModified(filePath)) {
            self.addItem(filePath, repoPath, 'status-modified');
          }
          if (repo.isPathNew(filePath)) {
            self.addItem(filePath, repoPath, 'status-new');
          }
        }
        return self.isReloading = false;
      }
    };

    TreeViewOpenFilesPaneView.prototype.setPane = function(pane) {
      this.paneSub.add(pane.observeActiveItem((function(_this) {
        return function(item) {
          _this.activeItem = item;
          return _this.setActiveEntry(item);
        };
      })(this)));
      this.paneSub.add(pane.onDidChangeActiveItem((function(_this) {
        return function(item) {
          var _ref;
          if (!item) {
            return (_ref = _this.activeEntry) != null ? _ref.classList.remove('selected') : void 0;
          }
        };
      })(this)));
      return this.paneSub.add(pane.onDidChangeActive((function(_this) {
        return function(isActive) {
          _this.activeItem = pane.activeItem;
          if (isActive) {
            return _this.setActiveEntry(pane.activeItem);
          }
        };
      })(this)));
    };

    TreeViewOpenFilesPaneView.prototype.addItem = function(item, repoPath, status) {
      var exists, listItem, listItemName, listItemStatus;
      exists = _.findIndex(this.items, function(itemsItem) {
        return itemsItem.item === item;
      });
      if (exists < 0) {
        listItem = document.createElement('li');
        listItem.classList.add('file', 'list-item', status);
        listItem.setAttribute('is', 'tree-view-file');
        listItemName = document.createElement('span');
        listItemName.innerText = item.split('/')[item.split('/').length - 1];
        listItemName.classList.add('name', 'icon', 'icon-file-text');
        listItemName.setAttribute('data-path', item);
        listItemName.setAttribute('data-name', item);
        listItemName.setAttribute('data-repo-path', repoPath);
        listItem.appendChild(listItemName);
        listItemStatus = document.createElement('span');
        if (status === 'status-modified') {
          listItemStatus.innerText = 'M';
        }
        if (status === 'status-new') {
          listItemStatus.innerText = 'N';
        }
        listItemStatus.classList.add('pull-right');
        listItem.appendChild(listItemStatus);
        this.container.appendChild(listItem);
        item = repoPath + '/' + item;
        this.items.push({
          item: item,
          element: listItem
        });
        if (this.activeItem) {
          return this.setActiveEntry(this.activeItem);
        }
      }
    };

    TreeViewOpenFilesPaneView.prototype.updateTitle = function(item, siblings, useLongTitle) {
      var entry, title, _base, _i, _len, _ref;
      if (siblings == null) {
        siblings = true;
      }
      if (useLongTitle == null) {
        useLongTitle = false;
      }
      title = item.getTitle();
      if (siblings) {
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          if (entry.item !== item && (typeof (_base = entry.item).getTitle === "function" ? _base.getTitle() : void 0) === title) {
            useLongTitle = true;
            this.updateTitle(entry.item, false, true);
          }
        }
      }
      if (useLongTitle && (item.getLongTitle != null)) {
        title = item.getLongTitle();
      }
      if (entry = this.entryForItem(item)) {
        return $(entry.element).find('.name').text(title);
      }
    };

    TreeViewOpenFilesPaneView.prototype.entryForItem = function(item) {
      return _.detect(this.items, function(entry) {
        if (item.buffer && item.buffer.file) {
          return item.buffer.file.path.indexOf(entry.item) > -1;
        }
      });
    };

    TreeViewOpenFilesPaneView.prototype.entryForElement = function(item) {
      return _.detect(this.items, function(entry) {
        if (entry.element === item) {
          return item;
        }
      });
    };

    TreeViewOpenFilesPaneView.prototype.setActiveEntry = function(item) {
      var entry, _ref;
      if (item) {
        if ((_ref = this.activeEntry) != null) {
          _ref.classList.remove('selected');
        }
        if (entry = this.entryForItem(item)) {
          entry.element.classList.add('selected');
          return this.activeEntry = entry.element;
        }
      }
    };

    TreeViewOpenFilesPaneView.prototype.removeAll = function() {
      var item, _i, _len, _ref;
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.element.remove();
      }
      return this.items = [];
    };

    TreeViewOpenFilesPaneView.prototype.serialize = function() {};

    TreeViewOpenFilesPaneView.prototype.hide = function() {
      return this.element.classList.add('hidden');
    };

    TreeViewOpenFilesPaneView.prototype.show = function() {
      return this.element.classList.remove('hidden');
    };

    TreeViewOpenFilesPaneView.prototype.destroy = function() {
      this.element.remove();
      return this.paneSub.dispose();
    };

    return TreeViewOpenFilesPaneView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1tb2RpZmllZC9saWIvdHJlZS12aWV3LWdpdC1tb2RpZmllZC1wYW5lLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEVBRUMsSUFBSyxPQUFBLENBQVEsV0FBUixFQUFMLENBRkQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLG1DQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsb0NBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUZkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFIUixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxtQkFKWCxDQUFBO0FBQUEsTUFNQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFOckIsQ0FBQTtBQUFBLE1BT0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixDQUFvQixDQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixDQUFtQixDQUFDLE1BQXBCLEdBQTJCLENBQTNCLENBUC9CLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FUWCxDQUFBO0FBQUEsTUFVQSxJ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

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-modified/lib/tree-view-git-modified-pane-view.coffee
