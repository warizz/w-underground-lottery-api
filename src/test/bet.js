const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const { Bet, Period } = require('../models/index');

describe('bet', () => {
  const period = {};
  const bet = {};

  before((done) => {
    Bet.remove().then(() => {
      Period.findOne({}, (err, doc) => {
        period.id = doc.id;
        done();
      });
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
      const bet = {};
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
      const bet = {};
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
      const bet = {};
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
      const bet = {};
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
      const bet = {};
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
      const bet = {};
      bet.number = '82';
      bet.price1 = 10;
      bet.price2 = 20;
      bet.price3 = 30;
      bet.period = period.id;

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
            expect(doc.id).toBe(res.body.period);
            done();
          });
        });
    });
  });

  describe('GET /period', () => {
    it('should get latest period with bets', (done) => {
      request(app)
        .get('/api/period')
        .set('x-access-token', 'xxxx')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body._id).toBe(period.id);
          expect(res.body.bets[0].number).toBe('82');
          expect(res.body.bets[0].price1).toBe(10);
          expect(res.body.bets[0].price2).toBe(20);
          expect(res.body.bets[0].price3).toBe(30);
          bet.id = res.body.bets[0]._id;
          done();
        });
    });
  });

  describe('POST /bets', () => {
    it('should insert many bets', (done) => {
      const updates = [
        { number: '845', price1: 100, price2: 100, price3: 100 },
        { number: '695', price1: 100, price2: 100, price3: 100 },
        { number: '20', price1: 100, price2: 100, price3: 100 },
      ];
      request(app)
        .post(`/api/bets/${period.id}`)
        .set('x-access-token', 'xxxx')
        .expect(201)
        .send(updates)
        .end((err) => {
          if (err) {
            done(err);
          }
          Period
            .findOne()
            .sort('-createdAt')
            .populate({
              match: { createdBy: 'awefawefaewfaf' },
              path: 'bets',
              select: 'id createdBy number price1 price2 price3',
            })
            .select('id createdAt endedAt bets')
            .exec((error, doc) => {
              expect(doc.bets.length).toBe(4);
              done();
            });
        });
    });
  });

  describe('PATCH /bet', () => {
    it('should update bet new price', (done) => {
      const updated = {
        price1: 100,
        price2: 200,
        price3: 300,
      };
      request(app)
        .patch(`/api/bet/${bet.id}`)
        .set('x-access-token', 'xxxx')
        .expect(200)
        .send(updated)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.price1).toBe(100);
          expect(res.body.price2).toBe(200);
          expect(res.body.price3).toBe(300);
          done();
        });
    });
  });

  describe('PATCH /bets', () => {
    it('should set user\'s bets to paid', (done) => {
      const data = {
        userId: 'awefawefaewfaf',
        update: {
          isPaid: true,
        }
      };
      request(app)
        .patch(`/api/bets/${period.id}`)
        .set('x-access-token', 'xxxx')
        .expect(200)
        .send(data)
        .end((err) => {
          if (err) {
            done(err);
          }
          Period
            .findOne()
            .sort('-createdAt')
            .populate({
              match: { createdBy: 'awefawefaewfaf' },
              path: 'bets',
              select: '-createdAt -createdBy -period -__v'
            })
            .select('-createdAt -createdBy -__v ')
            .exec((error, doc) => {
              expect(doc.bets[0].isPaid).toBe(true);
              done();
            });
        });
    });

    it('should set user\'s bets to un-paid', (done) => {
      const data = {
        userId: 'awefawefaewfaf',
        update: {
          isPaid: false,
        }
      };
      request(app)
        .patch(`/api/bets/${period.id}`)
        .set('x-access-token', 'xxxx')
        .expect(200)
        .send(data)
        .end((err) => {
          if (err) {
            done(err);
          }
          Period
            .findOne()
            .sort('-createdAt')
            .populate({
              match: { createdBy: 'awefawefaewfaf' },
              path: 'bets',
              select: '-createdAt -createdBy -period -__v'
            })
            .select('-createdAt -createdBy -__v ')
            .exec((error, doc) => {
              expect(doc.bets[0].isPaid).toBe(false);
              done();
            });
        });
    });
  });

  describe('GET /history', () => {
    it('should get history list', (done) => {
      request(app)
        .get('/api/history')
        .set('x-access-token', 'xxxx')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.length).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe('DELETE /bet', () =>{
    it('should delete a bet', (done) => {
      request(app)
        .delete(`/api/bet/${bet.id}`)
        .set('x-access-token', 'xxxx')
        .expect(200)
        .end((err) => {
          if (err) {
            done(err);
          }
          Bet.findById(bet.id, (err, doc) => {
            expect(doc).toNotExist();
            Period.findOne({ 'bets': bet.id }, (err2, doc2) => {
              expect(doc2).toNotExist();
              done();
            });
          });
        });
    });
  });
});
