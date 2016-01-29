'use babel';

function mouseEvent(type, properties) {
  var defaults = {
    bubbles: true,
    cancelable: type !== 'mousemove',
    view: window,
    detail: 0,
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined
  };

  for (var k in defaults) {
    var v = defaults[k];
    if (!(properties[k] != null)) {
      properties[k] = v;
    }
  }

  return new MouseEvent(type, properties);
}

function touchEvent(type, touches) {
  var event = new Event(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    relatedTarget: undefined
  });
  event.touches = event.changedTouches = event.targetTouches = touches;

  return event;
}

function objectCenterCoordinates(obj) {
  var _obj$getBoundingClientRect = obj.getBoundingClientRect();

  var top = _obj$getBoundingClientRect.top;
  var left = _obj$getBoundingClientRect.left;
  var width = _obj$getBoundingClientRect.width;
  var height = _obj$getBoundingClientRect.height;

  return { x: left + width / 2, y: top + height / 2 };
}

function exists(value) {
  return typeof value !== 'undefined' && value !== null;
}

module.exports = { objectCenterCoordinates: objectCenterCoordinates, mouseEvent: mouseEvent };['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function (key) {
  module.exports[key] = function (obj) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var x = _ref.x;
    var y = _ref.y;
    var cx = _ref.cx;
    var cy = _ref.cy;
    var btn = _ref.btn;

    if (!(typeof x !== 'undefined' && x !== null && typeof y !== 'undefined' && y !== null)) {
      var o = objectCenterCoordinates(obj);
      x = o.x;
      y = o.y;
    }

    if (!(typeof cx !== 'undefined' && cx !== null && typeof cy !== 'undefined' && cy !== null)) {
      cx = x;
      cy = y;
    }

    obj.dispatchEvent(mouseEvent(key, {
      pageX: x, pageY: y, clientX: cx, clientY: cy, button: btn
    }));
  };
});

module.exports.mousewheel = function (obj) {
  var deltaX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var deltaY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  obj.dispatchEvent(mouseEvent('mousewheel', { deltaX: deltaX, deltaY: deltaY }));
};['touchstart', 'touchmove', 'touchend'].forEach(function (key) {
  module.exports[key] = function (obj, touches) {
    if (!Array.isArray(touches)) {
      touches = [touches];
    }

    touches.forEach(function (touch) {
      if (!exists(touch.target)) {
        touch.target = obj;
      }

      if (!(exists(touch.pageX) && exists(touch.pageY))) {
        var o = objectCenterCoordinates(obj);
        touch.pageX = exists(touch.x) ? touch.x : o.x;
        touch.pageY = exists(touch.y) ? touch.y : o.y;
      }

      if (!(exists(touch.clientX) && exists(touch.clientY))) {
        touch.clientX = touch.pageX;
        touch.clientY = touch.pageY;
      }
    });

    obj.dispatchEvent(touchEvent(key, touches));
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9oZWxwZXJzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7O0FBRVgsU0FBUyxVQUFVLENBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUNyQyxNQUFJLFFBQVEsR0FBRztBQUNiLFdBQU8sRUFBRSxJQUFJO0FBQ2IsY0FBVSxFQUFHLElBQUksS0FBSyxXQUFXLEFBQUM7QUFDbEMsUUFBSSxFQUFFLE1BQU07QUFDWixVQUFNLEVBQUUsQ0FBQztBQUNULFNBQUssRUFBRSxDQUFDO0FBQ1IsU0FBSyxFQUFFLENBQUM7QUFDUixXQUFPLEVBQUUsQ0FBQztBQUNWLFdBQU8sRUFBRSxDQUFDO0FBQ1YsV0FBTyxFQUFFLEtBQUs7QUFDZCxVQUFNLEVBQUUsS0FBSztBQUNiLFlBQVEsRUFBRSxLQUFLO0FBQ2YsV0FBTyxFQUFFLEtBQUs7QUFDZCxVQUFNLEVBQUUsQ0FBQztBQUNULGlCQUFhLEVBQUUsU0FBUztHQUN6QixDQUFBOztBQUVELE9BQUssSUFBSSxDQUFDLElBQUksUUFBUSxFQUFFO0FBQ3RCLFFBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNuQixRQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQSxBQUFDLEVBQUU7QUFDNUIsZ0JBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDbEI7R0FDRjs7QUFFRCxTQUFPLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTtDQUN4Qzs7QUFFRCxTQUFTLFVBQVUsQ0FBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ2xDLE1BQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtBQUMxQixXQUFPLEVBQUUsSUFBSTtBQUNiLGNBQVUsRUFBRSxJQUFJO0FBQ2hCLFFBQUksRUFBRSxNQUFNO0FBQ1os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QUE7R0FDNUMsQ0FBQTtDQUNGLENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9hbGVuei8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvaGVscGVycy9ldmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5mdW5jdGlvbiBtb3VzZUV2ZW50ICh0eXBlLCBwcm9wZXJ0aWVzKSB7XG4gIGxldCBkZWZhdWx0cyA9IHtcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6ICh0eXBlICE9PSAnbW91c2Vtb3ZlJyksXG4gICAgdmlldzogd2luZG93LFxuICAgIGRldGFpbDogMCxcbiAgICBwYWdlWDogMCxcbiAgICBwYWdlWTogMCxcbiAgICBjbGllbnRYOiAwLFxuICAgIGNsaWVudFk6IDAsXG4gICAgY3RybEtleTogZmFsc2UsXG4gICAgYWx0S2V5OiBmYWxzZSxcbiAgICBzaGlmdEtleTogZmFsc2UsXG4gICAgbWV0YUtleTogZmFsc2UsXG4gICAgYnV0dG9uOiAwLFxuICAgIHJlbGF0ZWRUYXJnZXQ6IHVuZGVmaW5lZFxuICB9XG5cbiAgZm9yIChsZXQgayBpbiBkZWZhdWx0cykge1xuICAgIGxldCB2ID0gZGVmYXVsdHNba11cbiAgICBpZiAoIShwcm9wZXJ0aWVzW2tdICE9IG51bGwpKSB7XG4gICAgICBwcm9wZXJ0aWVzW2tdID0gdlxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgTW91c2VFdmVudCh0eXBlLCBwcm9wZXJ0aWVzKVxufVxuXG5mdW5jdGlvbiB0b3VjaEV2ZW50ICh0eXBlLCB0b3VjaGVzKSB7XG4gIGxldCBldmVudCA9IG5ldyBFdmVudCh0eXBlLCB7XG4gICAgYnViYmxlczogdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIHZpZXc6IHdpbmRvdyxcbiAgICBjdHJsS2V5OiBmYWxzZSxcbiAgICBhbHRLZXk6IGZhbHNlLFxuICAgIHNoaWZ0S2V5OiBmYWxzZSxcbiAgICBtZXRhS2V5OiBmYWxzZSxcbiAgICByZWxhdGVkVGFyZ2V0OiB1bmRlZmluZWRcbiAgfSlcbiAgZXZlbnQudG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzID0gZXZlbnQudGFyZ2V0VG91Y2hlcyA9IHRvdWNoZXNcblxuICByZXR1cm4gZXZlbnRcbn1cblxuZnVuY3Rpb24gb2JqZWN0Q2VudGVyQ29vcmRpbmF0ZXMgKG9iaikge1xuICBsZXQge3RvcCwgbGVmdCwgd2lkdGgsIGhlaWdodH0gPSBvYmouZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIHt4OiBsZWZ0ICsgd2lkdGggLyAyLCB5OiB0b3AgKyBoZWlnaHQgLyAyfVxufVxuXG5mdW5jdGlvbiBleGlzdHMgKHZhbHVlKSB7XG4gIHJldHVybiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7b2JqZWN0Q2VudGVyQ29vcmRpbmF0ZXMsIG1vdXNlRXZlbnR9XG5cbjtbJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCcsICdjbGljayddLmZvckVhY2goKGtleSkgPT4ge1xuICBtb2R1bGUuZXhwb3J0c1trZXldID0gZnVuY3Rpb24gKG9iaiwge3gsIHksIGN4LCBjeSwgYnRufSA9IHt9KSB7XG4gICAgaWYgKCEoKHR5cGVvZiB4ICE9PSAndW5kZWZpbmVkJyAmJiB4ICE9PSBudWxsKSAmJiAodHlwZW9mIHkgIT09ICd1bmRlZmluZWQnICYmIHkgIT09IG51bGwpKSkge1xuICAgICAgbGV0IG8gPSBvYmplY3RDZW50ZXJDb29yZGluYXRlcyhvYmopXG4gICAgICB4ID0gby54XG4gICAgICB5ID0gby55XG4gICAgfVxuXG4gICAgaWYgKCEoKHR5cGVvZiBjeCAhPT0gJ3VuZGVmaW5lZCcgJiYgY3ggIT09IG51bGwpICYmICh0eXBlb2YgY3kgIT09ICd1bmRlZmluZWQnICYmIGN5ICE9PSBudWxsKSkpIHtcbiAgICAgIGN4ID0geFxuICAgICAgY3kgPSB5XG4gICAgfVxuXG4gICAgb2JqLmRpc3BhdGNoRXZlbnQobW91c2VFdmVudChrZXksIHtcbiAgICAgIHBhZ2VYOiB4LCBwYWdlWTogeSwgY2xpZW50WDogY3gsIGNsaWVudFk6IGN5LCBidXR0b246IGJ0blxuICAgIH0pKVxuICB9XG59KVxuXG5tb2R1bGUuZXhwb3J0cy5tb3VzZXdoZWVsID0gZnVuY3Rpb24gKG9iaiwgZGVsdGFYID0gMCwgZGVsdGFZID0gMCkge1xuICBvYmouZGlzcGF0Y2hFdmVudChtb3VzZUV2ZW50KCdtb3VzZXdoZWVsJywge2RlbHRhWCwgZGVsdGFZfSkpXG59XG5cbjtbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoZW5kJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gIG1vZHVsZS5leHBvcnRzW2tleV0gPSBmdW5jdGlvbiAob2JqLCB0b3VjaGVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRvdWNoZXMpKSB7XG4gICAgICB0b3VjaGVzID0gW3RvdWNoZXNdXG4gICAgfVxuXG4gICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgaWYgKCFleGlzdHModG91Y2gudGFyZ2V0KSkge1xuICAgICAgICB0b3VjaC50YXJnZXQgPSBvYmpcbiAgICAgIH1cblxuICAgICAgaWYgKCEoZXhpc3RzKHRvdWNoLnBhZ2VYKSAmJiBleGlzdHModG91Y2gucGFnZVkpKSkge1xuICAgICAgICBsZXQgbyA9IG9iamVjdENlbnRlckNvb3JkaW5hdGVzKG9iailcbiAgICAgICAgdG91Y2gucGFnZVggPSBleGlzdHModG91Y2gueCkgPyB0b3VjaC54IDogby54XG4gICAgICAgIHRvdWNoLnBhZ2VZID0gZXhpc3RzKHRvdWNoLnkpID8gdG91Y2gueSA6IG8ueVxuICAgICAgfVxuXG4gICAgICBpZiAoIShleGlzdHModG91Y2guY2xpZW50WCkgJiYgZXhpc3RzKHRvdWNoLmNsaWVudFkpKSkge1xuICAgICAgICB0b3VjaC5jbGllbnRYID0gdG91Y2gucGFnZVhcbiAgICAgICAgdG91Y2guY2xpZW50WSA9IHRvdWNoLnBhZ2VZXG4gICAgICB9XG4gICAgfSlcblxuICAgIG9iai5kaXNwYXRjaEV2ZW50KHRvdWNoRXZlbnQoa2V5LCB0b3VjaGVzKSlcbiAgfVxufSlcbiJdfQ==
//# sourceURL=/home/alenz/.atom/packages/minimap/spec/helpers/events.js
