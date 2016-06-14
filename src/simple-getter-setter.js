'use strict';

function prop(initial_value) {
  let inner_value = initial_value;
  function getter_setter(value) {
    if (arguments.length) {
      inner_value = value;
      return value;
    } else {
      return inner_value;
    }
  }

  getter_setter.toJSON = () => {
    return inner_value;
  };

  return getter_setter; 
}

module.exports = prop;
