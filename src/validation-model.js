'use strict';

const _ = {
  forEach: require('lodash.foreach'),
  clone: require('lodash.clone'),
};

const vp = require('./validation-prop');

const vm = {};

vm.ruleSet = vp.ruleSet.bind(vp);

function createModel(fields) {
  let newInstanceKey = 0;

  const props = {};
  _.forEach(fields, (value, key) => {
    props[key] = vp.createProp(value);
  });

  class Model {
    constructor(fieldNames=[], pairs={}) {
      const key_ = newInstanceKey++;
      this.key_ = () => key_;
      const relations = this.constructor.relations;

      if (arguments.length === 1 && !Array.isArray(fieldNames)) {
        pairs = fieldNames;
        fieldNames = [];
      }

      fieldNames.forEach(fieldName => {
        if (fieldName in relations) {
          const C = relations[fieldName];
          if (Array.isArray(C)) {
            this[fieldName] = vm.prop([]);
          } else {
            this[fieldName] = vm.prop(new C());
          }
        } else if (fieldName in props) {
          this[fieldName] = props[fieldName]();
        } else {
          this[fieldName] = vm.prop();
        }
      });
      
      _.forEach(pairs, (value, key) => {
        if (key in relations) {
          let C = relations[key];
          if (Array.isArray(value)) {
            C = C[0];
            this[key] = vm.prop(value.map(e => e instanceof C ? e : new C(e)));
          } else {
            this[key] = vm.prop(value instanceof C ? value : new C(value));
          }
        } else if (key in props) {
          this[key] = props[key]();
          this[key](value);
        } else {
          this[key] = vm.prop(value);
        }
      });
    }
  }

  Model.relations = {};

  return Model;
}

vm.createModel = createModel;

module.exports = vm;
