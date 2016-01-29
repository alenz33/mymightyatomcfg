(function() {
  var Point, RowMap;

  Point = require('atom').Point;

  RowMap = (function() {
    function RowMap(regions) {
      this.regions = regions;
    }

    RowMap.prototype.firstScreenRowForBufferRow = function(row) {
      var bufAcc, diff, reg, scrAcc, _i, _len, _ref;
      bufAcc = -1;
      scrAcc = -1;
      _ref = this.regions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reg = _ref[_i];
        if (reg.bufferRows === 1 || reg.screenRows === 1) {
          bufAcc += reg.bufferRows;
          scrAcc += reg.screenRows;
          if (row <= bufAcc) {
            break;
          }
          continue;
        }
        if (reg.bufferRows === reg.screenRows) {
          if (row <= bufAcc + reg.bufferRows) {
            diff = row - bufAcc;
            bufAcc += diff;
            scrAcc += diff;
            break;
          }
          bufAcc += reg.bufferRows;
          scrAcc += reg.screenRows;
          continue;
        }
        throw "illegal state";
      }
      return scrAcc;
    };

    return RowMap;

  })();

  module.exports = RowMap;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9yb3ctbWFwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ1MsSUFBQSxnQkFBQyxPQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQURXO0lBQUEsQ0FBYjs7QUFBQSxxQkFHQSwwQkFBQSxHQUE0QixTQUFDLEdBQUQsR0FBQTtBQUMxQixVQUFBLHlDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxDQUFBLENBRFQsQ0FBQTtBQUVBO0FBQUEsV0FBQSwyQ0FBQTt1QkFBQTtBQUNFLFFBQUEsSUFBRyxHQUFHLENBQUMsVUFBSixLQUFrQixDQUFsQixJQUF1QixHQUFHLENBQUMsVUFBSixLQUFrQixDQUE1QztBQUNFLFVBQUEsTUFBQSxJQUFVLEdBQUcsQ0FBQyxVQUFkLENBQUE7QUFBQSxVQUNBLE1BQUEsSUFBVSxHQUFHLENBQUMsVUFEZCxDQUFBO0FBRUEsVUFBQSxJQUFHLEdBQUEsSUFBTyxNQUFWO0FBQ0Usa0JBREY7V0FGQTtBQUlBLG1CQUxGO1NBQUE7QUFNQSxRQUFBLElBQUcsR0FBRyxDQUFDLFVBQUosS0FBa0IsR0FBRyxDQUFDLFVBQXpCO0FBQ0UsVUFBQSxJQUFHLEdBQUEsSUFBTyxNQUFBLEdBQVMsR0FBRyxDQUFDLFVBQXZCO0FBQ0UsWUFBQSxJQUFBLEdBQU8sR0FBQSxHQUFNLE1BQWIsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxJQUFVLElBRFYsQ0FBQTtBQUFBLFlBRUEsTUFBQSxJQUFVLElBRlYsQ0FBQTtBQUdBLGtCQUpGO1dBQUE7QUFBQSxVQUtBLE1BQUEsSUFBVSxHQUFHLENBQUMsVUFMZCxDQUFBO0FBQUEsVUFNQSxNQUFBLElBQVUsR0FBRyxDQUFDLFVBTmQsQ0FBQTtBQU9BLG1CQVJGO1NBTkE7QUFlQSxjQUFNLGVBQU4sQ0FoQkY7QUFBQSxPQUZBO2FBb0JBLE9BckIwQjtJQUFBLENBSDVCLENBQUE7O2tCQUFBOztNQUhGLENBQUE7O0FBQUEsRUE2QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUE3QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/indent-guide-improved/lib/row-map.coffee
