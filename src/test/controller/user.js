const expect = require('expect');
const { UserController } = require('../../controller/index');

describe('User', () => {
  describe('authenticate()', () => {
    it('should get user_id and call next() when authenticate() with right access_token', (done) => {
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
      user_controller.authentication_middleware(mock_req, mock_res, mock_next);
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
      user_controller.authentication_middleware(mock_req, mock_res, mock_next);
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
      user_controller.authentication_middleware(mock_req, mock_res, mock_next);
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
