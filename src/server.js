require('./config');

const express = require('express');
const mongoose = require('mongoose');
const Promise = require("bluebird");
const bodyParser = require('body-parser');
const cors = require('cors');
const controllers = require('./controllers/index');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const authenticator = controllers.middleware.facebookAuthenticator;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));

const router = express.Router();

router.route('/bet')
  .all(authenticator)
  .post(controllers.bet.post);

router.route('/bet/:id')
  .all(authenticator)
  .patch(controllers.bet.patch)
  .delete(controllers.bet.remove);

router.route('/bets/:periodId')
  .all(authenticator)
  .patch(controllers.bets.patch)
  .post(controllers.bets.post);

router.route('/history')
  .all(authenticator)
  .get(controllers.history.get);

router.route('/me')
  .all(authenticator)
  .get(controllers.user.get);

router.route('/log_in')
  .post(controllers.user.post);

router.route('/log_out')
  .patch(controllers.user.logOut);

router.route('/period')
  .all(authenticator)
  .get(controllers.period.get)
  .post(controllers.period.post);

router.route('/period/:id')
  .all(authenticator)
  .patch(controllers.period.patch);

router.route('/summary/:period_id')
  .all(authenticator)
  .get(controllers.summary.get);

app.use('/api', router);
app.use((err, req, res, next) => res.status(400).send(err));
app.listen(process.env.PORT, () => console.log(`app running on port:${process.env.PORT}`));

module.exports = app;
