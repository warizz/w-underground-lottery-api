const Uut = require('./');

describe('getLatest', () => {
  test('on success', async () => {
    const mockResult = {
      date: '2018-01-17T00:00:00.000Z',
      six: '203823',
      front_three_1: '624',
      front_three_2: '799',
      rear_three_1: '236',
      rear_three_2: '397',
      two: '50',
    };
    const mockAxios = {
      request() {
        return Promise.resolve({ data: mockResult });
      },
    };
    const result = await Uut(mockAxios).getLatest();
    expect(result).toEqual(mockResult);
  });
});
