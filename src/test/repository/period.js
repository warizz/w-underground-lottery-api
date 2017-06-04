const expect = require('expect');
const { Period } = require('../../models/index');
const { PeriodRepository } = require('../../repository/index');

describe('Period', function() {
  this.timeout(120000); // for mockgoose
  const mongoose = require('mongoose');
  const Promise = require('bluebird');
  mongoose.Promise = Promise;
  const _repository = new PeriodRepository(Period);
  let _period = {};

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

  it('should not get any item when call get_latest()', (done) => {
    _repository
      .get_latest()
      .then((res) => {
        expect(res).toNotExist();
        done();
      })
      .catch(done);
  });

  it('should success when call create() with correct input', (done) => {
    const data = {
      createdBy: 'createdBy',
      endedAt: new Date(2017, 1, 1)
    };
    _repository.create(data).then(done).catch(done);
  });

  it('should get latest item when call get_latest()', (done) => {
    _repository
      .get_latest()
      .then((res) => {
        expect(res).toExist();
        _period = res;
        done();
      })
      .catch(done);
  });

  it('should get an item when call find() with isOpen = true', (done) => {
    _repository.find({ isOpen: true }).then((res) => {
      expect(res.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should success when call update() with isOpen = false', (done) => {
    const data = {
      isOpen: false
    };
    _repository
      .update(_period.id, data)
      .then((res) => {
        expect(res.n_modified).toBe(1);
        done();
      })
      .catch(done);
  });

  it('should get an error when call update() with incorrect result', (done) => {
    const data = {
      result: {
        six: 'six',
        firstThree: 'firstThree',
        secondThree: 'secondThree',
        thirdThree: 'thirdThree',
        fourthThree: 'fourthThree',
        two: 'two'
      }
    };
    _repository.update(_period.id, data).then(done).catch((error) => {
      expect(error).toExist();
      done();
    });
  });

  it('should success when call update() with correct result', (done) => {
    const data = {
      result: {
        six: '111111',
        firstThree: '222',
        secondThree: '333',
        thirdThree: '444',
        fourthThree: '555',
        two: '66'
      }
    };
    _repository
      .update(_period.id, data)
      .then((res) => {
        expect(res.n_modified).toBe(1);
        done();
      })
      .catch(done);
  });

  after(() => {
    mongoose.connection.close();
  });
});
