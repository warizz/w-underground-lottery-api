const expect = require('expect');
const { PeriodController } = require('../../../controller/index');

describe('post()', () => {
  it('should get 500 status when call post() with repository internal error', (done) => {
    const mock_period_repository = {
      create() {
        return new Promise((resolve, reject) => reject());
      },
      find() {
        return new Promise(resolve => resolve([]));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: true }));
      }
    };
    const mock_req = {
      body: {
        createdBy: 'createdBy',
        endedAt: new Date(2017, 1, 1)
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
    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository
    );

    controller.post(mock_req, mock_res);
  });

  it('should get 401 status when call post() with no permission', (done) => {
    const mock_period_repository = {
      create() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: false }));
      }
    };
    const mock_req = {
      body: {
        createdBy: 'createdBy',
        endedAt: new Date(2017, 1, 1)
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
    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository
    );

    controller.post(mock_req, mock_res);
  });

  it('should get 201 status when call post() with correct input', (done) => {
    const mock_period_repository = {
      create() {
        return new Promise(resolve => resolve());
      },
      find() {
        return new Promise(resolve => resolve([]));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
      body: {
        endedAt: new Date(2017, 1, 1)
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(201);
        return {
          send() {
            done();
          }
        };
      }
    };
    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository
    );

    controller.post(mock_req, mock_res);
  });

  it('should get 400 status when call post() while other period is openning', (done) => {
    const mock_period_repository = {
      create() {
        return new Promise(resolve => resolve());
      },
      find() {
        return new Promise(resolve => resolve([{ isOpen: true }]));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id'
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(400);
        return {
          send(error) {
            expect(error.message).toBe(
              'Invalid operation: other period is openning'
            );
            done();
          }
        };
      }
    };
    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository
    );

    controller.post(mock_req, mock_res);
  });
});
