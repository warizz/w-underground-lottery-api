const expect = require('expect');
const { PeriodController } = require('../../controller/index');

describe('Period', () => {
  describe('post()', () => {
    it('should get 401 status when call post() with no permission', (done) => {
      const mock_period_repository = {
        create() {
          return new Promise(resolve => resolve());
        }
      };
      const mock_user_repository = {
        find_by_id() {
          return new Promise(resolve => resolve());
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
        }
      };
      const mock_user_repository = {
        find_by_id() {
          return new Promise(resolve => resolve());
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
          expect(code).toBe(200);
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
        }
      };
      const mock_user_repository = {
        find_by_id() {
          return new Promise(resolve => resolve());
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

  describe('get()', () => {
    it('should get status: 200 with data when call get() (GET /periods/latest)', (done) => {
      const mock_period_repository = {
        create() {
          return new Promise(resolve => resolve({}));
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {
        find() {
          return new Promise(resolve => resolve([]));
        }
      };
      const mock_req = {
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

    it('should get status: 200 with data when call get() (GET /periods/latest?user=user)', (done) => {
      const mock_period_repository = {
        create() {
          return new Promise(resolve => resolve({}));
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {
        find() {
          return new Promise(resolve => resolve([]));
        }
      };
      const mock_req = {
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

    it('should get status: 200 with data when call get() (GET /periods/all?user=user&size=10)', (done) => {
      const mock_period_repository = {
        create() {
          return new Promise(resolve => resolve([{}]));
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {
        find() {
          return new Promise(resolve => resolve([]));
        }
      };
      const mock_req = {
        params: {
          query_type: 'latest'
        },
        query: {
          user: 'user',
          size: 10
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

  describe('patch()', () => {
    it('should get status: 400 when call patch() with wrong query_type (PATCH /periods/all)', (done) => {
      const mock_period_repository = {
        get_latest() {
          return new Promise(resolve => resolve());
        },
        update() {
          return new Promise(resolve => resolve());
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {};
      const mock_req = {
        body: {
          isOpen: false
        },
        params: {
          query_type: 'all'
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

      controller.patch(mock_req, mock_res);
    });

    it('should get status: 200 when call patch() with isOpen (PATCH /periods/latest)', (done) => {
      const mock_period_repository = {
        get_latest() {
          return new Promise(resolve => resolve());
        },
        update() {
          return new Promise(resolve => resolve({ n_modified: 1 }));
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {};
      const mock_req = {
        body: {
          isOpen: false
        },
        params: {
          query_type: 'latest'
        }
      };
      const mock_res = {
        status(code) {
          expect(code).toBe(200);
          return {
            json(info) {
              expect(info.n_modified).toBe(1);
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

      controller.patch(mock_req, mock_res);
    });

    it('should get status: 400 when call patch() with incorrect result (PATCH /periods/latest)', (done) => {
      const mock_period_repository = {
        get_latest() {
          return new Promise(resolve => resolve());
        },
        update() {
          return new Promise(resolve => resolve({ n_modified: 1 }));
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {};
      const mock_req = {
        body: {
          result: {
            six: 'six',
            firstThree: 'firstThree',
            secondThree: 'secondThree',
            thirdThree: 'thirdThree',
            fourthThree: 'fourthThree',
            two: 'two'
          }
        },
        params: {
          query_type: 'latest'
        }
      };
      const mock_res = {
        status(code) {
          expect(code).toBe(200);
          return {
            json(info) {
              expect(info.n_modified).toBe(1);
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

      controller.patch(mock_req, mock_res);
    });

    it('should get status: 200 when call patch() with result (PATCH /periods/latest)', (done) => {
      const mock_period_repository = {
        get_latest() {
          return new Promise(resolve => resolve());
        },
        update() {
          return new Promise(resolve => resolve({ n_modified: 1 }));
        }
      };
      const mock_user_repository = {};
      const mock_bet_repository = {};
      const mock_req = {
        body: {
          result: {
            six: '111111',
            firstThree: '222',
            secondThree: '333',
            thirdThree: '444',
            fourthThree: '555',
            two: '66'
          }
        },
        params: {
          query_type: 'latest'
        }
      };
      const mock_res = {
        status(code) {
          expect(code).toBe(200);
          return {
            json(info) {
              expect(info.n_modified).toBe(1);
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

      controller.patch(mock_req, mock_res);
    });
  });
});
