const vp = {};

const vf = require('./validation-frame');

vp.create_prop = (rules) => {
  vf.rule_set = vp.rule_set;
  const validate_ = vf.create_validate(rules);
  function prop(value) {
    const p = arguments.length ? vp.prop(value) : vp.prop();
    p.message = vp.prop('');
    p.valid = vp.prop(false);
    p.validate = () => {
      ret = validate_(p());
      p.valid(ret.valid);
      p.message(ret.message);
      return ret;
    };
    return p;
  }
  
  return prop;
};

module.exports = vp;
