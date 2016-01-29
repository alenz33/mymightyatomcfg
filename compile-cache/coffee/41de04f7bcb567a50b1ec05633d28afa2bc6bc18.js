(function() {
  describe('Message Element', function() {
    var Message, filePath, getMessage, visibleText;
    Message = require('../../lib/ui/message-element').Message;
    filePath = __dirname + '/fixtures/file.txt';
    getMessage = function(type) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    visibleText = function(element) {
      var cloned;
      cloned = element.cloneNode(true);
      Array.prototype.forEach.call(cloned.querySelectorAll('[hidden]'), function(item) {
        return item.remove();
      });
      return cloned.textContent;
    };
    it('works', function() {
      var message, messageElement;
      message = getMessage('Error');
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(visibleText(messageElement).indexOf(filePath) !== -1).toBe(true);
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentLine = true;
      messageElement.updateVisibility('Line');
      return expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
    });
    return it('plays nice with class attribute', function() {
      var message, messageElement;
      message = getMessage('Error');
      message["class"] = 'Well Hello';
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(messageElement.querySelector('.Well') instanceof Element).toBe(true);
      expect(messageElement.querySelector('.Hello') instanceof Element).toBe(true);
      return expect(messageElement.querySelector('.haha')).toBe(null);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdWkvbWVzc2FnZS1lbGVtZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSwwQ0FBQTtBQUFBLElBQUMsVUFBVyxPQUFBLENBQVEsOEJBQVIsRUFBWCxPQUFELENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxTQUFBLEdBQVksb0JBRHZCLENBQUE7QUFBQSxJQUdBLFVBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLGFBQU87QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sSUFBQSxFQUFNLGNBQWI7QUFBQSxRQUE2QixVQUFBLFFBQTdCO09BQVAsQ0FEVztJQUFBLENBSGIsQ0FBQTtBQUFBLElBS0EsV0FBQSxHQUFjLFNBQUMsT0FBRCxHQUFBO0FBQ1osVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsSUFBbEIsQ0FBVCxDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUF4QixDQUE2QixNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsVUFBeEIsQ0FBN0IsRUFBa0UsU0FBQyxJQUFELEdBQUE7ZUFDaEUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxFQURnRTtNQUFBLENBQWxFLENBREEsQ0FBQTtBQUlBLGFBQU8sTUFBTSxDQUFDLFdBQWQsQ0FMWTtJQUFBLENBTGQsQ0FBQTtBQUFBLElBWUEsRUFBQSxDQUFHLE9BQUgsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLHVCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsVUFBQSxDQUFXLE9BQVgsQ0FBVixDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLEVBQTZCLFNBQTdCLENBRGpCLENBQUE7QUFBQSxNQUVBLGNBQWMsQ0FBQyxnQkFBZixDQUFBLENBRkEsQ0FBQTtBQUFBLE1BSUEsTUFBQSxDQUFPLFdBQUEsQ0FBWSxjQUFaLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsUUFBcEMsQ0FBQSxLQUFtRCxDQUFBLENBQTFELENBQTZELENBQUMsSUFBOUQsQ0FBbUUsSUFBbkUsQ0FKQSxDQUFBO0FBQUEsTUFNQSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FOQSxDQUFBO0FBQUEsTUFPQSxNQUFBLENBQU8sY0FBYyxDQUFDLFlBQWYsQ0FBNEIsUUFBNUIsQ0FBUCxDQUE2QyxDQUFDLElBQTlDLENBQW1ELElBQW5ELENBUEEsQ0FBQTtBQUFBLE1BUUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsSUFSdEIsQ0FBQTtBQUFBLE1BU0EsY0FBYyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBVEEsQ0FBQTthQVVBLE1BQUEsQ0FBTyxXQUFBLENBQVksY0FBWixDQUEyQixDQUFDLE9BQTVCLENBQW9DLFFBQXBDLENBQUEsS0FBaUQsQ0FBQSxDQUF4RCxDQUEyRCxDQUFDLElBQTVELENBQWlFLElBQWpFLEVBWFU7SUFBQSxDQUFaLENBWkEsQ0FBQTtXQXlCQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFVBQUEsdUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxVQUFBLENBQVcsT0FBWCxDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBZ0IsWUFEaEIsQ0FBQTtBQUFBLE1BRUEsY0FBQSxHQUFpQixPQUFPLENBQUMsV0FBUixDQUFvQixPQUFwQixFQUE2QixTQUE3QixDQUZqQixDQUFBO0FBQUEsTUFHQSxjQUFjLENBQUMsZ0JBQWYsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUtBLE1BQUEsQ0FBTyxjQUFjLENBQUMsYUFBZixDQUE2QixPQUE3QixDQUFBLFlBQWlELE9BQXhELENBQWdFLENBQUMsSUFBakUsQ0FBc0UsSUFBdEUsQ0FMQSxDQUFBO0FBQUEsTUFNQSxNQUFBLENBQU8sY0FBYyxDQUFDLGFBQWYsQ0FBNkIsUUFBN0IsQ0FBQSxZQUFrRCxPQUF6RCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLElBQXZFLENBTkEsQ0FBQTthQU9BLE1BQUEsQ0FBTyxjQUFjLENBQUMsYUFBZixDQUE2QixPQUE3QixDQUFQLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsSUFBbkQsRUFSb0M7SUFBQSxDQUF0QyxFQTFCMEI7RUFBQSxDQUE1QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/alenz/.atom/packages/linter/spec/ui/message-element-spec.coffee
