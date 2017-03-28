const expect = require('expect');
const request = require('supertest');
const { User } = require('../models/index');
const controller = require('../controllers/index');
const app = require('../server');

const access_token = 'test_token';
const access_token_2 = 'test_token_2';

describe('User', () => {
  before((done) => {
    User.remove(done);
  });

  describe('controller functions', () => {
    describe('first login', () => {
      it('should exchange short-lived token for long-lived token', (done) => {
        controller
          .user
          .getToken(controller.user.fakeAuthenticator, access_token)
          .then((res) => {
            expect(res).toExist();
            done();
          })
          .catch(done);
      });

      it('should store user data to db', (done) => {
        controller
          .user
          .getToken(controller.user.fakeAuthenticator, access_token)
          .then(controller.user.fakeProfileGetter)
          .then(controller.user.saveUserData)
          .then((user)=> {
            User.findById(user.id, (error, doc) => {
              expect(doc.access_token).toExist();
              expect(doc.name).toExist();
              expect(doc.picture).toExist();
              done();
            });
          })
          .catch(done);
      });

      it('should update user token', (done) => {
        controller
          .user
          .getToken(controller.user.fakeAuthenticator, access_token_2)
          .then(controller.user.fakeProfileGetter)
          .then(controller.user.saveUserData)
          .then((user)=> {
            User.findById(user.id, (error, doc) => {
              expect(doc.access_token).toBe(access_token_2);
              done();
            });
          })
          .catch(done);
      });
    });

    describe('API validation', () => {
      it('should be valid token', (done) => {
        controller
          .user
          .validateToken(access_token_2)
          .then((user) => {
            expect(user.access_token).toBe(access_token_2);
            done();
          })
          .catch(done);
      });

      it('should log user out', (done) => {
        controller
          .user
          .logOut(access_token_2)
          .then(() => {
            User
              .where({ access_token_2 })
              .findOne()
              .exec((error, doc) => {
                if (error) {
                  done(error);
                }
                expect(doc).toNotExist();
                done();
              });
          })
          .catch(done);
      });
    });
  });

  describe('endpoint', () => {
    it('should get 401', (done) => {
      request(app)
        .post('/api/log_in')
        .expect(401)
        .then((res) => {
          const user = res.body;
          expect(user).toExist();
          done();
        })
        .catch(done);
    });

    it('should log in successfully', (done) => {
      request(app)
        .post('/api/log_in')
        .send({ access_token })
        .then((res) => {
          const user = res.body;
          expect(user).toExist();
          done();
        })
        .catch(done);
    });

    it('should udpate user token', (done) => {
      request(app)
        .post('/api/log_in')
        .send({ access_token: access_token_2 })
        .then(() => {
          User
            .where({ access_token: access_token_2 })
            .findOne()
            .exec((error, doc) => {
              if (error) {
                done(error);
              }
              expect(doc.access_token).toBe(access_token_2);
              done();
            });
        })
        .catch(done);
    });
  });
});
