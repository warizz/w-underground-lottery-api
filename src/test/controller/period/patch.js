const expect = require('expect');
const { PeriodController } = require('../../../controller/index');

describe('patch()', () => {
  it('should get status: 401 when call patch() with user_id not exist (PATCH /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      },
      update() {
        return new Promise(resolve => resolve({ n_modified: 1 }));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: false }));
      }
    };
    const mock_req = {
      body: {},
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
      mock_user_repository
    );

    controller.patch(mock_req, mock_res);
  });

  it('should get status: 401 when call patch() with isAdmin = false (PATCH /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      },
      update() {
        return new Promise(resolve => resolve({}));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: false }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
      body: {},
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
      mock_user_repository
    );

    controller.patch(mock_req, mock_res);
  });

  it('should get status: 400 when call patch() with wrong query_type (PATCH /periods/all)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve());
      },
      update() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
      body: {},
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
      mock_user_repository
    );

    controller.patch(mock_req, mock_res);
  });

  it('should get status: 400 when call patch() with period not exist (PATCH /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve());
      },
      update() {
        return new Promise(resolve => resolve());
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
      body: {
        isOpen: false
      },
      params: {
        query_type: 'latest'
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(400);
        return {
          send(error) {
            expect(error.message).toBe('Invalid operation: period not found');
            done();
          }
        };
      }
    };
    const controller = new PeriodController(
      mock_period_repository,
      mock_user_repository
    );

    controller.patch(mock_req, mock_res);
  });

  it('should get status: 400 when call patch() with period not updated (PATCH /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      },
      update() {
        return new Promise(resolve => resolve({ n_modified: 0 }));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
      body: {
        isOpen: false
      },
      params: {
        query_type: 'latest'
      }
    };
    const mock_res = {
      status(code) {
        expect(code).toBe(400);
        return {
          send(error) {
            expect(error.message).toBe(
              'Invalid operation: period was not updated'
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

    controller.patch(mock_req, mock_res);
  });

  it('should get status: 500 when call patch() with repositry internal error (PATCH /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      },
      update() {
        return new Promise((resolve, reject) => reject());
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
      body: {
        isOpen: false
      },
      params: {
        query_type: 'latest'
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

    controller.patch(mock_req, mock_res);
  });

  it('should get status: 200 when call patch() with isOpen (PATCH /periods/latest)', (done) => {
    const mock_period_repository = {
      get_latest() {
        return new Promise(resolve => resolve({}));
      },
      update() {
        return new Promise(resolve => resolve({ n_modified: 1 }));
      }
    };
    const mock_user_repository = {
      find_by_id() {
        return new Promise(resolve => resolve({ isAdmin: true }));
      }
    };
    const mock_req = {
      user_id: 'user_id',
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
      mock_user_repository
    );

    controller.patch(mock_req, mock_res);
  });
  //
  // it('should get status: 400 when call patch() with incorrect result (PATCH /periods/latest)', (done) => {
  //   const mock_period_repository = {
  //     get_latest() {
  //       return new Promise(resolve => resolve());
  //     },
  //     update() {
  //       return new Promise(resolve => resolve({ n_modified: 1 }));
  //     }
  //   };
  //   const mock_user_repository = {};
  //   const mock_bet_repository = {};
  //   const mock_req = {
  //     body: {
  //       result: {
  //         six: 'six',
  //         firstThree: 'firstThree',
  //         secondThree: 'secondThree',
  //         thirdThree: 'thirdThree',
  //         fourthThree: 'fourthThree',
  //         two: 'two'
  //       }
  //     },
  //     params: {
  //       query_type: 'latest'
  //     }
  //   };
  //   const mock_res = {
  //     status(code) {
  //       expect(code).toBe(200);
  //       return {
  //         json(info) {
  //           expect(info.n_modified).toBe(1);
  //           done();
  //         }
  //       };
  //     }
  //   };
  //   const controller = new PeriodController(
  //     mock_period_repository,
  //     mock_user_repository,
  //     mock_bet_repository
  //   );
  //
  //   controller.patch(mock_req, mock_res);
  // });
  //
  // it('should get status: 200 when call patch() with result (PATCH /periods/latest)', (done) => {
  //   const mock_period_repository = {
  //     get_latest() {
  //       return new Promise(resolve => resolve());
  //     },
  //     update() {
  //       return new Promise(resolve => resolve({ n_modified: 1 }));
  //     }
  //   };
  //   const mock_user_repository = {};
  //   const mock_bet_repository = {};
  //   const mock_req = {
  //     body: {
  //       result: {
  //         six: '111111',
  //         firstThree: '222',
  //         secondThree: '333',
  //         thirdThree: '444',
  //         fourthThree: '555',
  //         two: '66'
  //       }
  //     },
  //     params: {
  //       query_type: 'latest'
  //     }
  //   };
  //   const mock_res = {
  //     status(code) {
  //       expect(code).toBe(200);
  //       return {
  //         json(info) {
  //           expect(info.n_modified).toBe(1);
  //           done();
  //         }
  //       };
  //     }
  //   };
  //   const controller = new PeriodController(
  //     mock_period_repository,
  //     mock_user_repository,
  //     mock_bet_repository
  //   );
  //
  //   controller.patch(mock_req, mock_res);
  // });
});
