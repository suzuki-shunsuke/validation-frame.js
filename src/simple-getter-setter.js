'use strict';

function prop(initialValue) {
  let innerValue = initialValue;
  function getterSetter(value) {
    if (arguments.length) {
      innerValue = value;
      return value;
    } else {
      return innerValue;
    }
  }

  getterSetter.toJSON = () => {
    return innerValue;
  };

  return getterSetter; 
}

module.exports = prop;
