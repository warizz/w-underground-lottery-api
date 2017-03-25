const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const { Bet, Period } = require('../models/index');

describe('bet', () => {
  const period = {};

  before((done) => {
    Period.findOne({}, (err, doc) => {
      period.id = doc.id;
      done();
    });
  });

  describe('POST /bet', () => {
    it('should get 401 code', (done) => {
      request(app)
        .post('/api/bet')
        .expect(401)
        .end(() => done());
    });

    it('should get 400 error with message Bet validation failed (number = xxx)', (done) => {
      const bet = new Bet();
      bet.number = 'xxx';
      bet.price1 = 10;

      request(app)
        .post('/api/bet')
        .set('x-access-token', 'xxxx')
        .send(bet)
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Bet validation failed');
          done();
        });
    });

    it('should get 400 error with message Bet validation failed (number = \'\')', (done) => {
      const bet = new Bet();
      bet.number = '';
      bet.price1 = 10;

      request(app)
        .post('/api/bet')
        .set('x-access-token', 'xxxx')
        .send(bet)
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Bet validation failed');
          done();
        });
    });

    it('should get 400 error with message Price validation failed (all prices undefined)', (done) => {
      const bet = new Bet();
      bet.number = '28';

      request(app)
        .post('/api/bet')
        .set('x-access-token', 'xxxx')
        .send(bet)
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Bet validation failed');
          done();
        });
    });

    it('should get 400 error with message Price validation failed (all prices 0)', (done) => {
      const bet = new Bet();
      bet.number = '28';
      bet.price1 = 0;
      bet.price2 = 0;
      bet.price3 = 0;

      request(app)
        .post('/api/bet')
        .set('x-access-token', 'xxxx')
        .send(bet)
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Bet validation failed');
          done();
        });
    });

    it('should get 400 error with message Price validation failed (no period included)', (done) => {
      const bet = new Bet();
      bet.number = '82';
      bet.price1 = 10;
      bet.price2 = 20;
      bet.price3 = 30;

      request(app)
        .post('/api/bet')
        .set('x-access-token', 'xxxx')
        .send(bet)
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Bet validation failed');
          done();
        });
    });

    it('should create a new bet', (done) => {
      const bet = new Bet();
      bet.number = '82';
      bet.price1 = 10;
      bet.price2 = 20;
      bet.price3 = 30;
      bet._period = period.id;

      request(app)
        .post('/api/bet')
        .set('x-access-token', 'xxxx')
        .send(bet)
        .expect(201)
        .end((err, res) => {
          expect(res.body.number).toBe('82');
          expect(res.body.price1).toBe(10);
          expect(res.body.price2).toBe(20);
          expect(res.body.price3).toBe(30);
          Period.findOne({ 'bets': res.body._id }, (err, doc) => {
            expect(doc.id).toBe(res.body._period);
            done();
          });
        });
    });
  });

  describe('GET /bet', () => {
    it('should get latest period with bets', (done) => {
      request(app)
        .get('/api/bet')
        .set('x-access-token', 'xxxx')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body._id).toBe(period.id);
          expect(res.body.bets.length).toBeGreaterThan(0);
          done();
        });
    });
  });
});
