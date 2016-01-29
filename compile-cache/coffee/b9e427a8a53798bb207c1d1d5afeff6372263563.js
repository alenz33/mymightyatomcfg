(function() {
  var Point, fits, getGuides, gs, its, statesAboveVisible, statesBelowVisible, toGuides, uniq;

  gs = require('../lib/guides');

  toGuides = gs.toGuides, uniq = gs.uniq, statesAboveVisible = gs.statesAboveVisible, statesBelowVisible = gs.statesBelowVisible, getGuides = gs.getGuides;

  Point = require('atom').Point;

  its = function(f) {
    return it(f.toString(), f);
  };

  fits = function(f) {
    return fit(f.toString(), f);
  };

  describe("toGuides", function() {
    var guides;
    guides = null;
    describe("step-by-step indent", function() {
      beforeEach(function() {
        return guides = toGuides([0, 1, 2, 2, 1, 2, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(6);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(2, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(5, 1));
      });
    });
    describe("steep indent", function() {
      beforeEach(function() {
        return guides = toGuides([0, 3, 2, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(1, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(1, 2));
      });
    });
    describe("steep dedent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 1, 2, 3, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(2, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(3, 2));
      });
    });
    describe("recurring indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 1, 1, 0, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(2);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(1);
      });
      return its(function() {
        return expect(guides[1].point).toEqual(new Point(4, 0));
      });
    });
    describe("no indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 0, 0], []);
      });
      return its(function() {
        return expect(guides.length).toBe(0);
      });
    });
    describe("same indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([1, 1, 1], []);
      });
      its(function() {
        return expect(guides.length).toBe(1);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      return its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
    });
    describe("stack and active", function() {
      describe("simple", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 2, 1, 2, 1, 0], [2]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(false);
        });
        its(function() {
          return expect(guides[1].stack).toBe(true);
        });
        its(function() {
          return expect(guides[1].active).toBe(true);
        });
        its(function() {
          return expect(guides[2].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[2].active).toBe(false);
        });
      });
      describe("cursor not on deepest", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1], [0]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(true);
        });
        its(function() {
          return expect(guides[1].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[1].active).toBe(false);
        });
      });
      describe("no cursor", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1], []);
        });
        its(function() {
          return expect(guides[0].stack).toBe(false);
        });
        its(function() {
          return expect(guides[0].active).toBe(false);
        });
        its(function() {
          return expect(guides[1].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[1].active).toBe(false);
        });
      });
      return describe("multiple cursors", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1, 2, 0, 1], [1, 2]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(true);
        });
        its(function() {
          return expect(guides[1].stack).toBe(true);
        });
        its(function() {
          return expect(guides[1].active).toBe(true);
        });
        its(function() {
          return expect(guides[2].stack).toBe(false);
        });
        its(function() {
          return expect(guides[2].active).toBe(false);
        });
        its(function() {
          return expect(guides[3].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[3].active).toBe(false);
        });
      });
    });
    describe("empty lines", function() {
      describe("between the same indents", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("starts with a null", function() {
        beforeEach(function() {
          return guides = toGuides([null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(2);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("starts with nulls", function() {
        beforeEach(function() {
          return guides = toGuides([null, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("ends with a null", function() {
        beforeEach(function() {
          return guides = toGuides([1, null], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(1);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("ends with nulls", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, null], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(1);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("large to small", function() {
        beforeEach(function() {
          return guides = toGuides([2, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(2);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
        its(function() {
          return expect(guides[1].length).toBe(1);
        });
        return its(function() {
          return expect(guides[1].point).toEqual(new Point(0, 1));
        });
      });
      describe("small to large", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, 2], []);
        });
        its(function() {
          return expect(guides.length).toBe(2);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
        its(function() {
          return expect(guides[1].length).toBe(2);
        });
        return its(function() {
          return expect(guides[1].point).toEqual(new Point(1, 1));
        });
      });
      return describe("continuous", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(4);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
    });
    return describe("incomplete indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([1, 1.5, 1], []);
      });
      its(function() {
        return expect(guides.length).toBe(1);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      return its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
    });
  });

  describe("uniq", function() {
    its(function() {
      return expect(uniq([1, 1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
    });
    its(function() {
      return expect(uniq([1, 1, 2])).toEqual([1, 2]);
    });
    its(function() {
      return expect(uniq([1, 2])).toEqual([1, 2]);
    });
    its(function() {
      return expect(uniq([1, 1])).toEqual([1]);
    });
    its(function() {
      return expect(uniq([1])).toEqual([1]);
    });
    return its(function() {
      return expect(uniq([])).toEqual([]);
    });
  });

  describe("statesAboveVisible", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = statesAboveVisible;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("only stack", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("active and stack", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("cursor on null row", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, null, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("continuous nulls", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, null, null, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1, 2]);
      });
      return its(function() {
        return expect(guides.active).toEqual([2]);
      });
    });
    describe("no effect", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 0, 1, 3];
        return guides = run([2], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows", function() {
      beforeEach(function() {
        rowIndents = [];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows above", function() {
      beforeEach(function() {
        rowIndents = [0];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("multiple cursors", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([2, 3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("multiple cursors 2", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([1, 2], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([0, 1]);
      });
    });
    return describe("multiple cursors on the same level", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([2, 4], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
  });

  describe("statesBelowVisible", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = statesBelowVisible;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("only stack", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("active and stack", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 2, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("cursor on null row", function() {
      beforeEach(function() {
        rowIndents = [3, 2, null, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("continuous nulls", function() {
      beforeEach(function() {
        rowIndents = [3, null, null, 2];
        return guides = run([1], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("no effect", function() {
      beforeEach(function() {
        rowIndents = [3, 0, 1, 0];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows", function() {
      beforeEach(function() {
        rowIndents = [];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows below", function() {
      beforeEach(function() {
        rowIndents = [0];
        return guides = run([], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("multiple cursors", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([2, 3], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("multiple cursors 2", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([3, 4], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([0, 1]);
      });
    });
    return describe("multiple cursors on the same level", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([1, 3], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
  });

  describe("getGuides", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = getGuides;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("typical", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 3, 0, 1, 2, 0, 1, 1, 0];
        return guides = run(3, 9, getLastRow(), [2, 6, 10], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(6);
      });
      its(function() {
        return expect(guides[0].length).toBe(2);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      its(function() {
        return expect(guides[1].stack).toBe(true);
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      its(function() {
        return expect(guides[2].point).toEqual(new Point(1, 2));
      });
      its(function() {
        return expect(guides[2].active).toBe(false);
      });
      its(function() {
        return expect(guides[2].stack).toBe(false);
      });
      its(function() {
        return expect(guides[3].length).toBe(2);
      });
      its(function() {
        return expect(guides[3].point).toEqual(new Point(3, 0));
      });
      its(function() {
        return expect(guides[3].active).toBe(true);
      });
      its(function() {
        return expect(guides[3].stack).toBe(true);
      });
      its(function() {
        return expect(guides[4].length).toBe(1);
      });
      its(function() {
        return expect(guides[4].point).toEqual(new Point(4, 1));
      });
      its(function() {
        return expect(guides[4].active).toBe(false);
      });
      its(function() {
        return expect(guides[4].stack).toBe(false);
      });
      its(function() {
        return expect(guides[5].length).toBe(1);
      });
      its(function() {
        return expect(guides[5].point).toEqual(new Point(6, 0));
      });
      its(function() {
        return expect(guides[5].active).toBe(true);
      });
      return its(function() {
        return expect(guides[5].stack).toBe(true);
      });
    });
    describe("when last line is null", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, 2, 0];
        return guides = run(3, 5, getLastRow(), [6], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(4);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(4);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(true);
      });
    });
    describe("when last line is null and the following line is also null", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, null, 2, 0];
        return guides = run(3, 5, getLastRow(), [7], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(5);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(5);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(true);
      });
    });
    return describe("when last line is null and the cursor doesnt follow", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, null, 2, 1, 0];
        return guides = run(3, 5, getLastRow(), [8], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(5);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(true);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(5);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(false);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL3NwZWMvZ3VpZGVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVGQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxlQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNDLGNBQUEsUUFBRCxFQUFXLFVBQUEsSUFBWCxFQUFpQix3QkFBQSxrQkFBakIsRUFBcUMsd0JBQUEsa0JBQXJDLEVBQXlELGVBQUEsU0FEekQsQ0FBQTs7QUFBQSxFQUVDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUZELENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sU0FBQyxDQUFELEdBQUE7V0FDSixFQUFBLENBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBQSxDQUFILEVBQWlCLENBQWpCLEVBREk7RUFBQSxDQUxOLENBQUE7O0FBQUEsRUFRQSxJQUFBLEdBQU8sU0FBQyxDQUFELEdBQUE7V0FDTCxHQUFBLENBQUksQ0FBQyxDQUFDLFFBQUYsQ0FBQSxDQUFKLEVBQWtCLENBQWxCLEVBREs7RUFBQSxDQVJQLENBQUE7O0FBQUEsRUFXQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsSUFDQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULE1BQUEsR0FBUyxRQUFBLENBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFULEVBQW1DLEVBQW5DLEVBREE7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

//# sourceURL=/home/alenz/.atom/packages/indent-guide-improved/spec/guides-spec.coffee
