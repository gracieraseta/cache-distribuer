const request = require('supertest');
const app = require('../src/app');
const { client } = require('../src/cacheClient');

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
  await client.quit();
});

describe('Cache Distribué - Tests API', () => {

  test('GET /api/produits/1 - retourne un produit', async () => {
    const res = await request(app).get('/api/produits/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('nom');
    expect(res.body.data.id).toBe(1);
  });

  test('GET /api/produits/1 - deuxième appel vient du cache', async () => {
    await request(app).get('/api/produits/1');
    const res = await request(app).get('/api/produits/1');
    expect(res.body.source).toBe('CACHE');
  });

  test('GET /api/produits/99 - produit inexistant retourne 404', async () => {
    const res = await request(app).get('/api/produits/99');
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/cache/1 - invalide le cache', async () => {
    const res = await request(app).delete('/api/cache/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('1');
  });

  test('GET /api/produits/1 - après suppression cache, vient de la BD', async () => {
    await request(app).delete('/api/cache/1');
    const res = await request(app).get('/api/produits/1');
    expect(res.body.source).toBe('BASE DE DONNÉES');
  });

});