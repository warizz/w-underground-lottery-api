const GetPeriodsResultsUseCase = ({ resultGateway, periodRepository }) => {
  return {
    async invoke(periodId) {
      const result = await resultGateway.getLatest();
      await periodRepository.update(periodId, { result });
    },
  };
};

module.exports = GetPeriodsResultsUseCase;
