# validation-prop

```javascript
const vp = require('validation-prop');
vp.ruleSet(require('validation-rule-set'));
vp.prop = require('simple-getter-setter');

const props = {};
props.memo = vp.creatProp([{
  type: 'required',
  message: 'Required!'
}]);

const memo = props.memo('foo');
memo(); // foo
memo.validate();  // {valid: true, message: ''}
memo.valid();
memo.message();
```
