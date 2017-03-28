const expect = require('expect');
const { User } = require('../models/index');
const controller = require('../controllers/index');

const access_token = 'test_token';

describe('User', () => {
  before((done) => {
    User.remove(done);
  });

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
  });

  describe('API validation', () => {
    it('should be valid token', (done) => {
      controller
        .user
        .validateToken(access_token)
        .then((user) => {
          expect(user.access_token).toBe(access_token);
          done();
        })
        .catch(done);
    });

    it('should log user out', (done) => {
      controller
        .user
        .logOut(access_token)
        .then(() => {
          User
            .where({ access_token })
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
