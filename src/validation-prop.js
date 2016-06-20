const vp = {};

const vf = require('./validation-frame');

vp.ruleSet = vf.ruleSet.bind(vf);

vp.createProp = (rules, ...params) => {
  const validate_ = vf.createValidate(rules, ...params);
  function prop(value) {
    const p = arguments.length ? vp.prop(value) : vp.prop();
    p.message = vp.prop('');
    p.valid = vp.prop(false);
    p.validate = () => {
      const ret = validate_(p());
      p.valid(ret.valid);
      p.message(ret.message);
      return ret;
    };
    p.validate.required = validate_.required.bind(validate_.required);
    return p;
  }
  
  return prop;
};

module.exports = vp;
