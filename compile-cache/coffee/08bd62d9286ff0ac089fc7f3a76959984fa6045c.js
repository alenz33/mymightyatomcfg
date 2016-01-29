(function() {
  var extensionsByFenceName;

  extensionsByFenceName = {
    'bash': 'sh',
    'coffee': 'coffee',
    'coffeescript': 'coffee',
    'coffee-script': 'coffee',
    'css': 'css',
    'go': 'go',
    'java': 'java',
    'javascript': 'js',
    'js': 'js',
    'json': 'json',
    'less': 'less',
    'mustache': 'mustache',
    'php': 'php',
    'python': 'py',
    'rb': 'rb',
    'ruby': 'rb',
    'sh': 'sh',
    'toml': 'toml',
    'xml': 'xml'
  };

  module.exports = {
    extensionForFenceName: function(fenceName) {
      return extensionsByFenceName[fenceName];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvcnN0LXByZXZpZXcvbGliL2V4dGVuc2lvbi1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEscUJBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLElBQVI7QUFBQSxJQUNBLFFBQUEsRUFBVSxRQURWO0FBQUEsSUFFQSxjQUFBLEVBQWdCLFFBRmhCO0FBQUEsSUFHQSxlQUFBLEVBQWlCLFFBSGpCO0FBQUEsSUFJQSxLQUFBLEVBQU8sS0FKUDtBQUFBLElBS0EsSUFBQSxFQUFNLElBTE47QUFBQSxJQU1BLE1BQUEsRUFBUSxNQU5SO0FBQUEsSUFPQSxZQUFBLEVBQWMsSUFQZDtBQUFBLElBUUEsSUFBQSxFQUFNLElBUk47QUFBQSxJQVNBLE1BQUEsRUFBUSxNQVRSO0FBQUEsSUFVQSxNQUFBLEVBQVEsTUFWUjtBQUFBLElBV0EsVUFBQSxFQUFZLFVBWFo7QUFBQSxJQVlBLEtBQUEsRUFBTyxLQVpQO0FBQUEsSUFhQSxRQUFBLEVBQVUsSUFiVjtBQUFBLElBY0EsSUFBQSxFQUFNLElBZE47QUFBQSxJQWVBLE1BQUEsRUFBUSxJQWZSO0FBQUEsSUFnQkEsSUFBQSxFQUFNLElBaEJOO0FBQUEsSUFpQkEsTUFBQSxFQUFRLE1BakJSO0FBQUEsSUFrQkEsS0FBQSxFQUFPLEtBbEJQO0dBREYsQ0FBQTs7QUFBQSxFQXFCQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxxQkFBQSxFQUF1QixTQUFDLFNBQUQsR0FBQTthQUNyQixxQkFBc0IsQ0FBQSxTQUFBLEVBREQ7SUFBQSxDQUF2QjtHQXRCRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/alenz/.atom/packages/rst-preview/lib/extension-helper.coffee
