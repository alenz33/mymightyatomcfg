Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.guessName = guessName;
exports.installPackages = installPackages;
exports.packagesToInstall = packagesToInstall;

var _atom = require('atom');

'use babel';

var extractionRegex = /Installing (.*?) to .* (.*)/;
var nameRegex = /(\\|\/)packages(\\|\/)(.*?)(\\|\/)/;

function guessName(filePath) {
  var matches = nameRegex.exec(filePath);
  return matches ? matches[3] : null;
}

function installPackages(dependencies, progressCallback) {
  return new Promise(function (resolve, reject) {
    var errors = [];
    new _atom.BufferedProcess({
      command: atom.packages.getApmPath(),
      args: ['install'].concat(dependencies).concat(['--production', '--color', 'false']),
      options: {},
      stdout: function stdout(contents) {
        var matches = extractionRegex.exec(contents);
        atom.packages.activatePackage(matches[1]);
        if (matches[2] === '✓' || matches[2] === 'done') {
          progressCallback(matches[1], true);
        } else {
          progressCallback(matches[1], false);
          errors.push(contents);
        }
      },
      stderr: function stderr(contents) {
        errors.push(contents);
      },
      exit: function exit() {
        if (errors.length) {
          var error = new Error('Error installing dependencies');
          error.stack = errors.join('');
          reject(error);
        } else resolve();
      }
    });
  });
}

function packagesToInstall(name) {
  var packageInfo = atom.packages.getLoadedPackage(name);

  var toInstall = [],
      toEnable = [];
  (packageInfo ? packageInfo.metadata['package-deps'] ? packageInfo.metadata['package-deps'] : [] : []).forEach(function (name) {
    if (!window.__steelbrain_package_deps.has(name)) {
      window.__steelbrain_package_deps.add(name);
      if (atom.packages.resolvePackagePath(name)) {
        toEnable.push(name);
      } else {
        toInstall.push(name);
      }
    }
  });

  return { toInstall: toInstall, toEnable: toEnable };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1weWxpbnQvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7b0JBRThCLE1BQU07O0FBRnBDLFdBQVcsQ0FBQTs7QUFHWCxJQUFNLGVBQWUsR0FBRyw2QkFBNkIsQ0FBQTtBQUNyRCxJQUFNLFNBQVMsR0FBRyxvQ0FBb0MsQ0FBQTs7QUFFL0MsU0FBUyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDeEMsU0FBTyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQTtDQUNuQzs7QUFFTSxTQUFTLGVBQWUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUU7QUFDOUQsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDM0MsUUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLDhCQUFvQjtBQUNsQixhQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7QUFDbkMsVUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbkYsYUFBTyxFQUFFLEVBQUU7QUFDWCxZQUFNLEVBQUUsZ0JBQVMsUUFBUSxFQUFFO0FBQ3pCLFlBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekMsWUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7QUFDL0MsMEJBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ25DLE1BQU07QUFDTCwwQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDbkMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDdEI7T0FDRjtBQUNELFlBQU0sRUFBRSxnQkFBUyxRQUFRLEVBQUU7QUFDekIsY0FBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUN0QjtBQUNELFVBQUksRUFBRSxnQkFBVztBQUNmLFlBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNqQixjQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ3hELGVBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM3QixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ2QsTUFBTSxPQUFPLEVBQUUsQ0FBQTtPQUNqQjtLQUNGLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO0FBQ3RDLE1BQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXRELE1BQU0sU0FBUyxHQUFHLEVBQUU7TUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BDLEdBQUMsV0FBVyxHQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUksRUFBRSxDQUFBLENBQ25HLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBRTtBQUN0QixRQUFJLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMvQyxZQUFNLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFDLFVBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMxQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUNwQixNQUFNO0FBQ0wsaUJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDckI7S0FDRjtHQUNGLENBQUMsQ0FBQTs7QUFFSixTQUFPLEVBQUMsU0FBUyxFQUFULFNBQVMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFDLENBQUE7Q0FDN0IiLCJmaWxlIjoiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0J1ZmZlcmVkUHJvY2Vzc30gZnJvbSAnYXRvbSdcbmNvbnN0IGV4dHJhY3Rpb25SZWdleCA9IC9JbnN0YWxsaW5nICguKj8pIHRvIC4qICguKikvXG5jb25zdCBuYW1lUmVnZXggPSAvKFxcXFx8XFwvKXBhY2thZ2VzKFxcXFx8XFwvKSguKj8pKFxcXFx8XFwvKS9cblxuZXhwb3J0IGZ1bmN0aW9uIGd1ZXNzTmFtZShmaWxlUGF0aCkge1xuICBjb25zdCBtYXRjaGVzID0gbmFtZVJlZ2V4LmV4ZWMoZmlsZVBhdGgpXG4gIHJldHVybiBtYXRjaGVzID8gbWF0Y2hlc1szXSA6IG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlcyhkZXBlbmRlbmNpZXMsIHByb2dyZXNzQ2FsbGJhY2spIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IGVycm9ycyA9IFtdXG4gICAgbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7XG4gICAgICBjb21tYW5kOiBhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKSxcbiAgICAgIGFyZ3M6IFsnaW5zdGFsbCddLmNvbmNhdChkZXBlbmRlbmNpZXMpLmNvbmNhdChbJy0tcHJvZHVjdGlvbicsICctLWNvbG9yJywgJ2ZhbHNlJ10pLFxuICAgICAgb3B0aW9uczoge30sXG4gICAgICBzdGRvdXQ6IGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBleHRyYWN0aW9uUmVnZXguZXhlYyhjb250ZW50cylcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UobWF0Y2hlc1sxXSlcbiAgICAgICAgaWYgKG1hdGNoZXNbMl0gPT09ICfinJMnIHx8IG1hdGNoZXNbMl0gPT09ICdkb25lJykge1xuICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sobWF0Y2hlc1sxXSwgdHJ1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrKG1hdGNoZXNbMV0sIGZhbHNlKVxuICAgICAgICAgIGVycm9ycy5wdXNoKGNvbnRlbnRzKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3RkZXJyOiBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICBlcnJvcnMucHVzaChjb250ZW50cylcbiAgICAgIH0sXG4gICAgICBleGl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignRXJyb3IgaW5zdGFsbGluZyBkZXBlbmRlbmNpZXMnKVxuICAgICAgICAgIGVycm9yLnN0YWNrID0gZXJyb3JzLmpvaW4oJycpXG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9IGVsc2UgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhY2thZ2VzVG9JbnN0YWxsKG5hbWUpIHtcbiAgbGV0IHBhY2thZ2VJbmZvID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKG5hbWUpXG5cbiAgY29uc3QgdG9JbnN0YWxsID0gW10sIHRvRW5hYmxlID0gW107XG4gIChwYWNrYWdlSW5mbyA/IChwYWNrYWdlSW5mby5tZXRhZGF0YVsncGFja2FnZS1kZXBzJ10gPyBwYWNrYWdlSW5mby5tZXRhZGF0YVsncGFja2FnZS1kZXBzJ10gOiBbXSkgOiBbXSlcbiAgICAuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICBpZiAoIXdpbmRvdy5fX3N0ZWVsYnJhaW5fcGFja2FnZV9kZXBzLmhhcyhuYW1lKSkge1xuICAgICAgICB3aW5kb3cuX19zdGVlbGJyYWluX3BhY2thZ2VfZGVwcy5hZGQobmFtZSlcbiAgICAgICAgaWYgKGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKG5hbWUpKSB7XG4gICAgICAgICAgdG9FbmFibGUucHVzaChuYW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvSW5zdGFsbC5wdXNoKG5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gIHJldHVybiB7dG9JbnN0YWxsLCB0b0VuYWJsZX1cbn1cbiJdfQ==
//# sourceURL=/home/alenz/.atom/packages/linter-pylint/node_modules/atom-package-deps/lib/helpers.js
