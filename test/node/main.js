'use strict';

const chai = require('chai');
const mocha = require('mocha');
const m = require('mithril');

const vf = require('../../src/validation-frame.js');
vf.ruleSet(require('../../src/validation-rule-set.js'));

const vp = require('../../src/validation-prop.js');
vp.prop = m.prop;
vp.ruleSet(require('../../src/validation-rule-set.js'));

const createModel = require('../../src/validation-model.js');

mocha.describe('vf.createValidate', () => {
  mocha.it('', () => {
    let message = 'Required';
    const validate = vf.createValidate([
      {'type': 'required', message: message},
      {'type': 'maxLength',
       message: (ret, value, params) => `value: ${value}`, params: 5},
    ]);
    chai.expect(validate('').valid).to.be.false;
    chai.expect(validate('').message).eql(message);
    chai.expect(validate('f').valid).to.be.true;
    chai.expect(validate('f').message).eql('');
    let value = 'ffffff';
    chai.expect(validate(value).valid).to.be.false;
    chai.expect(validate(value).message).eql(`value: ${value}`);
  });
  mocha.it('message is not required', () => {
    const validate = vf.createValidate([{'type': 'required'},]);
    chai.expect(validate('').valid).to.be.false;
    chai.expect(validate('').message).eql('Required');
  });
  mocha.it('required option', () => {
    const validate = vf.createValidate([]);
    chai.expect(validate.required()).to.be.false;
    chai.expect(validate('').valid).to.be.true;
    chai.expect(validate('f').valid).to.be.true;
    validate.required(true);
    chai.expect(validate.required()).to.be.true;
    chai.expect(validate('').valid).to.be.false;
    chai.expect(validate('f').valid).to.be.true;
  });
});

mocha.describe('vp.createProp()', () => {
  mocha.it('is a getter and setter.', () => {
    const prop = vp.createProp([]);
    const memo = prop('');
    chai.expect(memo()).equals('');
    memo('foo');
    chai.expect(memo()).equals('foo');
  });
  mocha.it('is a getter and setter.', () => {
    const prop = vp.createProp([{
      type: 'ascii', message: 'ASCII!'
    }]);
    const memo = prop('a');
    chai.expect(memo.validate().valid).to.be.true;
    memo('ほげ');
    chai.expect(memo.validate().valid).to.be.false;
    chai.expect(memo.validate().message).equals('ASCII!');
  });
});

mocha.describe('createModel()', () => {
  mocha.it('', () => {
    const User = createModel('users', {
      name: [{
        'type': 'ascii',
        'message': 'Ascii!'
      }]
    });
    const user = new User({name: ''});
    chai.expect(user.name()).equals('');
    chai.expect(user.name.valid()).to.be.false;
    chai.expect(user.name.message()).equals('');
    chai.expect(user.name.validate()).eql({valid: false, message: 'Ascii!'});
    chai.expect(user.name.valid()).to.be.false;
    chai.expect(user.name.message()).equals('Ascii!');

    chai.expect(user.name('a')).equals('a');
    chai.expect(user.name.valid()).to.be.false;
    chai.expect(user.name.message()).equals('Ascii!');
    chai.expect(user.name.validate()).eql({valid: true, message: ''});
    chai.expect(user.name.valid()).to.be.true;
    chai.expect(user.name.message()).equals('');
  });
});
