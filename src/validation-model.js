'use strict';

const m = require('mithril');
const _ = {
  forEach: require('lodash.foreach'),
  pick: require('lodash.pick'),
  assign: require('lodash.assign'),
  clone: require('lodash.clone'),
};

const vp = require('./validation-prop');

vp.prop = m.prop;
vp.rule_set = require('./validation-rule-set.umd');


function create_model(resources_name, fields) {
  let new_instance_key = 0;

  const props = {};
  _.forEach(fields, (value, key) => {
    props[key] = vp.create_prop(value);
  });

  class Model {
    constructor(field_names=[], pairs={}) {
      const key_ = new_instance_key++;
      this.key_ = () => key_;
      const relations = this.constructor.relations;

      if (arguments.length === 1 && !Array.isArray(field_names)) {
        pairs = field_names;
        field_names = [];
      }

      field_names.forEach(field_name => {
        if (field_name in relations) {
          const C = relations[field_name];
          if (Array.isArray(C)) {
            this[field_name] = m.prop([]);
          } else {
            this[field_name] = m.prop(new C());
          }
        } else if (field_name in props) {
          this[field_name] = props[field_name]();
        } else {
          this[field_name] = m.prop();
        }
      });
      
      _.forEach(pairs, (value, key) => {
        if (key in relations) {
          let C = relations[key];
          if (Array.isArray(value)) {
            C = C[0];
            this[key] = m.prop(value.map(e => e instanceof C ? e : new C(e)));
          } else {
            this[key] = m.prop(value instanceof C ? value : new C(value));
          }
        } else if (key in props) {
          this[key] = props[key]();
          this[key](value);
        } else {
          this[key] = m.prop(value);
        }
      });
    }
  }

  Model.relations = {};

  return Model;
}

module.exports = create_model;
