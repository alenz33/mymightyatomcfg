(function() {
  module.exports = {
    selector: ['.source.python'],
    id: 'aligner-python',
    config: {
      ':-alignment': {
        title: 'Padding for :',
        description: 'Pad left or right of the character',
        type: 'string',
        "enum": ['left', 'right'],
        "default": 'right'
      },
      ':-leftSpace': {
        title: 'Left space for :',
        description: 'Add 1 whitespace to the left',
        type: 'boolean',
        "default": false
      },
      ':-rightSpace': {
        title: 'Right space for :',
        description: 'Add 1 whitespace to the right',
        type: 'boolean',
        "default": true
      }
    },
    privateConfig: {
      ':-scope': 'valuepair'
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvYWxpZ25lci1weXRob24vbGliL3Byb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsQ0FBQyxnQkFBRCxDQUFWO0FBQUEsSUFDQSxFQUFBLEVBQUksZ0JBREo7QUFBQSxJQUVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLG9DQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FITjtBQUFBLFFBSUEsU0FBQSxFQUFTLE9BSlQ7T0FERjtBQUFBLE1BTUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4QkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BUEY7QUFBQSxNQVdBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsK0JBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtPQVpGO0tBSEY7QUFBQSxJQW1CQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLFNBQUEsRUFBVyxXQUFYO0tBcEJGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/alenz/.atom/packages/aligner-python/lib/provider.coffee
