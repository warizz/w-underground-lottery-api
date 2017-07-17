const axios = require('axios');
const Period = require('../models/period');

function ResultManager(period_repository) {
  this.update = () => {
    return new Promise((resolve, reject) => {
      axios.get(process.env.RESULT_API).then((res) => {
        if (!res.data) {
          reject(new Error('No data from target'));
        }

        period_repository.get_latest().then((doc) => {
          if (!doc) {
            reject(new Error('Can not find any period'));
          }
          if (doc.result) {
            resolve();
          }

          const { endedAt = new Date() } = doc;
          const {
            date,
            six,
            front_three_1,
            front_three_2,
            rear_three_1,
            rear_three_2,
            two,
          } = res.data;
          // only update to period end date match with result's date
          if (endedAt.getTime() === new Date(date).getTime()) {
            const update = {
              result: {
                six,
                firstThree: front_three_1,
                secondThree: front_three_2,
                thirdThree: rear_three_1,
                fourthThree: rear_three_2,
                two,
              },
            };
            return Period.where({ _id: doc.id }).findOne().update(update);
          }
        });
      });
    });
  };
}

module.exports = ResultManager;
