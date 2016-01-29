(function() {
  describe("Python grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-python");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.python");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeDefined();
      return expect(grammar.scopeName).toBe("source.python");
    });
    it("tokenizes multi-line strings", function() {
      var tokens;
      tokens = grammar.tokenizeLines('"1\\\n2"');
      expect(tokens[0][0].value).toBe('"');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.double.single-line.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][1].value).toBe('1');
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.double.single-line.python']);
      expect(tokens[0][2].value).toBe('\\');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.double.single-line.python', 'constant.character.escape.newline.python']);
      expect(tokens[0][3]).not.toBeDefined();
      expect(tokens[1][0].value).toBe('2');
      expect(tokens[1][0].scopes).toEqual(['source.python', 'string.quoted.double.single-line.python']);
      expect(tokens[1][1].value).toBe('"');
      expect(tokens[1][1].scopes).toEqual(['source.python', 'string.quoted.double.single-line.python', 'punctuation.definition.string.end.python']);
      return expect(tokens[1][2]).not.toBeDefined();
    });
    it("terminates a single-quoted raw string containing opening parenthesis at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines("r'%d(' #foo");
      expect(tokens[0][0].value).toBe('r');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe("'");
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('(');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'meta.group.regexp', 'punctuation.definition.group.regexp']);
      expect(tokens[0][4].value).toBe("'");
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a single-quoted raw string containing opening bracket at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines("r'%d[' #foo");
      expect(tokens[0][0].value).toBe('r');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe("'");
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('[');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'constant.other.character-class.set.regexp', 'punctuation.definition.character-class.regexp']);
      expect(tokens[0][4].value).toBe("'");
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.single.single-line.raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a double-quoted raw string containing opening parenthesis at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines('r"%d(" #foo');
      expect(tokens[0][0].value).toBe('r');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe('"');
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('(');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'meta.group.regexp', 'punctuation.definition.group.regexp']);
      expect(tokens[0][4].value).toBe('"');
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a double-quoted raw string containing opening bracket at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines('r"%d[" #foo');
      expect(tokens[0][0].value).toBe('r');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe('"');
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('[');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'constant.other.character-class.set.regexp', 'punctuation.definition.character-class.regexp']);
      expect(tokens[0][4].value).toBe('"');
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.double.single-line.raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a unicode single-quoted raw string containing opening parenthesis at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines("ur'%d(' #foo");
      expect(tokens[0][0].value).toBe('ur');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe("'");
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('(');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'meta.group.regexp', 'punctuation.definition.group.regexp']);
      expect(tokens[0][4].value).toBe("'");
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a unicode single-quoted raw string containing opening bracket at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines("ur'%d[' #foo");
      expect(tokens[0][0].value).toBe('ur');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe("'");
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('[');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'constant.other.character-class.set.regexp', 'punctuation.definition.character-class.regexp']);
      expect(tokens[0][4].value).toBe("'");
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.single.single-line.unicode-raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a unicode double-quoted raw string containing opening parenthesis at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines('ur"%d(" #foo');
      expect(tokens[0][0].value).toBe('ur');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe('"');
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('(');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'meta.group.regexp', 'punctuation.definition.group.regexp']);
      expect(tokens[0][4].value).toBe('"');
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates a unicode double-quoted raw string containing opening bracket at closing quote", function() {
      var tokens;
      tokens = grammar.tokenizeLines('ur"%d[" #foo');
      expect(tokens[0][0].value).toBe('ur');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'storage.type.string.python']);
      expect(tokens[0][1].value).toBe('"');
      expect(tokens[0][1].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'punctuation.definition.string.begin.python']);
      expect(tokens[0][2].value).toBe('%d');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'constant.other.placeholder.python']);
      expect(tokens[0][3].value).toBe('[');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'constant.other.character-class.set.regexp', 'punctuation.definition.character-class.regexp']);
      expect(tokens[0][4].value).toBe('"');
      expect(tokens[0][4].scopes).toEqual(['source.python', 'string.quoted.double.single-line.unicode-raw-regex.python', 'punctuation.definition.string.end.python']);
      expect(tokens[0][5].value).toBe(' ');
      expect(tokens[0][5].scopes).toEqual(['source.python']);
      expect(tokens[0][6].value).toBe('#');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']);
      expect(tokens[0][7].value).toBe('foo');
      return expect(tokens[0][7].scopes).toEqual(['source.python', 'comment.line.number-sign.python']);
    });
    it("terminates referencing an item in a list variable after a sequence of a closing and opening bracket", function() {
      var tokens;
      tokens = grammar.tokenizeLines('foo[i[0]][j[0]]');
      expect(tokens[0][0].value).toBe('foo');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'meta.item-access.python']);
      expect(tokens[0][1].value).toBe('[');
      expect(tokens[0][1].scopes).toEqual(['source.python', 'meta.item-access.python', 'punctuation.definition.arguments.begin.python']);
      expect(tokens[0][2].value).toBe('i');
      expect(tokens[0][2].scopes).toEqual(['source.python', 'meta.item-access.python', 'meta.item-access.arguments.python', 'meta.item-access.python']);
      expect(tokens[0][3].value).toBe('[');
      expect(tokens[0][3].scopes).toEqual(['source.python', 'meta.item-access.python', 'meta.item-access.arguments.python', 'meta.item-access.python', 'punctuation.definition.arguments.begin.python']);
      expect(tokens[0][4].value).toBe('0');
      expect(tokens[0][4].scopes).toEqual(['source.python', 'meta.item-access.python', 'meta.item-access.arguments.python', 'meta.item-access.python', 'meta.item-access.arguments.python', 'constant.numeric.integer.decimal.python']);
      expect(tokens[0][5].value).toBe(']');
      expect(tokens[0][5].scopes).toEqual(['source.python', 'meta.item-access.python', 'meta.item-access.arguments.python', 'meta.item-access.python', 'punctuation.definition.arguments.end.python']);
      expect(tokens[0][6].value).toBe(']');
      expect(tokens[0][6].scopes).toEqual(['source.python', 'meta.item-access.python', 'punctuation.definition.arguments.end.python']);
      expect(tokens[0][7].value).toBe('[');
      expect(tokens[0][7].scopes).toEqual(['source.python', 'meta.structure.list.python', 'punctuation.definition.list.begin.python']);
      expect(tokens[0][8].value).toBe('j');
      expect(tokens[0][8].scopes).toEqual(['source.python', 'meta.structure.list.python', 'meta.structure.list.item.python', 'meta.item-access.python']);
      expect(tokens[0][9].value).toBe('[');
      expect(tokens[0][9].scopes).toEqual(['source.python', 'meta.structure.list.python', 'meta.structure.list.item.python', 'meta.item-access.python', 'punctuation.definition.arguments.begin.python']);
      expect(tokens[0][10].value).toBe('0');
      expect(tokens[0][10].scopes).toEqual(['source.python', 'meta.structure.list.python', 'meta.structure.list.item.python', 'meta.item-access.python', 'meta.item-access.arguments.python', 'constant.numeric.integer.decimal.python']);
      expect(tokens[0][11].value).toBe(']');
      expect(tokens[0][11].scopes).toEqual(['source.python', 'meta.structure.list.python', 'meta.structure.list.item.python', 'meta.item-access.python', 'punctuation.definition.arguments.end.python']);
      expect(tokens[0][12].value).toBe(']');
      return expect(tokens[0][12].scopes).toEqual(['source.python', 'meta.structure.list.python', 'punctuation.definition.list.end.python']);
    });
    it("tokenizes properties of self as variables", function() {
      var tokens;
      tokens = grammar.tokenizeLines('self.foo');
      expect(tokens[0][0].value).toBe('self');
      expect(tokens[0][0].scopes).toEqual(['source.python', 'variable.language.python']);
      expect(tokens[0][1].value).toBe('.');
      expect(tokens[0][1].scopes).toEqual(['source.python']);
      expect(tokens[0][2].value).toBe('foo');
      return expect(tokens[0][2].scopes).toEqual(['source.python']);
    });
    it("tokenizes properties of a variable as variables", function() {
      var tokens;
      tokens = grammar.tokenizeLines('bar.foo');
      expect(tokens[0][0].value).toBe('bar');
      expect(tokens[0][0].scopes).toEqual(['source.python']);
      expect(tokens[0][1].value).toBe('.');
      expect(tokens[0][1].scopes).toEqual(['source.python']);
      expect(tokens[0][2].value).toBe('foo');
      return expect(tokens[0][2].scopes).toEqual(['source.python']);
    });
    it("tokenizes comments inside function parameters", function() {
      var tokens;
      tokens = grammar.tokenizeLine('def test(arg, # comment').tokens;
      expect(tokens[0]).toEqual({
        value: 'def',
        scopes: ['source.python', 'meta.function.python', 'storage.type.function.python']
      });
      expect(tokens[2]).toEqual({
        value: 'test',
        scopes: ['source.python', 'meta.function.python', 'entity.name.function.python']
      });
      expect(tokens[3]).toEqual({
        value: '(',
        scopes: ['source.python', 'meta.function.python', 'punctuation.definition.parameters.begin.python']
      });
      expect(tokens[4]).toEqual({
        value: 'arg',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'variable.parameter.function.python']
      });
      expect(tokens[5]).toEqual({
        value: ',',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'punctuation.separator.parameters.python']
      });
      expect(tokens[7]).toEqual({
        value: '#',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']
      });
      expect(tokens[8]).toEqual({
        value: ' comment',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'comment.line.number-sign.python']
      });
      tokens = grammar.tokenizeLines("def __init__(\n  self,\n  codec, # comment\n  config\n):");
      expect(tokens[0][0]).toEqual({
        value: 'def',
        scopes: ['source.python', 'meta.function.python', 'storage.type.function.python']
      });
      expect(tokens[0][2]).toEqual({
        value: '__init__',
        scopes: ['source.python', 'meta.function.python', 'entity.name.function.python', 'support.function.magic.python']
      });
      expect(tokens[0][3]).toEqual({
        value: '(',
        scopes: ['source.python', 'meta.function.python', 'punctuation.definition.parameters.begin.python']
      });
      expect(tokens[1][1]).toEqual({
        value: 'self',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'variable.parameter.function.python']
      });
      expect(tokens[1][2]).toEqual({
        value: ',',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'punctuation.separator.parameters.python']
      });
      expect(tokens[2][1]).toEqual({
        value: 'codec',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'variable.parameter.function.python']
      });
      expect(tokens[2][2]).toEqual({
        value: ',',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'punctuation.separator.parameters.python']
      });
      expect(tokens[2][4]).toEqual({
        value: '#',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'comment.line.number-sign.python', 'punctuation.definition.comment.python']
      });
      expect(tokens[2][5]).toEqual({
        value: ' comment',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'comment.line.number-sign.python']
      });
      expect(tokens[3][1]).toEqual({
        value: 'config',
        scopes: ['source.python', 'meta.function.python', 'meta.function.parameters.python', 'variable.parameter.function.python']
      });
      expect(tokens[4][0]).toEqual({
        value: ')',
        scopes: ['source.python', 'meta.function.python', 'punctuation.definition.parameters.end.python']
      });
      return expect(tokens[4][1]).toEqual({
        value: ':',
        scopes: ['source.python', 'meta.function.python', 'punctuation.section.function.begin.python']
      });
    });
    it("tokenizes SQL inline highlighting on blocks", function() {
      var delim, delimsByScope, scope, tokens, _i, _len, _results;
      delimsByScope = {
        "string.quoted.double.block.sql.python": '"""',
        "string.quoted.single.block.sql.python": "'''"
      };
      _results = [];
      for (delim = _i = 0, _len = delimsByScope.length; _i < _len; delim = ++_i) {
        scope = delimsByScope[delim];
        tokens = grammar.tokenizeLines(delim + 'SELECT bar FROM foo', +delim);
        expect(tokens[0][0]).toEqual({
          value: delim,
          scopes: ['source.python', scope, 'punctuation.definition.string.begin.python']
        });
        expect(tokens[1][0]).toEqual({
          value: 'SELECT bar',
          scopes: ['source.python', scope]
        });
        expect(tokens[2][0]).toEqual({
          value: 'FROM foo',
          scopes: ['source.python', scope]
        });
        _results.push(expect(tokens[3][0]).toEqual({
          value: delim,
          scopes: ['source.python', scope, 'punctuation.definition.string.end.python']
        }));
      }
      return _results;
    });
    it("tokenizes SQL inline highlighting on blocks with a CTE", function() {
      var delim, delimsByScope, scope, tokens, _results;
      delimsByScope = {
        "string.quoted.double.block.sql.python": '"""',
        "string.quoted.single.block.sql.python": "'''"
      };
      _results = [];
      for (scope in delimsByScope) {
        delim = delimsByScope[scope];
        tokens = grammar.tokenizeLines("" + delim + "\nWITH example_cte AS (\nSELECT bar\nFROM foo\nGROUP BY bar\n)\n\nSELECT COUNT(*)\nFROM example_cte\n" + delim);
        expect(tokens[0][0]).toEqual({
          value: delim,
          scopes: ['source.python', scope, 'punctuation.definition.string.begin.python']
        });
        expect(tokens[1][0]).toEqual({
          value: 'WITH example_cte AS (',
          scopes: ['source.python', scope]
        });
        expect(tokens[2][0]).toEqual({
          value: 'SELECT bar',
          scopes: ['source.python', scope]
        });
        expect(tokens[3][0]).toEqual({
          value: 'FROM foo',
          scopes: ['source.python', scope]
        });
        expect(tokens[4][0]).toEqual({
          value: 'GROUP BY bar',
          scopes: ['source.python', scope]
        });
        expect(tokens[5][0]).toEqual({
          value: ')',
          scopes: ['source.python', scope]
        });
        expect(tokens[6][0]).toEqual({
          value: '',
          scopes: ['source.python', scope]
        });
        expect(tokens[7][0]).toEqual({
          value: 'SELECT COUNT(*)',
          scopes: ['source.python', scope]
        });
        expect(tokens[8][0]).toEqual({
          value: 'FROM example_cte',
          scopes: ['source.python', scope]
        });
        _results.push(expect(tokens[9][0]).toEqual({
          value: delim,
          scopes: ['source.python', scope, 'punctuation.definition.string.end.python']
        }));
      }
      return _results;
    });
    return it("tokenizes SQL inline highlighting on single line with a CTE", function() {
      var tokens;
      tokens = grammar.tokenizeLine('\'WITH example_cte AS (SELECT bar FROM foo) SELECT COUNT(*) FROM example_cte\'').tokens;
      expect(tokens[0]).toEqual({
        value: '\'',
        scopes: ['source.python', 'string.quoted.single.single-line.python', 'punctuation.definition.string.begin.python']
      });
      expect(tokens[1]).toEqual({
        value: 'WITH example_cte AS (SELECT bar FROM foo) SELECT COUNT(*) FROM example_cte',
        scopes: ['source.python', 'string.quoted.single.single-line.python']
      });
      return expect(tokens[2]).toEqual({
        value: '\'',
        scopes: ['source.python', 'string.quoted.single.single-line.python', 'punctuation.definition.string.end.python']
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtcHl0aG9uL3NwZWMvcHl0aG9uLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixpQkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTthQUdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQyxFQURQO01BQUEsQ0FBTCxFQUpTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVNBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsV0FBaEIsQ0FBQSxDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQWYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixlQUEvQixFQUZ1QjtJQUFBLENBQXpCLENBVEEsQ0FBQTtBQUFBLElBYUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsYUFBUixDQUFzQixVQUF0QixDQUFULENBQUE7QUFBQSxNQUdBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQUhBLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IseUNBQWxCLEVBQTZELDRDQUE3RCxDQUFwQyxDQUpBLENBQUE7QUFBQSxNQU1BLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQU5BLENBQUE7QUFBQSxNQU9BLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IseUNBQWxCLENBQXBDLENBUEEsQ0FBQTtBQUFBLE1BU0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLElBQWhDLENBVEEsQ0FBQTtBQUFBLE1BVUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQix5Q0FBbEIsRUFBNkQsMENBQTdELENBQXBDLENBVkEsQ0FBQTtBQUFBLE1BWUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQWpCLENBQW9CLENBQUMsR0FBRyxDQUFDLFdBQXpCLENBQUEsQ0FaQSxDQUFBO0FBQUEsTUFlQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQXBCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsR0FBaEMsQ0FmQSxDQUFBO0FBQUEsTUFnQkEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQix5Q0FBbEIsQ0FBcEMsQ0FoQkEsQ0FBQTtBQUFBLE1Ba0JBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQWxCQSxDQUFBO0FBQUEsTUFtQkEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQix5Q0FBbEIsRUFBNkQsMENBQTdELENBQXBDLENBbkJBLENBQUE7YUFxQkEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQWpCLENBQW9CLENBQUMsR0FBRyxDQUFDLFdBQXpCLENBQUEsRUF0QmlDO0lBQUEsQ0FBbkMsQ0FiQSxDQUFBO0FBQUEsSUFxQ0EsRUFBQSxDQUFHLHVGQUFILEVBQTRGLFNBQUEsR0FBQTtBQUMxRixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsYUFBUixDQUFzQixhQUF0QixDQUFULENBQUE7QUFBQSxNQUVBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQUZBLENBQUE7QUFBQSxNQUdBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IsbURBQWxCLEVBQXVFLDRCQUF2RSxDQUFwQyxDQUhBLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQUpBLENBQUE7QUFBQSxNQUtBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IsbURBQWxCLEVBQXVFLDRDQUF2RSxDQUFwQyxDQUxBLENBQUE7QUFBQSxNQU1BLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxJQUFoQyxDQU5BLENBQUE7QUFBQSxNQU9BLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IsbURBQWxCLEVBQXVFLG1DQUF2RSxDQUFwQyxDQVBBLENBQUE7QUFBQSxNQVFBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxHQUFoQyxDQVJBLENBQUE7QUFBQSxNQVNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IsbURBQWxCLEVBQXVFLG1CQUF2RSxFQUE0RixxQ0FBNUYsQ0FBcEMsQ0FUQSxDQUFBO0FBQUEsTUFVQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQXBCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsR0FBaEMsQ0FWQSxDQUFBO0FBQUEsTUFXQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXBCLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsQ0FBQyxlQUFELEVBQWtCLG1EQUFsQixFQUF1RSwwQ0FBdkUsQ0FBcEMsQ0FYQSxDQUFBO0FBQUEsTUFZQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQXBCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsR0FBaEMsQ0FaQSxDQUFBO0FBQUEsTUFhQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXBCLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsQ0FBQyxlQUFELENBQXBDLENBYkEsQ0FBQTtBQUFBLE1BY0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLEdBQWhDLENBZEEsQ0FBQTtBQUFBLE1BZUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQixpQ0FBbEIsRUFBcUQsdUNBQXJELENBQXBDLENBZkEsQ0FBQTtBQUFBLE1BZ0JBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxLQUFoQyxDQWhCQSxDQUFBO2FBaUJBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxDQUFDLGVBQUQsRUFBa0IsaUNBQWxCLENBQXBDLEVBbEIwRjtJQUFBLENBQTVGLENBckNBLENBQUE7QUFBQSxJQXlEQSxFQUFBLENBQUcsbUZBQUgsRUFBd0YsU0FBQSxHQUFBO0FBQ3RGLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxhQUFSLENBQXNCLGFBQXRCLENBQVQsQ0FBQTtBQUFBLE1BRUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLEdBQWhDLENBRkEsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQixtREFBbEIsRUFBdUUsNEJBQXZFLENBQXBDLENBSEEsQ0FBQTtBQUFBLE1BSUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLEdBQWhDLENBSkEsQ0FBQTtBQUFBLE1BS0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQixtREFBbEIsRUFBdUUsNENBQXZFLENBQXBDLENBTEEsQ0FBQTtBQUFBLE1BTUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLElBQWhDLENBTkEsQ0FBQTtBQUFBLE1BT0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQixtREFBbEIsRUFBdUUsbUNBQXZFLENBQXBDLENBUEEsQ0FBQTtBQUFBLE1BUUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQWdDLEdBQWhDLENBUkEsQ0FBQTtBQUFBLE1BU0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFwQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLENBQUMsZUFBRCxFQUFrQixtREFBbEIsRUFBdUUsMkNBQXZFLEVBQW9I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

//# sourceURL=/home/alenz/.atom/packages/language-python/spec/python-spec.coffee
