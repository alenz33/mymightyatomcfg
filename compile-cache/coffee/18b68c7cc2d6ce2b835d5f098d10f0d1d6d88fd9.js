(function() {
  var $, CompositeDisposable, TreeViewOpenFilesPaneView, _;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require('lodash');

  $ = require('space-pen').$;

  module.exports = TreeViewOpenFilesPaneView = (function() {
    function TreeViewOpenFilesPaneView(repo) {
      var header, headerSpan, nested, repoName, repoPath, self;
      this.items = [];
      this.panes = [];
      this.activeItem = null;
      this.repo = repo;
      this.paneSub = new CompositeDisposable;
      repoPath = repo.repo.workingDirectory;
      repoName = repoPath.split('/')[repoPath.split('/').length - 1];
      this.element = document.createElement('ul');
      this.element.classList.add('tree-view', 'list-tree', 'has-collapsable-children', 'focusable-panel');
      nested = document.createElement('li');
      nested.classList.add('list-nested-item', 'expanded');
      this.container = document.createElement('ul');
      this.container.classList.add('list-tree');
      header = document.createElement('div');
      header.classList.add('list-item');
      headerSpan = document.createElement('span');
      headerSpan.classList.add('name', 'icon', 'icon-mark-github');
      headerSpan.setAttribute('data-name', 'Git Modified: ' + repoName);
      headerSpan.innerText = 'Git Modified: ' + repoName;
      header.appendChild(headerSpan);
      nested.appendChild(header);
      nested.appendChild(this.container);
      this.element.appendChild(nested);
      $(this.element).on('click', '.list-nested-item > .list-item', function() {
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

    TreeViewOpenFilesPaneView.prototype.destroy = function() {
      this.element.remove();
      return this.paneSub.dispose();
    };

    return TreeViewOpenFilesPaneView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1tb2RpZmllZC9saWIvdHJlZS12aWV3LWdpdC1tb2RpZmllZC1wYW5lLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEVBRUMsSUFBSyxPQUFBLENBQVEsV0FBUixFQUFMLENBRkQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLG1DQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsb0RBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUZkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFIUixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxtQkFKWCxDQUFBO0FBQUEsTUFNQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFOckIsQ0FBQTtBQUFBLE1BT0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixDQUFvQixDQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixDQUFtQixDQUFDLE1BQXBCLEdBQTJCLENBQTNCLENBUC9CLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FUWCxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixXQUF2QixFQUFvQyxXQUFwQyxFQUFpRCwwQkFBakQsRUFBNkUsaUJBQTdFLENBVkEsQ0FBQTtBQUFBLE1BV0EsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBWFQsQ0FBQTtBQUFBLE1BWUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixrQkFBckIsRUFBeUMsVUFBekMsQ0FaQSxDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBYmIsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsV0FBekIsQ0FkQSxDQUFBO0FBQUEsTUFlQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FmVCxDQUFBO0FBQUEsTUFnQkEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixXQUFyQixDQWhCQSxDQUFBO0FBQUEsTUFrQkEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBbEJiLENBQUE7QUFBQSxNQW1CQSxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLE1BQXpCLEVBQWlDLE1BQWpDLEVBQXlDLGtCQUF6QyxDQW5CQSxDQUFBO0FBQUEsTUFvQkEsVUFBVSxDQUFDLFlBQVgsQ0FBd0IsV0FBeEIsRUFBcUMsZ0JBQUEsR0FBbUIsUUFBeEQsQ0FwQkEsQ0FBQTtBQUFBLE1BcUJBLFVBQVUsQ0FBQyxTQUFYLEdBQXVCLGdCQUFBLEdBQW1CLFFBckIxQyxDQUFBO0FBQUEsTUFzQkEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsVUFBbkIsQ0F0QkEsQ0FBQTtBQUFBLE1BdUJBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE1BQW5CLENBdkJBLENBQUE7QUFBQSxNQXdCQSxNQUFNLENBQUMsV0FBUCxDQUFtQixJQUFDLENBQUEsU0FBcEIsQ0F4QkEsQ0FBQTtBQUFBLE1BeUJBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixNQUFyQixDQXpCQSxDQUFBO0FBQUEsTUEyQkEsQ0FBQSxDQUFFLElBQUMsQ0FBQSxPQUFILENBQVcsQ0FBQyxFQUFaLENBQWUsT0FBZixFQUF3QixnQ0FBeEIsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFFBQUEsTUFBQSxHQUFTLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxPQUFSLENBQWdCLG1CQUFoQixDQUFULENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFVBQW5CLENBREEsQ0FBQTtlQUVBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFdBQW5CLEVBSHdEO01BQUEsQ0FBMUQsQ0EzQkEsQ0FBQTtBQUFBLE1BaUNBLElBQUEsR0FBTyxJQWpDUCxDQUFBO0FBQUEsTUFtQ0EsQ0FBQSxDQUFFLElBQUMsQ0FBQSxPQUFILENBQVcsQ0FBQyxFQUFaLENBQWUsT0FBZixFQUF3QiwrQkFBeEIsRUFBeUQsU0FBQSxHQUFBO2VBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsZUFBTCxDQUFxQixJQUFyQixDQUEwQixDQUFDLElBQS9DLEVBRHVEO01BQUEsQ0FBekQsQ0FuQ0EsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0NBdUNBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTtBQUNQLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQURSLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLElBQXRCLENBRkEsQ0FBQTtBQUdBLE1BQUEsSUFBSSxJQUFKO0FBQ0UsUUFBQSxJQUFHLElBQUksQ0FBQyxPQUFSO0FBQ0UsVUFBQSxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFBLEdBQUE7cUJBQ3ZCLElBQUksQ0FBQyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQ0UsU0FBQyxHQUFELEdBQUE7dUJBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLEVBREE7Y0FBQSxDQURGLEVBRHVCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FBQSxDQURGO1NBQUE7QUFLQSxRQUFBLElBQUcsSUFBSSxDQUFDLE9BQVI7aUJBQ0UsSUFBSSxDQUFDLGlCQUFMLENBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxJQUFELEdBQUE7cUJBQ3JCLElBQUksQ0FBQyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQ0UsU0FBQyxHQUFELEdBQUE7dUJBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLEVBREE7Y0FBQSxDQURGLEVBRHFCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsRUFERjtTQU5GO09BQUEsTUFBQTtlQVlFLElBQUksQ0FBQyxTQUFMLENBQUEsRUFaRjtPQUpPO0lBQUEsQ0F2Q1QsQ0FBQTs7QUFBQSx3Q0FxRkEsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDZCxVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxXQUFSO2VBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSx5REFBYixFQURGO09BQUEsTUFFSyxJQUFHLFlBQUg7QUFDSCxRQUFBLElBQUksQ0FBQyxXQUFMLEdBQW1CLElBQW5CLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFGckIsQ0FBQTtBQUdBLGFBQUEseUJBQUEsR0FBQTtBQUNFLFVBQUEsSUFBRyxJQUFJLENBQUMsY0FBTCxDQUFvQixRQUFwQixDQUFIO0FBQ0UsWUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsRUFBdUIsUUFBdkIsRUFBaUMsaUJBQWpDLENBQUEsQ0FERjtXQUFBO0FBRUEsVUFBQSxJQUFHLElBQUksQ0FBQyxTQUFMLENBQWUsUUFBZixDQUFIO0FBQ0UsWUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsRUFBdUIsUUFBdkIsRUFBaUMsWUFBakMsQ0FBQSxDQURGO1dBSEY7QUFBQSxTQUhBO2VBUUEsSUFBSSxDQUFDLFdBQUwsR0FBbUIsTUFUaEI7T0FIUztJQUFBLENBckZoQixDQUFBOztBQUFBLHdDQW1HQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLElBQUksQ0FBQyxpQkFBTCxDQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDbEMsVUFBQSxLQUFDLENBQUEsVUFBRCxHQUFjLElBQWQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUZrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLENBQWIsQ0FBQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxJQUFJLENBQUMscUJBQUwsQ0FBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ3RDLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBSSxDQUFBLElBQUo7NERBQ2MsQ0FBRSxTQUFTLENBQUMsTUFBeEIsQ0FBK0IsVUFBL0IsV0FERjtXQURzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQWIsQ0FKQSxDQUFBO2FBUUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsSUFBSSxDQUFDLGlCQUFMLENBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFFBQUQsR0FBQTtBQUNsQyxVQUFBLEtBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFVBQW5CLENBQUE7QUFDQSxVQUFBLElBQUksUUFBSjttQkFDRSxLQUFDLENBQUEsY0FBRCxDQUFnQixJQUFJLENBQUMsVUFBckIsRUFERjtXQUZrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLENBQWIsRUFUTztJQUFBLENBbkdULENBQUE7O0FBQUEsd0NBaUhBLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE1BQWpCLEdBQUE7QUFFUCxVQUFBLDhDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxJQUFDLENBQUEsS0FBYixFQUFvQixTQUFDLFNBQUQsR0FBQTtlQUFlLFNBQVMsQ0FBQyxJQUFWLEtBQWtCLEtBQWpDO01BQUEsQ0FBcEIsQ0FBVCxDQUFBO0FBRUEsTUFBQSxJQUFJLE1BQUEsR0FBUyxDQUFiO0FBQ0UsUUFBQSxRQUFBLEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLE1BQXZCLEVBQStCLFdBQS9CLEVBQTRDLE1BQTVDLENBREEsQ0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsZ0JBQTVCLENBRkEsQ0FBQTtBQUFBLFFBR0EsWUFBQSxHQUFlLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBSGYsQ0FBQTtBQUFBLFFBSUEsWUFBWSxDQUFDLFNBQWIsR0FBeUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQWdCLENBQUEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQWUsQ0FBQyxNQUFoQixHQUF1QixDQUF2QixDQUp6QyxDQUFBO0FBQUEsUUFLQSxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQXZCLENBQTJCLE1BQTNCLEVBQW1DLE1BQW5DLEVBQTJDLGdCQUEzQyxDQUxBLENBQUE7QUFBQSxRQU1BLFlBQVksQ0FBQyxZQUFiLENBQTBCLFdBQTFCLEVBQXVDLElBQXZDLENBTkEsQ0FBQTtBQUFBLFFBT0EsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsV0FBMUIsRUFBdUMsSUFBdkMsQ0FQQSxDQUFBO0FBQUEsUUFRQSxZQUFZLENBQUMsWUFBYixDQUEwQixnQkFBMUIsRUFBNEMsUUFBNUMsQ0FSQSxDQUFBO0FBQUEsUUFTQSxRQUFRLENBQUMsV0FBVCxDQUFxQixZQUFyQixDQVRBLENBQUE7QUFBQSxRQVdBLGNBQUEsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FYakIsQ0FBQTtBQWFBLFFBQUEsSUFBSSxNQUFBLEtBQVUsaUJBQWQ7QUFDRSxVQUFBLGNBQWMsQ0FBQyxTQUFmLEdBQTJCLEdBQTNCLENBREY7U0FiQTtBQWdCQSxRQUFBLElBQUksTUFBQSxLQUFVLFlBQWQ7QUFDRSxVQUFBLGNBQWMsQ0FBQyxTQUFmLEdBQTJCLEdBQTNCLENBREY7U0FoQkE7QUFBQSxRQW1CQSxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQXpCLENBQTZCLFlBQTdCLENBbkJBLENBQUE7QUFBQSxRQXFCQSxRQUFRLENBQUMsV0FBVCxDQUFxQixjQUFyQixDQXJCQSxDQUFBO0FBQUEsUUF1QkEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxXQUFYLENBQXVCLFFBQXZCLENBdkJBLENBQUE7QUFBQSxRQXlCQSxJQUFBLEdBQU8sUUFBQSxHQUFXLEdBQVgsR0FBaUIsSUF6QnhCLENBQUE7QUFBQSxRQTJCQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWTtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxVQUFZLE9BQUEsRUFBUyxRQUFyQjtTQUFaLENBM0JBLENBQUE7QUE2QkEsUUFBQSxJQUFJLElBQUMsQ0FBQSxVQUFMO2lCQUNFLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxVQUFqQixFQURGO1NBOUJGO09BSk87SUFBQSxDQWpIVCxDQUFBOztBQUFBLHdDQXNKQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFzQixZQUF0QixHQUFBO0FBQ1gsVUFBQSxtQ0FBQTs7UUFEa0IsV0FBUztPQUMzQjs7UUFEaUMsZUFBYTtPQUM5QztBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUixDQUFBO0FBRUEsTUFBQSxJQUFHLFFBQUg7QUFDRTtBQUFBLGFBQUEsMkNBQUE7MkJBQUE7QUFDRSxVQUFBLElBQUcsS0FBSyxDQUFDLElBQU4sS0FBZ0IsSUFBaEIsZ0VBQW1DLENBQUMsb0JBQVgsS0FBMEIsS0FBdEQ7QUFDRSxZQUFBLFlBQUEsR0FBZSxJQUFmLENBQUE7QUFBQSxZQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBSyxDQUFDLElBQW5CLEVBQXlCLEtBQXpCLEVBQWdDLElBQWhDLENBREEsQ0FERjtXQURGO0FBQUEsU0FERjtPQUZBO0FBUUEsTUFBQSxJQUFHLFlBQUEsSUFBaUIsMkJBQXBCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFlBQUwsQ0FBQSxDQUFSLENBREY7T0FSQTtBQVdBLE1BQUEsSUFBRyxLQUFBLEdBQVEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLENBQVg7ZUFDRSxDQUFBLENBQUUsS0FBSyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixPQUF0QixDQUE4QixDQUFDLElBQS9CLENBQW9DLEtBQXBDLEVBREY7T0FaVztJQUFBLENBdEpiLENBQUE7O0FBQUEsd0NBcUtBLFlBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTthQUNaLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLEtBQVYsRUFBaUIsU0FBQyxLQUFELEdBQUE7QUFDZixRQUFBLElBQUcsSUFBSSxDQUFDLE1BQUwsSUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQTlCO2lCQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUF0QixDQUE4QixLQUFLLENBQUMsSUFBcEMsQ0FBQSxHQUE0QyxDQUFBLEVBRDlDO1NBRGU7TUFBQSxDQUFqQixFQURZO0lBQUEsQ0FyS2QsQ0FBQTs7QUFBQSx3Q0EwS0EsZUFBQSxHQUFpQixTQUFDLElBQUQsR0FBQTthQUNmLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLEtBQVYsRUFBaUIsU0FBQyxLQUFELEdBQUE7QUFDZixRQUFBLElBQUksS0FBSyxDQUFDLE9BQU4sS0FBaUIsSUFBckI7QUFDRSxpQkFBTyxJQUFQLENBREY7U0FEZTtNQUFBLENBQWpCLEVBRGU7SUFBQSxDQTFLakIsQ0FBQTs7QUFBQSx3Q0ErS0EsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFIOztjQUNjLENBQUUsU0FBUyxDQUFDLE1BQXhCLENBQStCLFVBQS9CO1NBQUE7QUFDQSxRQUFBLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxDQUFYO0FBQ0UsVUFBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUF4QixDQUE0QixVQUE1QixDQUFBLENBQUE7aUJBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUFLLENBQUMsUUFGdkI7U0FGRjtPQURjO0lBQUEsQ0EvS2hCLENBQUE7O0FBQUEsd0NBc0xBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLG9CQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO0FBQ0UsUUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsQ0FBQSxDQUFBLENBREY7QUFBQSxPQUFBO2FBRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxHQUhBO0lBQUEsQ0F0TFgsQ0FBQTs7QUFBQSx3Q0E0TEEsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQTVMWCxDQUFBOztBQUFBLHdDQStMQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxFQUZPO0lBQUEsQ0EvTFQsQ0FBQTs7cUNBQUE7O01BUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/tree-view-git-modified/lib/tree-view-git-modified-pane-view.coffee
