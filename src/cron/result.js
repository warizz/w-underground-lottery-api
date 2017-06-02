const CronJob = require('cron').CronJob;
const axios = require('axios');
const Period = require('../models/period');

new CronJob(
  // run 3 times every 1st and 16th of every months
  '*/20 00 16 1,16 * *',
  function() {
    axios.get(process.env.RESULT_API).then((res) => {
      if (!res.data) {
        return;
      }

      Period.findOne().sort('-createdAt').select('_id endedAt').then((doc) => {
        if (!doc) {
          return;
        }
        if (doc.result) {
          return;
        }

        const { endedAt = new Date() } = doc;
        const {
          date,
          six,
          front_three_1,
          front_three_2,
          rear_three_1,
          rear_three_2,
          two
        } = res.data;
        // only update to period end date match with result's date
        if (
          endedAt.year === date.year &&
          endedAt.month === date.month &&
          endedAt.date === date.date
        ) {
          const update = {
            result: {
              six,
              firstThree: front_three_1,
              secondThree: front_three_2,
              thirdThree: rear_three_1,
              fourthThree: rear_three_2,
              two
            }
          };
          Period.where({ _id: doc.id }).findOne().update(update).then();
        }
      });
    });
  },
  null,
  true,
  'Asia/Bangkok'
);
