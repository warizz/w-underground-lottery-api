const expect = require('expect');
const { PeriodController } = require('../../../controller/index');

describe('get()', () => {
  it('should get status: 400 when call get() with wrong query_type (GET /periods/xxx)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_bet_repository = {
      find() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_req = {
      query: {},
      params: {
        query_type: 'xxx'
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(400);
        return {
          send(error) {
            expect(error.message).toBe('Invalid argument: query_type');
            done();
          }
        };
      }
    };

    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository,
      mock_bet_repository
    );
    controller.get(mock_req, mock_res);
  });

  it('should get status: 401 when call get() with no permission (GET /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: false }));
      }
    };
    const mock_bet_repository = {
      find() {
        return new Promise(resolve => resolve([]));
      }
    };
    const mock_req = {
      query: {},
      params: {
        query_type: 'latest'
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
      mock_user_repository,
      mock_bet_repository
    );
    controller.get(mock_req, mock_res);
  });

  it('should get status: 200 with data when call get() (GET /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: true }));
      }
    };
    const mock_bet_repository = {
      find() {
        return new Promise(resolve => resolve([{}]));
      }
    };
    const mock_req = {
      query: {},
      params: {
        query_type: 'latest'
      }
    };
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

    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository,
      mock_bet_repository
    );
    controller.get(mock_req, mock_res);
  });

  it('should get status: 200 with no data when call get() (GET /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ is_admin: true }));
      }
    };
    const mock_bet_repository = {
      find() {
        return new Promise(resolve => resolve([{}]));
      }
    };
    const mock_req = {
      query: {},
      params: {
        query_type: 'latest'
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(200);
        return {
          json() {
            done();
          }
        };
      }
    };

    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository,
      mock_bet_repository
    );
    controller.get(mock_req, mock_res);
  });

  it('should get status: 200 with data when call get() (GET /periods/latest?user=user)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({}));
      }
    };
    const mock_bet_repository = {
      find() {
        return new Promise(resolve => resolve([]));
      }
    };
    const mock_req = {
      query: {
        user: 'user'
      },
      params: {
        query_type: 'latest'
      }
    };
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
    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository,
      mock_bet_repository
    );

    controller.get(mock_req, mock_res);
  });
});
