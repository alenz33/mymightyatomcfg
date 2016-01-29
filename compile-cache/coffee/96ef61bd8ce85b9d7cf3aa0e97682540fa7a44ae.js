(function() {
  var $, Highlights, cheerio, convertCodeBlocksToAtomEditors, fs, highlighter, packagePath, path, render, resolveImagePaths, resourcePath, roaster, sanitize, scopeForFenceName, tokenizeCodeBlocks, _;

  path = require('path');

  _ = require('underscore-plus');

  cheerio = require('cheerio');

  fs = require('fs-plus');

  Highlights = require('highlights');

  $ = require('atom-space-pen-views').$;

  roaster = null;

  scopeForFenceName = require('./extension-helper').scopeForFenceName;

  highlighter = null;

  resourcePath = atom.getLoadSettings().resourcePath;

  packagePath = path.dirname(__dirname);

  exports.toDOMFragment = function(text, filePath, grammar, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, grammar, function(error, html) {
      var defaultCodeLanguage, domFragment, template;
      if (error != null) {
        return callback(error);
      }
      template = document.createElement('template');
      template.innerHTML = html;
      domFragment = template.content.cloneNode(true);
      if ((grammar != null ? grammar.scopeName : void 0) === 'source.litcoffee') {
        defaultCodeLanguage = 'coffee';
      }
      convertCodeBlocksToAtomEditors(domFragment, defaultCodeLanguage);
      return callback(null, domFragment);
    });
  };

  exports.toHTML = function(text, filePath, grammar, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, grammar, function(error, html) {
      var defaultCodeLanguage;
      if (error != null) {
        return callback(error);
      }
      if ((grammar != null ? grammar.scopeName : void 0) === 'source.litcoffee') {
        defaultCodeLanguage = 'coffee';
      }
      html = tokenizeCodeBlocks(html, defaultCodeLanguage);
      return callback(null, html);
    });
  };

  render = function(text, filePath, grammar, callback) {
    var options;
    if (roaster == null) {
      roaster = require('roaster');
    }
    options = {
      sanitize: false,
      breaks: atom.config.get('rst-preview.breakOnSingleNewline')
    };
    text = text.replace(/^\s*<!doctype(\s+.*)?>\s*/i, '');
    return roaster(text, options, (function(_this) {
      return function(error, html) {
        if (error) {
          return callback(error);
        }
        html = sanitize(html);
        html = resolveImagePaths(html, filePath);
        return callback(null, html.trim());
      };
    })(this));
  };

  sanitize = function(html) {
    var attribute, attributesToRemove, o, _i, _len;
    o = cheerio.load(html);
    o('script').remove();
    attributesToRemove = ['onabort', 'onblur', 'onchange', 'onclick', 'ondbclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onreset', 'onresize', 'onscroll', 'onselect', 'onsubmit', 'onunload'];
    for (_i = 0, _len = attributesToRemove.length; _i < _len; _i++) {
      attribute = attributesToRemove[_i];
      o('*').removeAttr(attribute);
    }
    return o.html();
  };

  resolveImagePaths = function(html, filePath) {
    var img, imgElement, o, src, _i, _len, _ref, _ref1;
    o = cheerio.load(html);
    _ref = o('img');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imgElement = _ref[_i];
      img = o(imgElement);
      if (src = img.attr('src')) {
        if (src.match(/^(https?|atom):\/\//)) {
          continue;
        }
        if (src.startsWith(process.resourcesPath)) {
          continue;
        }
        if (src.startsWith(resourcePath)) {
          continue;
        }
        if (src.startsWith(packagePath)) {
          continue;
        }
        if (src[0] === '/') {
          if (!fs.isFileSync(src)) {
            img.attr('src', (_ref1 = atom.project.getDirectories()[0]) != null ? _ref1.resolve(src.substring(1)) : void 0);
          }
        } else {
          img.attr('src', path.resolve(path.dirname(filePath), src));
        }
      }
    }
    return o.html();
  };

  convertCodeBlocksToAtomEditors = function(domFragment, defaultLanguage) {
    var codeBlock, codeElement, editor, editorElement, fenceName, fontFamily, grammar, preElement, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      _ref = domFragment.querySelectorAll('code');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        codeElement = _ref[_i];
        codeElement.style.fontFamily = fontFamily;
      }
    }
    _ref1 = domFragment.querySelectorAll('pre');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      preElement = _ref1[_j];
      codeBlock = (_ref2 = preElement.firstElementChild) != null ? _ref2 : preElement;
      fenceName = (_ref3 = (_ref4 = codeBlock.getAttribute('class')) != null ? _ref4.replace(/^lang-/, '') : void 0) != null ? _ref3 : defaultLanguage;
      editorElement = document.createElement('atom-text-editor');
      editorElement.setAttributeNode(document.createAttribute('gutter-hidden'));
      editorElement.removeAttribute('tabindex');
      preElement.parentNode.insertBefore(editorElement, preElement);
      preElement.remove();
      editor = editorElement.getModel();
      editor.setText(codeBlock.textContent.trim());
      if (grammar = atom.grammars.grammarForScopeName(scopeForFenceName(fenceName))) {
        editor.setGrammar(grammar);
      }
    }
    return domFragment;
  };

  tokenizeCodeBlocks = function(html, defaultLanguage) {
    var codeBlock, fenceName, fontFamily, highlightedBlock, highlightedHtml, o, preElement, _i, _len, _ref, _ref1, _ref2;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    o = cheerio.load(html);
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      o('code').css('font-family', fontFamily);
    }
    _ref = o("pre");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      codeBlock = o(preElement).children().first();
      fenceName = (_ref1 = (_ref2 = codeBlock.attr('class')) != null ? _ref2.replace(/^lang-/, '') : void 0) != null ? _ref1 : defaultLanguage;
      if (highlighter == null) {
        highlighter = new Highlights({
          registry: atom.grammars
        });
      }
      highlightedHtml = highlighter.highlightSync({
        fileContents: codeBlock.text(),
        scopeName: scopeForFenceName(fenceName)
      });
      highlightedBlock = o(highlightedHtml);
      highlightedBlock.removeClass('editor').addClass("lang-" + fenceName);
      o(preElement).replaceWith(highlightedBlock);
    }
    return o.html();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcnN0LXByZXZpZXcvbGliL3JlbmRlcmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnTUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FMRCxDQUFBOztBQUFBLEVBTUEsT0FBQSxHQUFVLElBTlYsQ0FBQTs7QUFBQSxFQU9DLG9CQUFxQixPQUFBLENBQVEsb0JBQVIsRUFBckIsaUJBUEQsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxJQVRkLENBQUE7O0FBQUEsRUFVQyxlQUFnQixJQUFJLENBQUMsZUFBTCxDQUFBLEVBQWhCLFlBVkQsQ0FBQTs7QUFBQSxFQVdBLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FYZCxDQUFBOztBQUFBLEVBYUEsT0FBTyxDQUFDLGFBQVIsR0FBd0IsU0FBQyxJQUFELEVBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixRQUE3QixHQUFBOztNQUFDLE9BQUs7S0FDNUI7V0FBQSxNQUFBLENBQU8sSUFBUCxFQUFhLFFBQWIsRUFBdUIsT0FBdkIsRUFBZ0MsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQzlCLFVBQUEsMENBQUE7QUFBQSxNQUFBLElBQTBCLGFBQTFCO0FB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

//# sourceURL=/home/alenz/.atom/packages/rst-preview/lib/renderer.coffee
