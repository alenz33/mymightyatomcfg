Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = treeViewGitRepository;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _treeViewGitBranchListJs = require('./tree-view-git-branch-list.js');

var _treeViewGitBranchListJs2 = _interopRequireDefault(_treeViewGitBranchListJs);

var _utilsJs = require('./utils.js');

'use babel';

var prototype = {
  initialize: function initialize(repository, projectRootEl) {
    this.repository = repository;
    this.createElements(projectRootEl);
  },

  createElements: function createElements(projectRootEl) {
    var _repository$getReferences = /*, remotes, tags */this.repository.getReferences();

    var heads = _repository$getReferences.heads;

    this.locals = (0, _treeViewGitBranchListJs2['default'])({
      repository: this.repository,
      icon: 'git-branch',
      title: 'local branches',
      entries: heads
    });
    (0, _utilsJs.insertBefore)(this.locals, projectRootEl);

    // this.remotes = treeViewGitBranchList({
    //   repository: this.repository,
    //   icon: 'git-branch',
    //   title: 'remote branches',
    //   entries: remotes,
    // });
    // insertBefore(this.remotes, projectRootEl);

    // this.tags = treeViewGitBranchList({
    //   repository: this.repository,
    //   icon: 'tag',
    //   title: 'tags',
    //   entries: tags,
    // });
    // insertBefore(this.tags, projectRootEl);
  },

  destroy: function destroy() {
    this.locals.destroy();
    // this.remotes.destroy();
    // this.tags.destroy();
    var _ref = [];
    this.locals /*, this.remotes, this.tags*/ = _ref[0];
    this.repository = _ref[1];
  },

  update: function update() {
    var _repository$getReferences2 = /*, remotes, tags */this.repository.getReferences();

    var heads = _repository$getReferences2.heads;

    this.locals.setEntries(heads);
    // this.remotes.setEntries(remotes);
    // this.tags.setEntries(tags);
  }
};

function treeViewGitRepository() {
  var treeViewGitRepository = Object.create(prototype);

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length) treeViewGitRepository.initialize.apply(treeViewGitRepository, args);
  return treeViewGitRepository;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL3RyZWUtdmlldy1naXQtYnJhbmNoL2xpYi90cmVlLXZpZXctZ2l0LXJlcG9zaXRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQXNEd0IscUJBQXFCOzs7O3VDQXJEWCxnQ0FBZ0M7Ozs7dUJBQ3ZDLFlBQVk7O0FBRnZDLFdBQVcsQ0FBQzs7QUFJWixJQUFJLFNBQVMsR0FBRztBQUNkLFlBQVUsRUFBQSxvQkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFO0FBQ3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDcEM7O0FBRUQsZ0JBQWMsRUFBQSx3QkFBQyxhQUFhLEVBQUU7d0RBQ00sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7O1FBQTVELEtBQUssNkJBQUwsS0FBSzs7QUFFVixRQUFJLENBQUMsTUFBTSxHQUFHLDBDQUFzQjtBQUNsQyxnQkFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQzNCLFVBQUksRUFBRSxZQUFZO0FBQ2xCLFdBQUssRUFBRSxnQkFBZ0I7QUFDdkIsYUFBTyxFQUFFLEtBQUs7S0FDZixDQUFDLENBQUM7QUFDSCwrQkFBYSxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCMUM7O0FBRUQsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7O2VBR3dDLEVBQUU7QUFBL0QsUUFBSSxDQUFDLE1BQU07QUFBK0IsUUFBSSxDQUFDLFVBQVU7R0FDM0Q7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO3lEQUMyQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRTs7UUFBNUQsS0FBSyw4QkFBTCxLQUFLOztBQUVWLFFBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7R0FHL0I7Q0FDRixDQUFDOztBQUVhLFNBQVMscUJBQXFCLEdBQVU7QUFDckQsTUFBSSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztvQ0FETixJQUFJO0FBQUosUUFBSTs7O0FBRW5ELE1BQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxVQUFVLE1BQUEsQ0FBaEMscUJBQXFCLEVBQWUsSUFBSSxDQUFDLENBQUM7QUFDMUQsU0FBTyxxQkFBcUIsQ0FBQztDQUM5QiIsImZpbGUiOiIvaG9tZS9hbGVuei8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LWJyYW5jaC9saWIvdHJlZS12aWV3LWdpdC1yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQgdHJlZVZpZXdHaXRCcmFuY2hMaXN0IGZyb20gJy4vdHJlZS12aWV3LWdpdC1icmFuY2gtbGlzdC5qcyc7XG5pbXBvcnQge2luc2VydEJlZm9yZX0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBwcm90b3R5cGUgPSB7XG4gIGluaXRpYWxpemUocmVwb3NpdG9yeSwgcHJvamVjdFJvb3RFbCkge1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHJlcG9zaXRvcnk7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50cyhwcm9qZWN0Um9vdEVsKTtcbiAgfSxcblxuICBjcmVhdGVFbGVtZW50cyhwcm9qZWN0Um9vdEVsKSB7XG4gICAgdmFyIHtoZWFkcy8qLCByZW1vdGVzLCB0YWdzICovfSA9IHRoaXMucmVwb3NpdG9yeS5nZXRSZWZlcmVuY2VzKCk7XG5cbiAgICB0aGlzLmxvY2FscyA9IHRyZWVWaWV3R2l0QnJhbmNoTGlzdCh7XG4gICAgICByZXBvc2l0b3J5OiB0aGlzLnJlcG9zaXRvcnksXG4gICAgICBpY29uOiAnZ2l0LWJyYW5jaCcsXG4gICAgICB0aXRsZTogJ2xvY2FsIGJyYW5jaGVzJyxcbiAgICAgIGVudHJpZXM6IGhlYWRzLFxuICAgIH0pO1xuICAgIGluc2VydEJlZm9yZSh0aGlzLmxvY2FscywgcHJvamVjdFJvb3RFbCk7XG5cbiAgICAvLyB0aGlzLnJlbW90ZXMgPSB0cmVlVmlld0dpdEJyYW5jaExpc3Qoe1xuICAgIC8vICAgcmVwb3NpdG9yeTogdGhpcy5yZXBvc2l0b3J5LFxuICAgIC8vICAgaWNvbjogJ2dpdC1icmFuY2gnLFxuICAgIC8vICAgdGl0bGU6ICdyZW1vdGUgYnJhbmNoZXMnLFxuICAgIC8vICAgZW50cmllczogcmVtb3RlcyxcbiAgICAvLyB9KTtcbiAgICAvLyBpbnNlcnRCZWZvcmUodGhpcy5yZW1vdGVzLCBwcm9qZWN0Um9vdEVsKTtcblxuICAgIC8vIHRoaXMudGFncyA9IHRyZWVWaWV3R2l0QnJhbmNoTGlzdCh7XG4gICAgLy8gICByZXBvc2l0b3J5OiB0aGlzLnJlcG9zaXRvcnksXG4gICAgLy8gICBpY29uOiAndGFnJyxcbiAgICAvLyAgIHRpdGxlOiAndGFncycsXG4gICAgLy8gICBlbnRyaWVzOiB0YWdzLFxuICAgIC8vIH0pO1xuICAgIC8vIGluc2VydEJlZm9yZSh0aGlzLnRhZ3MsIHByb2plY3RSb290RWwpO1xuICB9LFxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5sb2NhbHMuZGVzdHJveSgpO1xuICAgIC8vIHRoaXMucmVtb3Rlcy5kZXN0cm95KCk7XG4gICAgLy8gdGhpcy50YWdzLmRlc3Ryb3koKTtcbiAgICBbdGhpcy5sb2NhbHMvKiwgdGhpcy5yZW1vdGVzLCB0aGlzLnRhZ3MqLywgdGhpcy5yZXBvc2l0b3J5XSA9IFtdO1xuICB9LFxuXG4gIHVwZGF0ZSgpIHtcbiAgICB2YXIge2hlYWRzLyosIHJlbW90ZXMsIHRhZ3MgKi99ID0gdGhpcy5yZXBvc2l0b3J5LmdldFJlZmVyZW5jZXMoKTtcblxuICAgIHRoaXMubG9jYWxzLnNldEVudHJpZXMoaGVhZHMpO1xuICAgIC8vIHRoaXMucmVtb3Rlcy5zZXRFbnRyaWVzKHJlbW90ZXMpO1xuICAgIC8vIHRoaXMudGFncy5zZXRFbnRyaWVzKHRhZ3MpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJlZVZpZXdHaXRSZXBvc2l0b3J5KC4uLmFyZ3MpIHtcbiAgdmFyIHRyZWVWaWV3R2l0UmVwb3NpdG9yeSA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgaWYoYXJncy5sZW5ndGgpIHRyZWVWaWV3R2l0UmVwb3NpdG9yeS5pbml0aWFsaXplKC4uLmFyZ3MpO1xuICByZXR1cm4gdHJlZVZpZXdHaXRSZXBvc2l0b3J5O1xufVxuIl19
//# sourceURL=/home/alenz/.atom/packages/tree-view-git-branch/lib/tree-view-git-repository.js
