(function() {
  var Point, fillInNulls, getGuides, getVirtualIndent, mergeCropped, statesAboveVisible, statesBelowVisible, statesInvisible, supportingIndents, toG, toGuides, uniq,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Point = require('atom').Point;

  toG = function(indents, begin, depth, cursorRows) {
    var gs, isActive, isStack, ptr, r, _ref;
    ptr = begin;
    isActive = false;
    isStack = false;
    gs = [];
    while (ptr < indents.length && depth <= indents[ptr]) {
      if (depth < indents[ptr]) {
        r = toG(indents, ptr, depth + 1, cursorRows);
        if ((_ref = r.guides[0]) != null ? _ref.stack : void 0) {
          isStack = true;
        }
        Array.prototype.push.apply(gs, r.guides);
        ptr = r.ptr;
      } else {
        if (__indexOf.call(cursorRows, ptr) >= 0) {
          isActive = true;
          isStack = true;
        }
        ptr++;
      }
    }
    if (depth !== 0) {
      gs.unshift({
        length: ptr - begin,
        point: new Point(begin, depth - 1),
        active: isActive,
        stack: isStack
      });
    }
    return {
      guides: gs,
      ptr: ptr
    };
  };

  fillInNulls = function(indents) {
    var res;
    res = indents.reduceRight(function(acc, cur) {
      if (cur === null) {
        acc.r.unshift(acc.i);
        return {
          r: acc.r,
          i: acc.i
        };
      } else {
        acc.r.unshift(cur);
        return {
          r: acc.r,
          i: cur
        };
      }
    }, {
      r: [],
      i: 0
    });
    return res.r;
  };

  toGuides = function(indents, cursorRows) {
    var ind;
    ind = fillInNulls(indents.map(function(i) {
      if (i === null) {
        return null;
      } else {
        return Math.floor(i);
      }
    }));
    return toG(ind, 0, 0, cursorRows).guides;
  };

  getVirtualIndent = function(getIndentFn, row, lastRow) {
    var i, ind, _i;
    for (i = _i = row; row <= lastRow ? _i <= lastRow : _i >= lastRow; i = row <= lastRow ? ++_i : --_i) {
      ind = getIndentFn(i);
      if (ind != null) {
        return ind;
      }
    }
    return 0;
  };

  uniq = function(values) {
    var last, newVals, v, _i, _len;
    newVals = [];
    last = null;
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      v = values[_i];
      if (newVals.length === 0 || last !== v) {
        newVals.push(v);
      }
      last = v;
    }
    return newVals;
  };

  mergeCropped = function(guides, above, below, height) {
    guides.forEach(function(g) {
      var _ref, _ref1, _ref2, _ref3;
      if (g.point.row === 0) {
        if (_ref = g.point.column, __indexOf.call(above.active, _ref) >= 0) {
          g.active = true;
        }
        if (_ref1 = g.point.column, __indexOf.call(above.stack, _ref1) >= 0) {
          g.stack = true;
        }
      }
      if (height < g.point.row + g.length) {
        if (_ref2 = g.point.column, __indexOf.call(below.active, _ref2) >= 0) {
          g.active = true;
        }
        if (_ref3 = g.point.column, __indexOf.call(below.stack, _ref3) >= 0) {
          return g.stack = true;
        }
      }
    });
    return guides;
  };

  supportingIndents = function(visibleLast, lastRow, getIndentFn) {
    var count, indent, indents;
    if (getIndentFn(visibleLast) != null) {
      return [];
    }
    indents = [];
    count = visibleLast + 1;
    while (count <= lastRow) {
      indent = getIndentFn(count);
      indents.push(indent);
      if (indent != null) {
        break;
      }
      count++;
    }
    return indents;
  };

  getGuides = function(visibleFrom, visibleTo, lastRow, cursorRows, getIndentFn) {
    var above, below, guides, support, visibleIndents, visibleLast, _i, _results;
    visibleLast = Math.min(visibleTo, lastRow);
    visibleIndents = (function() {
      _results = [];
      for (var _i = visibleFrom; visibleFrom <= visibleLast ? _i <= visibleLast : _i >= visibleLast; visibleFrom <= visibleLast ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(getIndentFn);
    support = supportingIndents(visibleLast, lastRow, getIndentFn);
    guides = toGuides(visibleIndents.concat(support), cursorRows.map(function(c) {
      return c - visibleFrom;
    }));
    above = statesAboveVisible(cursorRows, visibleFrom - 1, getIndentFn, lastRow);
    below = statesBelowVisible(cursorRows, visibleLast + 1, getIndentFn, lastRow);
    return mergeCropped(guides, above, below, visibleLast - visibleFrom);
  };

  statesInvisible = function(cursorRows, start, getIndentFn, lastRow, isAbove) {
    var active, cursors, i, ind, minIndent, stack, vind, _i, _j, _k, _l, _len, _ref, _ref1, _results, _results1, _results2;
    if ((isAbove ? start < 0 : lastRow < start)) {
      return {
        stack: [],
        active: []
      };
    }
    cursors = isAbove ? uniq(cursorRows.filter(function(r) {
      return r <= start;
    }).sort(), true).reverse() : uniq(cursorRows.filter(function(r) {
      return start <= r;
    }).sort(), true);
    active = [];
    stack = [];
    minIndent = Number.MAX_VALUE;
    _ref = (isAbove ? (function() {
      _results = [];
      for (var _j = start; start <= 0 ? _j <= 0 : _j >= 0; start <= 0 ? _j++ : _j--){ _results.push(_j); }
      return _results;
    }).apply(this) : (function() {
      _results1 = [];
      for (var _k = start; start <= lastRow ? _k <= lastRow : _k >= lastRow; start <= lastRow ? _k++ : _k--){ _results1.push(_k); }
      return _results1;
    }).apply(this));
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      ind = getIndentFn(i);
      if (ind != null) {
        minIndent = Math.min(minIndent, ind);
      }
      if (cursors.length === 0 || minIndent === 0) {
        break;
      }
      if (cursors[0] === i) {
        cursors.shift();
        vind = getVirtualIndent(getIndentFn, i, lastRow);
        minIndent = Math.min(minIndent, vind);
        if (vind === minIndent) {
          active.push(vind - 1);
        }
        if (stack.length === 0) {
          stack = (function() {
            _results2 = [];
            for (var _l = 0, _ref1 = minIndent - 1; 0 <= _ref1 ? _l <= _ref1 : _l >= _ref1; 0 <= _ref1 ? _l++ : _l--){ _results2.push(_l); }
            return _results2;
          }).apply(this);
        }
      }
    }
    return {
      stack: uniq(stack.sort()),
      active: uniq(active.sort())
    };
  };

  statesAboveVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, true);
  };

  statesBelowVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, false);
  };

  module.exports = {
    toGuides: toGuides,
    getGuides: getGuides,
    uniq: uniq,
    statesAboveVisible: statesAboveVisible,
    statesBelowVisible: statesBelowVisible
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9ndWlkZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhKQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsVUFBeEIsR0FBQTtBQUNKLFFBQUEsbUNBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxLQUFOLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxLQURYLENBQUE7QUFBQSxJQUVBLE9BQUEsR0FBVSxLQUZWLENBQUE7QUFBQSxJQUlBLEVBQUEsR0FBSyxFQUpMLENBQUE7QUFLQSxXQUFNLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBZCxJQUF3QixLQUFBLElBQVMsT0FBUSxDQUFBLEdBQUEsQ0FBL0MsR0FBQTtBQUNFLE1BQUEsSUFBRyxLQUFBLEdBQVEsT0FBUSxDQUFBLEdBQUEsQ0FBbkI7QUFDRSxRQUFBLENBQUEsR0FBSSxHQUFBLENBQUksT0FBSixFQUFhLEdBQWIsRUFBa0IsS0FBQSxHQUFRLENBQTFCLEVBQTZCLFVBQTdCLENBQUosQ0FBQTtBQUNBLFFBQUEsdUNBQWMsQ0FBRSxjQUFoQjtBQUNFLFVBQUEsT0FBQSxHQUFVLElBQVYsQ0FERjtTQURBO0FBQUEsUUFHQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFyQixDQUEyQixFQUEzQixFQUErQixDQUFDLENBQUMsTUFBakMsQ0FIQSxDQUFBO0FBQUEsUUFJQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLEdBSlIsQ0FERjtPQUFBLE1BQUE7QUFPRSxRQUFBLElBQUcsZUFBTyxVQUFQLEVB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

//# sourceURL=/home/alenz/.atom/packages/indent-guide-improved/lib/guides.coffee
