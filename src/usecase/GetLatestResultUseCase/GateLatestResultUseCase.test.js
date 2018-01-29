const Uut = require('./');

describe('invoke', () => {
  test('on success', async () => {
    const mockResult = {};
    const resultGateway = {
      getLatest: jest.fn(async () => mockResult),
    };
    const periodRepository = {
      update: jest.fn(async () => {}),
    };
    const useCase = Uut({ periodId: 'mock-id', resultGateway, periodRepository });
    await useCase.invoke();
    expect(resultGateway.getLatest).toHaveBeenCalledTimes(1);
    expect(periodRepository.update).toHaveBeenCalledWith('mock-id', { result: mockResult });
  });
});
