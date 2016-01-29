(function() {
  var IndentGuideImprovedElement, Point, createElementsForGuides, realLength, styleGuide;

  Point = require('atom').Point;

  styleGuide = function(element, point, length, stack, active, editor, rowMap, basePixelPos, lineHeightPixel, baseScreenRow, scrollTop, scrollLeft) {
    var indentSize, left, row, top;
    element.classList.add('indent-guide-improved');
    element.classList[stack ? 'add' : 'remove']('indent-guide-stack');
    element.classList[active ? 'add' : 'remove']('indent-guide-active');
    if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
      element.style.height = '0px';
      return;
    }
    row = rowMap.firstScreenRowForBufferRow(point.row);
    indentSize = editor.getTabLength();
    left = point.column * indentSize * editor.getDefaultCharWidth() - scrollLeft;
    top = basePixelPos + lineHeightPixel * (row - baseScreenRow) - scrollTop;
    element.style.left = "" + left + "px";
    element.style.top = "" + top + "px";
    element.style.height = "" + (editor.getLineHeightInPixels() * realLength(point.row, length, rowMap)) + "px";
    element.style.display = 'block';
    return element.style['z-index'] = 0;
  };

  realLength = function(row, length, rowMap) {
    var row1, row2;
    row1 = rowMap.firstScreenRowForBufferRow(row);
    row2 = rowMap.firstScreenRowForBufferRow(row + length);
    return row2 - row1;
  };

  IndentGuideImprovedElement = document.registerElement('indent-guide-improved');

  createElementsForGuides = function(editorElement, fns) {
    var count, createNum, existNum, items, neededNum, recycleNum, _i, _j, _results, _results1;
    items = editorElement.querySelectorAll('.indent-guide-improved');
    existNum = items.length;
    neededNum = fns.length;
    createNum = Math.max(neededNum - existNum, 0);
    recycleNum = Math.min(neededNum, existNum);
    count = 0;
    (function() {
      _results = [];
      for (var _i = 0; 0 <= existNum ? _i < existNum : _i > existNum; 0 <= existNum ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).forEach(function(i) {
      var node;
      node = items.item(i);
      if (i < recycleNum) {
        return fns[count++](node);
      } else {
        return node.parentNode.removeChild(node);
      }
    });
    (function() {
      _results1 = [];
      for (var _j = 0; 0 <= createNum ? _j < createNum : _j > createNum; 0 <= createNum ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).forEach(function(i) {
      var newNode;
      newNode = new IndentGuideImprovedElement();
      newNode.classList.add('overlayer');
      fns[count++](newNode);
      return editorElement.appendChild(newNode);
    });
    if (count !== neededNum) {
      throw 'System Error';
    }
  };

  module.exports = {
    createElementsForGuides: createElementsForGuides,
    styleGuide: styleGuide
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUIsS0FBekIsRUFBZ0MsTUFBaEMsRUFBd0MsTUFBeEMsRUFBZ0QsTUFBaEQsRUFBd0QsWUFBeEQsRUFBc0UsZUFBdEUsRUFBdUYsYUFBdkYsRUFBc0csU0FBdEcsRUFBaUgsVUFBakgsR0FBQTtBQUNYLFFBQUEsMEJBQUE7QUFBQSxJQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsdUJBQXRCLENBQUEsQ0FBQTtBQUFBLElBQ0EsT0FBTyxDQUFDLFNBQVUsQ0FBRyxLQUFILEdBQWMsS0FBZCxHQUF5QixRQUF6QixDQUFsQixDQUFxRCxvQkFBckQsQ0FEQSxDQUFBO0FBQUEsSUFFQSxPQUFPLENBQUMsU0FBVSxDQUFHLE1BQUgsR0FBZSxLQUFmLEdBQTBCLFFBQTFCLENBQWxCLENBQXNELHFCQUF0RCxDQUZBLENBQUE7QUFJQSxJQUFBLElBQUcsTUFBTSxDQUFDLG1CQUFQLENBQTJCLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFDLEdBQU4sR0FBWSxDQUFyQixFQUF3QixDQUF4QixDQUEzQixDQUFIO0FBQ0UsTUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWQsR0FBdUIsS0FBdkIsQ0FBQTtBQUNBLFlBQUEsQ0FGRjtLQUpBO0FBQUEsSUFRQSxHQUFBLEdBQU0sTUFBTSxDQUFDLDBCQUFQLENBQWtDLEtB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

//# sourceURL=/home/alenz/.atom/packages/indent-guide-improved/lib/indent-guide-improved-element.coffee
