(function() {
  var provider;

  provider = require('./provider');

  module.exports = {
    config: provider.config,
    activate: function() {
      return console.log('activate aligner-python');
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYWxpZ25lci1weXRob24vbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQUFqQjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVosRUFEUTtJQUFBLENBRlY7QUFBQSxJQUtBLFdBQUEsRUFBYSxTQUFBLEdBQUE7YUFBRyxTQUFIO0lBQUEsQ0FMYjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/aligner-python/lib/main.coffee
