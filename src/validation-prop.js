const vp = {};

const vf = require('./validation-frame');

vp.ruleSet = vf.ruleSet.bind(vf);

vp.createProp = (rules) => {
  const validate_ = vf.createValidate(rules);
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
