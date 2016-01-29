Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = treeViewGitBranch;

require('object-assign-shim');

require('array.from');

var _atom = require('atom');

var _utilsJs = require('./utils.js');

'use babel';

var prototype = Object.create(HTMLElement.prototype);

Object.assign(prototype, {
  createdCallback: function createdCallback() {
    var _this = this;

    this.classList.add('list-item', 'entry', 'file', 'tree-view-git-branch');

    this.label = this.appendChild(document.createElement('span'));
    this.label.classList.add('name', 'icon');

    this.disposables = new _atom.CompositeDisposable((0, _utilsJs.addEventListener)(this, 'click', function (event) {
      return _this.onClick(event);
    }));
  },

  destroy: function destroy() {
    this.disposables.dispose();
    var _ref = [];
    this.disposables = _ref[0];
    this.repository = _ref[1];
  },

  initialize: function initialize(_ref2) {
    var icon = _ref2.icon;
    var title = _ref2.title;
    var repository = _ref2.repository;

    this.repository = repository;
    this.setIcon(icon);
    this.setTitle(title);
  },

  setIcon: function setIcon(icon) {
    if (!icon) return;
    this.label.className.replace(/\bicon-[^\s]+/, 'icon-' + icon);
    // this.label.classList.add(`icon-${icon}`);
  },

  setTitle: function setTitle(ref) {
    this.setAttribute('data-ref', ref);

    var _ref$match = ref.match(/refs\/(?:heads|tags|remotes\/([^/]+))\/(.+)/);

    var _ref$match2 = _slicedToArray(_ref$match, 3);

    var remote = _ref$match2[1];
    var shortRef = _ref$match2[2];

    this.label.innerHTML = remote ? remote + '/' + shortRef : shortRef;

    if (shortRef != this.repository.getShortHead()) {
      this.classList.add('status-ignored');
    }
  },

  onClick: function onClick(event) {
    // only checkout branch on double click
    if (event.detail != 2) return;

    for (var element of Array.from(this.parentNode.childNodes)) {
      element.classList.add('status-ignored');
    }
    this.classList.remove('status-ignored');

    var ref = this.getAttribute('data-ref');

    if (this.repository.checkoutReference(ref)) {
      atom.notifications.addSuccess('Checkout ' + ref + '.');
    } else {
      atom.notifications.addError('Checkout of ' + ref + ' failed.');
    }
  },

  getPath: function getPath() {
    return this.repository.getPath().replace(/\/\.git/, '') + ':git-branches/' + this.getAttribute('data-ref');
  },

  isPathEqual: function isPathEqual(path) {
    return path == this.getPath();
  },

  toggleExpansion: function toggleExpansion() {
    /* a bug in the tree view causes the tree view to call
     * the toggleExpansion method on this branch. remove
     * this when atom/tree-view#596 is merged */
  }
});

document.registerElement('tree-view-git-branch', {
  prototype: prototype,
  'extends': 'li'
});

function treeViewGitBranch() {
  var treeViewGitBranch = document.createElement('li', 'tree-view-git-branch');

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length) treeViewGitBranch.initialize.apply(treeViewGitBranch, args);
  return treeViewGitBranch;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL3RyZWUtdmlldy1naXQtYnJhbmNoL2xpYi90cmVlLXZpZXctZ2l0LWJyYW5jaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBc0Z3QixpQkFBaUI7O1FBckZsQyxvQkFBb0I7O1FBQ3BCLFlBQVk7O29CQUNlLE1BQU07O3VCQUNULFlBQVk7O0FBSjNDLFdBQVcsQ0FBQzs7QUFNWixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDdkIsaUJBQWUsRUFBQSwyQkFBRzs7O0FBQ2hCLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0FBRXpFLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDOUQsUUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLFdBQVcsR0FBRyw4QkFDakIsK0JBQWlCLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBQSxLQUFLO2FBQUksTUFBSyxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQUEsQ0FBQyxDQUM5RCxDQUFDO0dBQ0g7O0FBRUQsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztlQUNXLEVBQUU7QUFBdkMsUUFBSSxDQUFDLFdBQVc7QUFBRSxRQUFJLENBQUMsVUFBVTtHQUNuQzs7QUFFRCxZQUFVLEVBQUEsb0JBQUMsS0FBMkIsRUFBRTtRQUEzQixJQUFJLEdBQU4sS0FBMkIsQ0FBekIsSUFBSTtRQUFF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YXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LWJyYW5jaC9saWIvdHJlZS12aWV3LWdpdC1icmFuY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCAnb2JqZWN0LWFzc2lnbi1zaGltJztcbmltcG9ydCAnYXJyYXkuZnJvbSc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHthZGRFdmVudExpc3RlbmVyfSBmcm9tICcuL3V0aWxzLmpzJztcblxudmFyIHByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKTtcblxuT2JqZWN0LmFzc2lnbihwcm90b3R5cGUsIHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbGlzdC1pdGVtJywgJ2VudHJ5JywgJ2ZpbGUnLCAndHJlZS12aWV3LWdpdC1icmFuY2gnKTtcblxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7XG4gICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCduYW1lJywgJ2ljb24nKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIodGhpcywgJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5vbkNsaWNrKGV2ZW50KSlcbiAgICApO1xuICB9LFxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgW3RoaXMuZGlzcG9zYWJsZXMsIHRoaXMucmVwb3NpdG9yeV0gPSBbXTtcbiAgfSxcblxuICBpbml0aWFsaXplKHsgaWNvbiwgdGl0bGUsIHJlcG9zaXRvcnkgfSkge1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHJlcG9zaXRvcnk7XG4gICAgdGhpcy5zZXRJY29uKGljb24pO1xuICAgIHRoaXMuc2V0VGl0bGUodGl0bGUpO1xuICB9LFxuXG4gIHNldEljb24oaWNvbikge1xuICAgIGlmKCFpY29uKSByZXR1cm47XG4gICAgdGhpcy5sYWJlbC5jbGFzc05hbWUucmVwbGFjZSgvXFxiaWNvbi1bXlxcc10rLywgYGljb24tJHtpY29ufWApO1xuICAgIC8vIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZChgaWNvbi0ke2ljb259YCk7XG4gIH0sXG5cbiAgc2V0VGl0bGUocmVmKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RhdGEtcmVmJywgcmVmKTtcblxuICAgIHZhciBbLCByZW1vdGUsIHNob3J0UmVmXSA9IHJlZi5tYXRjaCgvcmVmc1xcLyg/OmhlYWRzfHRhZ3N8cmVtb3Rlc1xcLyhbXi9dKykpXFwvKC4rKS8pO1xuICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gcmVtb3RlID8gYCR7cmVtb3RlfS8ke3Nob3J0UmVmfWAgOiBzaG9ydFJlZjtcblxuICAgIGlmKHNob3J0UmVmICE9IHRoaXMucmVwb3NpdG9yeS5nZXRTaG9ydEhlYWQoKSkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdzdGF0dXMtaWdub3JlZCcpO1xuICAgIH1cbiAgfSxcblxuICBvbkNsaWNrKGV2ZW50KSB7XG4gICAgLy8gb25seSBjaGVja291dCBicmFuY2ggb24gZG91YmxlIGNsaWNrXG4gICAgaWYoZXZlbnQuZGV0YWlsICE9IDIpIHJldHVybjtcblxuICAgIGZvcihsZXQgZWxlbWVudCBvZiBBcnJheS5mcm9tKHRoaXMucGFyZW50Tm9kZS5jaGlsZE5vZGVzKSkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzdGF0dXMtaWdub3JlZCcpO1xuICAgIH1cbiAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YXR1cy1pZ25vcmVkJyk7XG5cbiAgICB2YXIgcmVmID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVmJyk7XG5cbiAgICBpZih0aGlzLnJlcG9zaXRvcnkuY2hlY2tvdXRSZWZlcmVuY2UocmVmKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYENoZWNrb3V0ICR7cmVmfS5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBDaGVja291dCBvZiAke3JlZn0gZmFpbGVkLmApO1xuICAgIH1cbiAgfSxcblxuICBnZXRQYXRoKCkge1xuICAgIHJldHVybiBgJHt0aGlzLnJlcG9zaXRvcnkuZ2V0UGF0aCgpLnJlcGxhY2UoL1xcL1xcLmdpdC8sICcnKX06Z2l0LWJyYW5jaGVzLyR7dGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVmJyl9YDtcbiAgfSxcblxuICBpc1BhdGhFcXVhbChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGggPT0gdGhpcy5nZXRQYXRoKCk7XG4gIH0sXG5cbiAgdG9nZ2xlRXhwYW5zaW9uKCkge1xuICAgIC8qIGEgYnVnIGluIHRoZSB0cmVlIHZpZXcgY2F1c2VzIHRoZSB0cmVlIHZpZXcgdG8gY2FsbFxuICAgICAqIHRoZSB0b2dnbGVFeHBhbnNpb24gbWV0aG9kIG9uIHRoaXMgYnJhbmNoLiByZW1vdmVcbiAgICAgKiB0aGlzIHdoZW4gYXRvbS90cmVlLXZpZXcjNTk2IGlzIG1lcmdlZCAqL1xuICB9LFxufSk7XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgndHJlZS12aWV3LWdpdC1icmFuY2gnLCB7XG4gIHByb3RvdHlwZSxcbiAgZXh0ZW5kczogJ2xpJyxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmVlVmlld0dpdEJyYW5jaCguLi5hcmdzKSB7XG4gIHZhciB0cmVlVmlld0dpdEJyYW5jaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJywgJ3RyZWUtdmlldy1naXQtYnJhbmNoJyk7XG4gIGlmKGFyZ3MubGVuZ3RoKSB0cmVlVmlld0dpdEJyYW5jaC5pbml0aWFsaXplKC4uLmFyZ3MpO1xuICByZXR1cm4gdHJlZVZpZXdHaXRCcmFuY2g7XG59XG4iXX0=
//# sourceURL=/home/alenz/.atom/packages/tree-view-git-branch/lib/tree-view-git-branch.js
