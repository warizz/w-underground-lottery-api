const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const { User } = require('../models/index');

describe('User', () => {
  before((done) => {
    User.remove(done);
  });

  describe('first login', () => {
    it('should exchange short-lived token for long-lived token', (done) => {
      expect(res).toExist();
      done();
    });

    it('should store user data to db', (done) => {
      User.findOne({ token }, (error, doc) => {
        expect(doc.username).toExist();
        expect(doc.email).toExist();
        expect(doc.pic_url).toExist();
      });
      done();
    });
  });

  describe('API validation', () => {
    it('should be valid token', (done) => {
      User.findOne({ token }, (error, doc) => {
        expect(doc).toExist();
        done();
      });
    });

    it('should store user data to db', (done) => {
      User.update({ token }, { $unset: { token: 1 } }, { new: true }, (error, doc) => {
        expect(doc.token).toNotExist();
        done();
      });
    });

    it('should not found the token', (done) => {
      User.findOne({ token }, (error, doc) => {
        expect(doc).toNotExist();
        done();
      });
    });
  });

  // ------ validation -----------

  // get token from header > find > found

  // logout > remove user's token

  // get token from header > find > not found
});
