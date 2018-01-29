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
    const useCase = Uut({ resultGateway, periodRepository });
    await useCase.invoke('mock-id');
    expect(resultGateway.getLatest).toHaveBeenCalledTimes(1);
    expect(periodRepository.update).toHaveBeenCalledWith('mock-id', { result: mockResult });
  });
});
