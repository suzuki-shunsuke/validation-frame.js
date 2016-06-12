'use strict';

const chai = require('chai');
const mocha = require('mocha');

const vf = require('../../src/main');
vf.rule_set = require('../../src/rule_set');

mocha.describe('vf.create_validate', () => {
  mocha.it('', () => {
    let message = 'Required!';
    const validate = vf.create_validate([
      {'type': 'required', 'message': message},
      {'type': 'max_length',
        'message': (ret, value, params) => `value: ${value}`, params: 5},
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
    const validate = vf.create_validate([{'type': 'required'},]);
    chai.expect(validate('').valid).to.be.false;
    chai.expect(validate('').message).eql('');
  });
});
