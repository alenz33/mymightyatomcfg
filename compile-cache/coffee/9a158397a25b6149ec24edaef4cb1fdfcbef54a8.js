(function() {
  var Choice, Comment, Diagram, Group, NonTerminal, OneOrMore, Optional, Sequence, Skip, Terminal, ZeroOrMore, doSpace, makeLiteral, parse, parseRegex, quantifiedComment, rx2rr, _ref;

  parse = require("regexp");

  _ref = require('./railroad-diagrams'), Diagram = _ref.Diagram, Sequence = _ref.Sequence, Choice = _ref.Choice, Optional = _ref.Optional, OneOrMore = _ref.OneOrMore, ZeroOrMore = _ref.ZeroOrMore, Terminal = _ref.Terminal, NonTerminal = _ref.NonTerminal, Comment = _ref.Comment, Skip = _ref.Skip, Group = _ref.Group;

  doSpace = function() {
    return NonTerminal("SP", {
      title: "Space character",
      "class": "literal whitespace"
    });
  };

  makeLiteral = function(text) {
    var part, parts, sequence, _i, _len;
    if (text === " ") {
      return doSpace();
    } else {
      parts = text.split(/(^ +| {2,}| +$)/);
      sequence = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        if (!part.length) {
          continue;
        }
        if (/^ +$/.test(part)) {
          if (part.length === 1) {
            sequence.push(doSpace());
          } else {
            sequence.push(OneOrMore(doSpace(), Comment("" + part.length + "x", {
              title: "repeat " + part.length + " times"
            })));
          }
        } else {
          sequence.push(Terminal(part, {
            "class": "literal"
          }));
        }
      }
      if (sequence.length === 1) {
        return sequence[0];
      } else {
        return new Sequence(sequence);
      }
    }
  };

  rx2rr = function(node, options) {
    var alternatives, body, char, charset, doEndOfString, doStartOfString, extra, greedy, i, isSingleString, list, literal, max, min, n, opts, plural, sequence, x, _i, _j, _len, _len1, _ref1, _ref2;
    opts = options.options;
    isSingleString = function() {
      return opts.match(/s/);
    };
    doStartOfString = function() {
      var title;
      if (opts.match(/m/)) {
        title = "Beginning of line";
      } else {
        title = "Beginning of string";
      }
      return NonTerminal("START", {
        title: title,
        "class": 'zero-width-assertion'
      });
    };
    doEndOfString = function() {
      var title;
      if (opts.match(/m/)) {
        title = "End of line";
      } else {
        title = "End of string";
      }
      return NonTerminal("END", {
        title: title,
        "class": 'zero-width-assertion'
      });
    };
    switch (node.type) {
      case "match":
        literal = '';
        sequence = [];
        _ref1 = node.body;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          n = _ref1[_i];
          if (n.type === "literal" && n.escaped) {
            if (n.body === "A") {
              sequence.push(doStartOfString());
            } else if (n.body === "Z") {
              sequence.push(doEndOfString());
            } else {
              literal += n.body;
            }
          } else if (n.type === "literal") {
            literal += n.body;
          } else {
            if (literal) {
              sequence.push(makeLiteral(literal));
              literal = '';
            }
            sequence.push(rx2rr(n, options));
          }
        }
        if (literal) {
          sequence.push(makeLiteral(literal));
        }
        if (sequence.length === 1) {
          return sequence[0];
        } else {
          return new Sequence(sequence);
        }
        break;
      case "alternate":
        alternatives = [];
        while (node.type === "alternate") {
          alternatives.push(rx2rr(node.left, options));
          node = node.right;
        }
        alternatives.push(rx2rr(node, options));
        return new Choice(Math.floor(alternatives.length / 2) - 1, alternatives);
      case "quantified":
        _ref2 = node.quantifier, min = _ref2.min, max = _ref2.max, greedy = _ref2.greedy;
        body = rx2rr(node.body, options);
        if (!(min <= max)) {
          throw new Error("Minimum quantifier (" + min + ") must be lower than ", +("maximum quantifier (" + max + ")"));
        }
        plural = function(x) {
          if (x !== 1) {
            return "s";
          } else {
            return "";
          }
        };
        switch (min) {
          case 0:
            if (max === 1) {
              return Optional(body);
            } else {
              if (max === 0) {
                return ZeroOrMore(body, quantifiedComment("0x", greedy, {
                  title: "exact 0 times repitition does not make sense"
                }));
              } else if (max !== Infinity) {
                return ZeroOrMore(body, quantifiedComment("0-" + max + "x", greedy, {
                  title: ("repeat 0 to " + max + " time") + plural(max)
                }));
              } else {
                return ZeroOrMore(body, quantifiedComment("*", greedy, {
                  title: "repeat zero or more times"
                }));
              }
            }
            break;
          case 1:
            if (max === 1) {
              return OneOrMore(body, Comment("1", {
                title: "once"
              }));
            } else if (max !== Infinity) {
              return OneOrMore(body, quantifiedComment("1-" + max + "x", greedy, {
                title: "repeat 1 to " + max + " times"
              }));
            } else {
              return OneOrMore(body, quantifiedComment("+", greedy, {
                title: "repeat at least one time"
              }));
            }
            break;
          default:
            if (max === min) {
              return OneOrMore(body, Comment("" + max + "x", {
                title: "repeat " + max + " times"
              }));
            } else if (max !== Infinity) {
              return OneOrMore(body, quantifiedComment("" + min + "-" + max + "x", greedy, {
                title: "repeat " + min + " to " + max + " times"
              }));
            } else {
              return OneOrMore(body, quantifiedComment(">= " + min + "x", greedy, {
                title: ("repeat at least " + min + " time") + plural(min)
              }));
            }
        }
        break;
      case "capture-group":
        return Group(rx2rr(node.body, options), Comment("capture " + node.index, {
          "class": "caption"
        }), {
          minWidth: 55,
          attrs: {
            "class": 'capture-group group'
          }
        });
      case "non-capture-group":
        return rx2rr(node.body, options);
      case "positive-lookahead":
        return Group(rx2rr(node.body, options), Comment("=> ?", {
          title: "Positive lookahead",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookahead positive zero-width-assertion group"
          }
        });
      case "negative-lookahead":
        return Group(rx2rr(node.body, options), Comment("!> ?", {
          title: "Negative lookahead",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookahead negative zero-width-assertion group"
          }
        });
      case "positive-lookbehind":
        return Group(rx2rr(node.body, options), Comment("<= ?", {
          title: "Positive lookbehind",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookbehind positive zero-width-assertion group"
          }
        });
      case "negative-lookbehind":
        return Group(rx2rr(node.body, options), Comment("<! ?", {
          title: "Negative lookbehind",
          "class": "caption"
        }), {
          attrs: {
            "class": "lookbehind negative zero-width-assertion group"
          }
        });
      case "back-reference":
        return NonTerminal("" + node.code, {
          title: "Match capture " + node.code + " (Back Reference)",
          "class": 'back-reference'
        });
      case "literal":
        if (node.escaped) {
          if (node.body === "A") {
            return doStartOfString();
          } else if (node.body === "Z") {
            return doEndOfString();
          } else {
            return Terminal(node.body, {
              "class": "literal"
            });
          }
        } else {
          return makeLiteral(node.body);
        }
        break;
      case "start":
        return doStartOfString();
      case "end":
        return doEndOfString();
      case "word":
        return NonTerminal("WORD", {
          title: "Word character A-Z, 0-9, _",
          "class": 'character-class'
        });
      case "non-word":
        return NonTerminal("NON-WORD", {
          title: "Non-word character, all except A-Z, 0-9, _",
          "class": 'character-class invert'
        });
      case "line-feed":
        return NonTerminal("LF", {
          title: "Line feed '\\n'",
          "class": 'literal whitespace'
        });
      case "carriage-return":
        return NonTerminal("CR", {
          title: "Carriage Return '\\r'",
          "class": 'literal whitespace'
        });
      case "vertical-tab":
        return NonTerminal("VTAB", {
          title: "Vertical tab '\\v'",
          "class": 'literal whitespace'
        });
      case "tab":
        return NonTerminal("TAB", {
          title: "Tab stop '\\t'",
          "class": 'literal whitespace'
        });
      case "form-feed":
        return NonTerminal("FF", {
          title: "Form feed",
          "class": 'literal whitespace'
        });
      case "back-space":
        return NonTerminal("BS", {
          title: "Backspace",
          "class": 'literal'
        });
      case "digit":
        return NonTerminal("0-9", {
          "class": 'character-class'
        });
      case "null-character":
        return NonTerminal("NULL", {
          title: "Null character '\\0'",
          "class": 'literal'
        });
      case "non-digit":
        return NonTerminal("not 0-9", {
          title: "All except digits",
          "class": 'character-class invert'
        });
      case "white-space":
        return NonTerminal("WS", {
          title: "Whitespace: space, tabstop, linefeed, carriage-return, etc.",
          "class": 'character-class whitespace'
        });
      case "non-white-space":
        return NonTerminal("NON-WS", {
          title: "Not whitespace: all except space, tabstop, line-feed, carriage-return, etc.",
          "class": 'character-class invert'
        });
      case "range":
        return NonTerminal(node.text, {
          "class": "character-class"
        });
      case "charset":
        charset = (function() {
          var _j, _len1, _ref3, _results;
          _ref3 = node.body;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            x = _ref3[_j];
            _results.push(x.text);
          }
          return _results;
        })();
        if (charset.length === 1) {
          char = charset[0];
          if (char === " ") {
            if (node.invert) {
              return doSpace();
            }
          }
          if (node.invert) {
            return NonTerminal("not " + char, {
              title: "Match all except " + char,
              "class": 'character-class invert'
            });
          } else {
            if (char === "SP") {
              return doSpace();
            } else {
              return Terminal(char, {
                "class": "literal"
              });
            }
          }
        } else {
          list = charset.slice(0, -1).join(", ");
          for (i = _j = 0, _len1 = list.length; _j < _len1; i = ++_j) {
            x = list[i];
            if (x === " ") {
              list[i] = "SP";
            }
          }
          if (node.invert) {
            return NonTerminal("not " + list + " and " + charset.slice(-1), {
              "class": 'character-class invert'
            });
          } else {
            return NonTerminal("" + list + " or " + charset.slice(-1), {
              "class": 'character-class'
            });
          }
        }
        break;
      case "hex":
      case "octal":
      case "unicode":
        return Terminal(node.text, {
          "class": 'literal charachter-code'
        });
      case "any-character":
        extra = !isSingleString() ? " except newline" : "";
        return NonTerminal("ANY", {
          title: "Any character" + extra,
          "class": 'character-class'
        });
      case "word-boundary":
        return NonTerminal("WB", {
          title: "Word-boundary",
          "class": 'zero-width-assertion'
        });
      case "non-word-boundary":
        return NonTerminal("NON-WB", {
          title: "Non-word-boundary (match if in a word)",
          "class": 'zero-width-assertion invert'
        });
      default:
        return NonTerminal(node.type);
    }
  };

  quantifiedComment = function(comment, greedy, attrs) {
    if (comment && greedy) {
      attrs.title += ', longest possible match';
      attrs["class"] = 'quantified greedy';
      return Comment(comment + ' (greedy)', attrs);
    } else if (greedy) {
      attrs.title = 'longest possible match';
      attrs["class"] = 'quantified greedy';
      return Comment('greedy', attrs);
    } else if (comment) {
      attrs.title += ', shortest possible match';
      attrs["class"] = 'quantified lazy';
      return Comment(comment + ' (lazy)', attrs);
    } else {
      attrs.title = 'shortest possible match';
      attrs["class"] = 'quantified lazy';
      return Comment('lazy', attrs);
    }
  };

  parseRegex = function(regex) {
    if (regex instanceof RegExp) {
      regex = regex.source;
    }
    return parse(regex);
  };

  module.exports = {
    Regex2RailRoadDiagram: function(regex, parent, opts) {
      return Diagram(rx2rr(parseRegex(regex), opts)).addTo(parent);
    },
    ParseRegex: parseRegex
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcmVnZXgtcmFpbHJvYWQtZGlhZ3JhbS9saWIvcmVnZXgtdG8tcmFpbHJvYWQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdMQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxRQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUVBLE9BQ3VDLE9BQUEsQ0FBUSxxQkFBUixDQUR2QyxFQUFDLGVBQUEsT0FBRCxFQUFVLGdCQUFBLFFBQVYsRUFBb0IsY0FBQSxNQUFwQixFQUE0QixnQkFBQSxRQUE1QixFQUFzQyxpQkFBQSxTQUF0QyxFQUFpRCxrQkFBQSxVQUFqRCxFQUE2RCxnQkFBQSxRQUE3RCxFQUNDLG1CQUFBLFdBREQsRUFDYyxlQUFBLE9BRGQsRUFDdUIsWUFBQSxJQUR2QixFQUM2QixhQUFBLEtBSDdCLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsU0FBQSxHQUFBO1dBQUcsV0FBQSxDQUFZLElBQVosRUFBa0I7QUFBQSxNQUFBLEtBQUEsRUFBTyxpQkFBUDtBQUFBLE1BQTBCLE9BQUEsRUFBTyxvQkFBakM7S0FBbEIsRUFBSDtFQUFBLENBTFYsQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUVaLFFBQUEsK0JBQUE7QUFBQSxJQUFBLElBQUcsSUFBQSxLQUFRLEdBQVg7YUFDRSxPQUFBLENBQUEsRUFERjtLQUFBLE1BQUE7QUFHRSxNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLGlCQUFYLENBQVIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLEVBRFgsQ0FBQTtBQUVBLFdBQUEsNENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUEsQ0FBQSxJQUFvQixDQUFDLE1BQXJCO0FBQUEsbUJBQUE7U0FBQTtBQUNBLFFB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

//# sourceURL=/home/alenz/.atom/packages/regex-railroad-diagram/lib/regex-to-railroad.coffee
