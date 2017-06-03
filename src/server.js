require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const cors = require('cors');
const controllers = require('./controllers/index');
const { ControllerFactory } = require('./factory/index');
require('./cron/result');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const controller_factory = new ControllerFactory();
const user_controller = controller_factory.create('user');

const router = express.Router();

router
  .route('/bet')
  .all(user_controller.authenticate)
  .post(controllers.bet.post);

router
  .route('/bet/:id')
  .all(user_controller.authenticate)
  .patch(controllers.bet.patch)
  .delete(controllers.bet.remove);

router
  .route('/bets/:periodId')
  .all(user_controller.authenticate)
  .patch(controllers.bets.patch)
  .post(controllers.bets.post);

router
  .route('/history')
  .all(user_controller.authenticate)
  .get(controllers.history.get);

router.route('/me').all(user_controller.authenticate).get(user_controller.get);

router.route('/log_in').post(controllers.user.post);

router
  .route('/log_out')
  .all(user_controller.authenticate)
  .patch(controllers.user.logOut);

router
  .route('/period')
  .all(user_controller.authenticate)
  .get(controllers.period.get)
  .post(controllers.period.post);

router
  .route('/period/:id')
  .all(user_controller.authenticate)
  .patch(controllers.period.patch);

router
  .route('/summary/:period_id')
  .all(user_controller.authenticate)
  .get(controllers.summary.get);

app.use('/api', router);
app.listen(process.env.PORT);

module.exports = app;
