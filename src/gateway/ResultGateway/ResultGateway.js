const ResultGateway = (axios) => {
  return {
    getLatest() {
      return axios
        .request({
          method: 'GET',
          baseURL: process.env.RESULT_API_URL,
          url: '/latest',
        })
        .then(res => res.data);
    },
  };
};

module.exports = ResultGateway;
