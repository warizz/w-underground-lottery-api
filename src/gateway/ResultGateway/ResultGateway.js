const ResultGateway = (axios) => {
  return {
    getLatest() {
      return axios
        .request({
          method: 'GET',
          baseURL: 'https://lottery-result-crawler.herokuapp.com/api',
          url: '/latest',
        })
        .then(res => res.data);
    },
  };
};

module.exports = ResultGateway;
