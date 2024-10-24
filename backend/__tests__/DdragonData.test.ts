import {
    getChampions,
  } from '../src/DdragonData';

describe('Ddragon ', () => {
    it('champions data', async () => {
        const response = await getChampions();
        expect(response.status).toBe(200);
    });
});


