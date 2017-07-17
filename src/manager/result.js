const http = require('http');

function ResultManager(period_repository) {
  const _fetch_result = () =>
    new Promise((resolve, reject) =>
      http.get(process.env.RESULT_API, (response) => {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => resolve(body));
        response.on('error', error => reject(error));
      })
    );

  this.update = () =>
    _fetch_result().then((res) => {
      if (!res) {
        throw new Error('No data from target');
      }

      period_repository.get_latest().then((doc) => {
        if (!doc) {
          throw new Error('Can not find any period');
        }

        const res_obj = JSON.parse(res);

        const { endedAt = new Date() } = doc;
        const {
          date,
          six,
          front_three_1,
          front_three_2,
          rear_three_1,
          rear_three_2,
          two,
        } = res_obj;
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
          return period_repository.update(doc.id, update);
        }
      });
    });
}

module.exports = ResultManager;
