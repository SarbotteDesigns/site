/**
  Module each : voir doc underscore.js
*/
define(function () {

  var ArrayProto = Array.prototype,
    nativeForEach = ArrayProto.forEach,
    breaker = {};
  
  return function (obj, iterator, context) {
    if (obj === null) {
      return;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) {
          return;
        }
      }
    }
  };
});