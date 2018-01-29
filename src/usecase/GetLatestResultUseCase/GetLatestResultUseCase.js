const GetLatestResultUseCase = ({ periodId, resultGateway, periodRepository }) => {
  return {
    async invoke() {
      const result = await resultGateway.getLatest();
      await periodRepository.update(periodId, { result });
    },
  };
};

module.exports = GetLatestResultUseCase;
