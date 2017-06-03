const expect = require('expect');
// const request = require('supertest');
const { User } = require('../models/index');
const { UserRepository } = require('../repository/index');
// const controller = require('../controllers/index');
// const app = require('../server');

describe('UserRepository', function() {
  this.timeout(120000); // for mockgoose
  const mongoose = require('mongoose');
  const Promise = require('bluebird');
  mongoose.Promise = Promise;
  let _user = {};

  before((done) => {
    const Mockgoose = require('mockgoose').Mockgoose; // eslint-disable-line node/no-unpublished-require
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(() => {
      mongoose.connect(
        'mongodb://localhost:4000/underground_lottery_unit_test',
        done
      );
    });
  });

  it('should success when call upsert() with correct data (insert)', (done) => {
    const user_data = {
      access_token: 'access_token',
      name: 'name',
      oauth_id: 'oauth_id',
      picture: {
        data: {
          url: 'url'
        }
      }
    };
    const user_repository = new UserRepository(User);
    user_repository
      .upsert(user_data)
      .then((res) => {
        expect(res).toExist();
        done();
      })
      .catch(done);
  });

  it('should success when call upsert() with correct data (update)', (done) => {
    const user_data = {
      access_token: 'access_token',
      name: 'name',
      oauth_id: 'oauth_id',
      picture: {
        data: {
          url: 'url'
        }
      }
    };
    const user_repository = new UserRepository(User);
    user_repository
      .upsert(user_data)
      .then((res) => {
        expect(res).toExist();
        _user = res;
        done();
      })
      .catch(done);
  });

  it('should return data when call find_by_token() with correct input', (done) => {
    const user_repository = new UserRepository(User);
    user_repository
      .find_by_token('access_token')
      .then((res) => {
        expect(res).toExist();
        done();
      })
      .catch(done);
  });

  it('should not return data when call find_by_id() with incorrect input', (done) => {
    const user_repository = new UserRepository(User);
    user_repository
      .find_by_token('xxx')
      .then((res) => {
        expect(res).toNotExist();
        done();
      })
      .catch(done);
  });

  it('should return data when call find_by_id() with correct input', (done) => {
    const user_repository = new UserRepository(User);
    user_repository
      .find_by_id(_user.id)
      .then((res) => {
        expect(res).toExist();
        done();
      })
      .catch(done);
  });
});

describe('User', function() {
  describe('Controller', () => {
    const { UserController } = require('../controller/index');

    describe('authenticate() middleware', () => {
      it('should call next() and return user id when authenticate() with right access_token', (done) => {
        const mock_req = {
          headers: {
            'x-access-token': 'x-access-token'
          }
        };
        const mock_res = {};
        const mock_next = () => {
          expect(mock_req.user_id).toExist();
          done();
        };
        const mock_repository = {
          find_by_token() {
            return new Promise((resolve) => {
              resolve({
                id: 'id'
              });
            });
          }
        };
        const user_controller = new UserController(mock_repository);
        user_controller.authentication_middleware(
          mock_req,
          mock_res,
          mock_next
        );
      });

      it('should get 401 status when authenticate() with wrong access_token', (done) => {
        const mock_req = {
          headers: {
            'x-access-token': 'x-access-token'
          }
        };
        const mock_res = {
          status(code) {
            expect(code).toBe(401);
            return {
              send() {
                done();
              }
            };
          }
        };
        const mock_next = () => {};
        const mock_repository = {
          find_by_token() {
            return new Promise((resolve) => {
              resolve();
            });
          }
        };
        const user_controller = new UserController(mock_repository);
        user_controller.authentication_middleware(
          mock_req,
          mock_res,
          mock_next
        );
      });

      it('should get 500 status when authenticate() with repository error', (done) => {
        const mock_req = {
          headers: {
            'x-access-token': 'x-access-token'
          }
        };
        const mock_res = {
          status(code) {
            expect(code).toBe(500);
            return {
              send() {
                done();
              }
            };
          }
        };
        const mock_next = () => {};
        const mock_repository = {
          find_by_token() {
            return new Promise((resolve, reject) => {
              reject();
            });
          }
        };
        const user_controller = new UserController(mock_repository);
        user_controller.authentication_middleware(
          mock_req,
          mock_res,
          mock_next
        );
      });
    });

    describe('get()', () => {
      it('should get 200 status with data when call get()', (done) => {
        const mock_req = {};
        const mock_res = {
          status(code) {
            expect(code).toBe(200);
            return {
              json(data) {
                expect(data).toExist();
                done();
              }
            };
          }
        };
        const mock_repository = {
          find_by_id() {
            return new Promise((resolve) => {
              resolve({});
            });
          }
        };
        const user_controller = new UserController(mock_repository);
        user_controller.get(mock_req, mock_res);
      });
      it('should get 401 status when call get()', (done) => {
        const mock_req = {};
        const mock_res = {
          status(code) {
            expect(code).toBe(401);
            return {
              send() {
                done();
              }
            };
          }
        };
        const mock_repository = {
          find_by_id() {
            return new Promise((resolve) => {
              resolve();
            });
          }
        };
        const user_controller = new UserController(mock_repository);
        user_controller.get(mock_req, mock_res);
      });
      it('should get 500 status when call get()', (done) => {
        const mock_req = {};
        const mock_res = {
          status(code) {
            expect(code).toBe(500);
            return {
              send() {
                done();
              }
            };
          }
        };
        const mock_repository = {
          find_by_id() {
            return new Promise((resolve, reject) => {
              reject();
            });
          }
        };
        const user_controller = new UserController(mock_repository);
        user_controller.get(mock_req, mock_res);
      });
    });
  });
});
//
// const access_token = 'fefefefaewfaefaef';
// const access_token_2 = 'awfeaewfaefaewfaewfafew';
//
// describe('User', () => {
//   before((done) => {
//     User.remove(done);
//   });
//
//   describe('controller functions', () => {
//     describe('first login', () => {
//       it('should exchange short-lived token for long-lived token', (done) => {
//         controller.user
//           .getToken(controller.user.fakeAuthenticator, access_token)
//           .then((res) => {
//             expect(res).toExist();
//             done();
//           })
//           .catch(done);
//       });
//
//       it('should store user data to db', (done) => {
//         controller.user
//           .getToken(controller.user.fakeAuthenticator, access_token)
//           .then(controller.user.fakeProfileGetter)
//           .then(controller.user.saveUserData)
//           .then((user) => {
//             User.findById(user.id, (error, doc) => {
//               expect(doc.access_token).toExist();
//               expect(doc.name).toExist();
//               expect(doc.picture).toExist();
//               expect(doc.is_admin).toBe(false);
//               done();
//             });
//           })
//           .catch(done);
//       });
//
//       it('should update user token', (done) => {
//         controller.user
//           .getToken(controller.user.fakeAuthenticator, access_token_2)
//           .then(controller.user.fakeProfileGetter)
//           .then(controller.user.saveUserData)
//           .then((user) => {
//             User.findById(user.id, (error, doc) => {
//               expect(doc.access_token).toBe(access_token_2);
//               done();
//             });
//           })
//           .catch(done);
//       });
//     });
//
//     describe('API validation', () => {
//       it('should be valid token', (done) => {
//         controller.user
//           .validateToken(access_token_2)
//           .then((user_id) => {
//             expect(user_id).toExist();
//             done();
//           })
//           .catch(done);
//       });
//     });
//   });
//
//   describe('endpoint', () => {
//     it('should get 401', (done) => {
//       request(app).post('/api/log_in').expect(401).end(done);
//     });
//
//     it('should log in successfully', (done) => {
//       request(app)
//         .post('/api/log_in')
//         .send({ access_token })
//         .then((res) => {
//           expect(res.body.access_token).toExist();
//           done();
//         })
//         .catch(done);
//     });
//
//     it('should log user out', (done) => {
//       request(app).patch('/api/log_out').set('x-access-token', access_token).expect(200).end(done);
//     });
//
//     it('should not get user data', (done) => {
//       request(app).get('/api/me').set('x-access-token', access_token).expect(401).end(done);
//     });
//
//     it('should udpate user token', (done) => {
//       request(app)
//         .post('/api/log_in')
//         .send({ access_token: access_token_2 })
//         .then((res) => {
//           expect(res.body.access_token).toBe(access_token_2);
//           done();
//         })
//         .catch(done);
//     });
//   });
// });
