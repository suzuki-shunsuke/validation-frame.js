# validation-model


```javascript
const vm = require('validation-model');
const vm.ruleSet(require('validation-rule-set'));
const vm.prop(require('simple-getter-setter'));

const User = vm.createModel({
  id: [null, [{
    'type': 'required'
  }]],
});

const user = new User({age: 20});

user.age(); // 20
user.id(); // null
user.id.validate();  // {valid: false, message: 'Required'}
user.id.required();  // true
user.id.required(false);  // false
user.id.validate();  // {valid: true, message: ''}
user.validate();  // {valid: true, fields: {id: {valid: true, message: ''}, age: {valid: true, message: ''}}}
```
