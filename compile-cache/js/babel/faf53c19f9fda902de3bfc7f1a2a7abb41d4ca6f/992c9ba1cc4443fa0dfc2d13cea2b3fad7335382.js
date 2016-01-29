Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = treeViewGitBranchList;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('object-assign-shim');

require('array.from');

var _atom = require('atom');

var _treeViewGitBranchJs = require('./tree-view-git-branch.js');

var _treeViewGitBranchJs2 = _interopRequireDefault(_treeViewGitBranchJs);

var _utilsJs = require('./utils.js');

'use babel';

var prototype = Object.create(HTMLElement.prototype);

Object.assign(prototype, {
  createdCallback: function createdCallback() {
    var _this = this;

    this.classList.add('list-nested-item', 'entry', 'directory', 'tree-view-git-branch-list');

    this.header = this.appendChild(document.createElement('div'));
    this.header.classList.add('header', 'list-item');

    this.label = this.header.appendChild(document.createElement('span'));
    this.label.classList.add('name', 'icon');

    this.entriesByReference = {};
    this.entries = this.appendChild(document.createElement('ol'));
    this.entries.classList.add('list-tree', 'entries');
    this.collapse();

    this.disposables = new _atom.CompositeDisposable((0, _utilsJs.addEventListener)(this.header, 'click', function () {
      return _this.toggleExpansion();
    }));
  },

  destroy: function destroy() {
    this.remove();
    this.disposables.dispose();
    var _ref = [];
    this.disposables = _ref[0];
    this.repository = _ref[1];
  },

  initialize: function initialize(_ref2) {
    var icon = _ref2.icon;
    var title = _ref2.title;
    var entries = _ref2.entries;
    var repository = _ref2.repository;

    this.repository = repository;
    this.setIcon(icon);
    this.setTitle(title);
    this.setEntries(entries);
  },

  setIcon: function setIcon(icon) {
    if (!icon) return;
    this.label.className.replace(/\bicon-[^\s]+/, '');
    this.label.classList.add('icon-' + icon);
  },

  setTitle: function setTitle(title) {
    this.title = title;
    this.label.innerHTML = title;
  },

  setEntries: function setEntries(references) {
    this.entries.innerHTML = '';
    for (var reference of references) {
      this.entries.appendChild((0, _treeViewGitBranchJs2['default'])({
        title: reference,
        repository: this.repository
      }));
    }
  },

  expand: function expand() {
    if (!this.collapsed) return;
    this.collapsed = false;
    this.classList.add('expanded');
    this.classList.remove('collapsed');

    this.entries.style.display = '';
  },

  collapse: function collapse() {
    if (this.collapsed) return;
    this.collapsed = true;
    this.classList.remove('expanded');
    this.classList.add('collapsed');

    this.entries.style.display = 'none';
  },

  toggleExpansion: function toggleExpansion() {
    this.collapsed ? this.expand() : this.collapse();
  },

  getPath: function getPath() {
    return this.repository.getPath().replace(/\/\.git/, '') + ':git-branches';
  },

  isPathEqual: function isPathEqual(path) {
    return path == this.getPath();
  }
});

document.registerElement('tree-view-git-branch-list', {
  prototype: prototype,
  'extends': 'li'
});

function treeViewGitBranchList() {
  var treeViewGitBranchList = document.createElement('li', 'tree-view-git-branch-list');

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length) treeViewGitBranchList.initialize.apply(treeViewGitBranchList, args);
  return treeViewGitBranchList;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL3RyZWUtdmlldy1naXQtYnJhbmNoL2xpYi90cmVlLXZpZXctZ2l0LWJyYW5jaC1saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFtR3dCLHFCQUFxQjs7OztRQWxHdEMsb0JBQW9COztRQUNwQixZQUFZOztvQkFDZSxNQUFNOzttQ0FDViwyQkFBMkI7Ozs7dUJBQzFCLFlBQVk7O0FBTDNDLFdBQVcsQ0FBQzs7QUFPWixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDdkIsaUJBQWUsRUFBQSwyQkFBRzs7O0FBQ2hCLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsMkJBQTJCLENBQUMsQ0FBQzs7QUFFMUYsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM5RCxRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVqRCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNyRSxRQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUV6QyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7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O0FBQ2hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNsRDs7QUFFRCxTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsbUJBQWdCO0dBQzNFOztBQUVELGFBQVcsRUFBQSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsV0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQy9CO0NBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQVEsQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEVBQUU7QUFDcEQsV0FBUyxFQUFULFNBQVM7QUFDVCxhQUFTLElBQUk7Q0FDZCxDQUFDLENBQUM7O0FBRVksU0FBUyxxQkFBcUIsR0FBVTtBQUNyRCxNQUFJLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLDJCQUEyQixDQUFDLENBQUM7O29DQUR2QyxJQUFJO0FBQUosUUFBSTs7O0FBRW5ELE1BQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxVQUFVLE1BQUEsQ0FBaEMscUJBQXFCLEVBQWUsSUFBSSxDQUFDLENBQUM7QUFDMUQsU0FBTyxxQkFBcUIsQ0FBQztDQUM5QiIsImZpbGUiOiIvaG9tZS9hbGVuei8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LWJyYW5jaC9saWIvdHJlZS12aWV3LWdpdC1icmFuY2gtbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0ICdvYmplY3QtYXNzaWduLXNoaW0nO1xuaW1wb3J0ICdhcnJheS5mcm9tJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgdHJlZVZpZXdHaXRCcmFuY2ggZnJvbSAnLi90cmVlLXZpZXctZ2l0LWJyYW5jaC5qcyc7XG5pbXBvcnQge2FkZEV2ZW50TGlzdGVuZXJ9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUpO1xuXG5PYmplY3QuYXNzaWduKHByb3RvdHlwZSwge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsaXN0LW5lc3RlZC1pdGVtJywgJ2VudHJ5JywgJ2RpcmVjdG9yeScsICd0cmVlLXZpZXctZ2l0LWJyYW5jaC1saXN0Jyk7XG5cbiAgICB0aGlzLmhlYWRlciA9IHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgIHRoaXMuaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcicsICdsaXN0LWl0ZW0nKTtcblxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmhlYWRlci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpO1xuICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgnbmFtZScsICdpY29uJyk7XG5cbiAgICB0aGlzLmVudHJpZXNCeVJlZmVyZW5jZSA9IHt9O1xuICAgIHRoaXMuZW50cmllcyA9IHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2wnKSk7XG4gICAgdGhpcy5lbnRyaWVzLmNsYXNzTGlzdC5hZGQoJ2xpc3QtdHJlZScsICdlbnRyaWVzJyk7XG4gICAgdGhpcy5jb2xsYXBzZSgpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmhlYWRlciwgJ2NsaWNrJywgKCkgPT4gdGhpcy50b2dnbGVFeHBhbnNpb24oKSlcbiAgICApO1xuICB9LFxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICBbdGhpcy5kaXNwb3NhYmxlcywgdGhpcy5yZXBvc2l0b3J5XSA9IFtdO1xuICB9LFxuXG4gIGluaXRpYWxpemUoe2ljb24sIHRpdGxlLCBlbnRyaWVzLCByZXBvc2l0b3J5fSkge1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHJlcG9zaXRvcnk7XG4gICAgdGhpcy5zZXRJY29uKGljb24pO1xuICAgIHRoaXMuc2V0VGl0bGUodGl0bGUpO1xuICAgIHRoaXMuc2V0RW50cmllcyhlbnRyaWVzKTtcbiAgfSxcblxuICBzZXRJY29uKGljb24pIHtcbiAgICBpZighaWNvbikgcmV0dXJuO1xuICAgIHRoaXMubGFiZWwuY2xhc3NOYW1lLnJlcGxhY2UoL1xcYmljb24tW15cXHNdKy8sICcnKTtcbiAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoYGljb24tJHtpY29ufWApO1xuICB9LFxuXG4gIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGl0bGU7XG4gIH0sXG5cbiAgc2V0RW50cmllcyhyZWZlcmVuY2VzKSB7XG4gICAgdGhpcy5lbnRyaWVzLmlubmVySFRNTCA9ICcnO1xuICAgIGZvcihsZXQgcmVmZXJlbmNlIG9mIHJlZmVyZW5jZXMpIHtcbiAgICAgIHRoaXMuZW50cmllcy5hcHBlbmRDaGlsZCh0cmVlVmlld0dpdEJyYW5jaCh7XG4gICAgICAgIHRpdGxlOiByZWZlcmVuY2UsXG4gICAgICAgIHJlcG9zaXRvcnk6IHRoaXMucmVwb3NpdG9yeSxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0sXG5cbiAgZXhwYW5kKCkge1xuICAgIGlmKCF0aGlzLmNvbGxhcHNlZCkgcmV0dXJuO1xuICAgIHRoaXMuY29sbGFwc2VkID0gZmFsc2U7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG5cbiAgICB0aGlzLmVudHJpZXMuc3R5bGUuZGlzcGxheSA9ICcnO1xuICB9LFxuXG4gIGNvbGxhcHNlKCkge1xuICAgIGlmKHRoaXMuY29sbGFwc2VkKSByZXR1cm47XG4gICAgdGhpcy5jb2xsYXBzZWQgPSB0cnVlO1xuICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnZXhwYW5kZWQnKTtcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuXG4gICAgdGhpcy5lbnRyaWVzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0sXG5cbiAgdG9nZ2xlRXhwYW5zaW9uKCkge1xuICAgIHRoaXMuY29sbGFwc2VkID8gdGhpcy5leHBhbmQoKSA6IHRoaXMuY29sbGFwc2UoKTtcbiAgfSxcblxuICBnZXRQYXRoKCkge1xuICAgIHJldHVybiBgJHt0aGlzLnJlcG9zaXRvcnkuZ2V0UGF0aCgpLnJlcGxhY2UoL1xcL1xcLmdpdC8sICcnKX06Z2l0LWJyYW5jaGVzYDtcbiAgfSxcblxuICBpc1BhdGhFcXVhbChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGggPT0gdGhpcy5nZXRQYXRoKCk7XG4gIH0sXG59KTtcblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd0cmVlLXZpZXctZ2l0LWJyYW5jaC1saXN0Jywge1xuICBwcm90b3R5cGUsXG4gIGV4dGVuZHM6ICdsaScsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJlZVZpZXdHaXRCcmFuY2hMaXN0KC4uLmFyZ3MpIHtcbiAgdmFyIHRyZWVWaWV3R2l0QnJhbmNoTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJywgJ3RyZWUtdmlldy1naXQtYnJhbmNoLWxpc3QnKTtcbiAgaWYoYXJncy5sZW5ndGgpIHRyZWVWaWV3R2l0QnJhbmNoTGlzdC5pbml0aWFsaXplKC4uLmFyZ3MpO1xuICByZXR1cm4gdHJlZVZpZXdHaXRCcmFuY2hMaXN0O1xufVxuIl19
//# sourceURL=/home/alenz/.atom/packages/tree-view-git-branch/lib/tree-view-git-branch-list.js
