'use babel';

describe('The flake8 provider for Linter', function () {
  var lint = require('../lib/main').provideLinter().lint;

  beforeEach(function () {
    waitsForPromise(function () {
      return Promise.all([atom.packages.activatePackage('linter-flake8'), atom.packages.activatePackage('language-python').then(function () {
        return atom.workspace.open(__dirname + '/fixtures/good.py');
      })]);
    });
  });

  it('should be in the packages list', function () {
    return expect(atom.packages.isPackageLoaded('linter-flake8')).toBe(true);
  });

  it('should be an active package', function () {
    return expect(atom.packages.isPackageActive('linter-flake8')).toBe(true);
  });

  describe('checks bad.py and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(__dirname + '/fixtures/bad.py').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      return lint(editor).then(function (messages) {
        expect(messages.length).toBeGreaterThan(0);
      });
    });

    it('verifies that message', function () {
      return lint(editor).then(function (messages) {
        expect(messages[0].type).toBeDefined();
        expect(messages[0].type).toEqual('Warning');
        expect(messages[0].html).not.toBeDefined();
        expect(messages[0].text).toBeDefined();
        expect(messages[0].text).toEqual('F821 — undefined name \'asfd\'');
        expect(messages[0].filePath).toBeDefined();
        expect(messages[0].filePath).toMatch(/.+spec[\\\/]fixtures[\\\/]bad\.py$/);
        expect(messages[0].range).toBeDefined();
        expect(messages[0].range.length).toEqual(2);
        expect(messages[0].range).toEqual([[0, 0], [0, 4]]);
      });
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/fixtures/good.py').then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvc3BlYy9saW50ZXItZmxha2U4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOztBQUVaLFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFNO0FBQy9DLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRXpELFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsRUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUM7ZUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1CQUFtQixDQUFDO09BQUEsQ0FDckQsQ0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07QUFDekMsV0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUUsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyw2QkFBNkIsRUFBRSxZQUFNO0FBQ3RDLFdBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFFLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsbUJBQW1CLEVBQUUsWUFBTTtBQUNsQyxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsY0FBVSxDQUFDLFlBQU07QUFDZixxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxVQUFVLEVBQUk7QUFDNUUsZ0JBQU0sR0FBRyxVQUFVLENBQUM7U0FDckIsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQ3JDLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNuQyxjQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUM1QyxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHVCQUF1QixFQUFFLFlBQU07QUFDaEMsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ25DLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDdkMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDM0MsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN2QyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ25FLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDM0MsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMzRSxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNyRCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLHVDQUF1QyxFQUFFLFlBQU07QUFDaEQsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3pFLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNuQyxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEMsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvc3BlYy9saW50ZXItZmxha2U4LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZGVzY3JpYmUoJ1RoZSBmbGFrZTggcHJvdmlkZXIgZm9yIExpbnRlcicsICgpID0+IHtcbiAgY29uc3QgbGludCA9IHJlcXVpcmUoJy4uL2xpYi9tYWluJykucHJvdmlkZUxpbnRlcigpLmxpbnQ7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItZmxha2U4JyksXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1weXRob24nKS50aGVuKCgpID0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpeHR1cmVzL2dvb2QucHknKVxuICAgICAgICApXG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBpbiB0aGUgcGFja2FnZXMgbGlzdCcsICgpID0+IHtcbiAgICByZXR1cm4gZXhwZWN0KGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdsaW50ZXItZmxha2U4JykpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgYW4gYWN0aXZlIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgcmV0dXJuIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnbGludGVyLWZsYWtlOCcpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hlY2tzIGJhZC5weSBhbmQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IG51bGw7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpeHR1cmVzL2JhZC5weScpLnRoZW4ob3BlbkVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kcyBhdCBsZWFzdCBvbmUgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIHJldHVybiBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoYXQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIHJldHVybiBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udHlwZSkudG9FcXVhbCgnV2FybmluZycpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uaHRtbCkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udGV4dCkudG9FcXVhbCgnRjgyMSDigJQgdW5kZWZpbmVkIG5hbWUgXFwnYXNmZFxcJycpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5maWxlUGF0aCkudG9NYXRjaCgvLitzcGVjW1xcXFxcXC9dZml4dHVyZXNbXFxcXFxcL11iYWRcXC5weSQvKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvRXF1YWwoW1swLCAwXSwgWzAsIDRdXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmRzIG5vdGhpbmcgd3Jvbmcgd2l0aCBhIHZhbGlkIGZpbGUnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZGlybmFtZSArICcvZml4dHVyZXMvZ29vZC5weScpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/alenz/.atom/packages/linter-flake8/spec/linter-flake8-spec.js