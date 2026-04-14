const express = require('express');
const { client } = require('./cacheClient');

const router = express.Router();
const TTL = 60; // secondes

// Simuler une base de données
const fakeDB = {
  1: { id: 1, nom: 'Produit A', prix: 100 },
  2: { id: 2, nom: 'Produit B', prix: 200 },
  3: { id: 3, nom: 'Produit C', prix: 300 },
};

// GET /produits/:id — avec cache
router.get('/produits/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `produit:${id}`;

  try {
    // 1. Vérifier dans le cache
    const cached = await client.get(cacheKey);
    if (cached) {
      return res.json({
        source: 'CACHE',
        data: JSON.parse(cached)
      });
    }

    // 2. Cache MISS — chercher en "base de données"
    const produit = fakeDB[id];
    if (!produit) {
      return res.status(404).json({ erreur: 'Produit non trouvé' });
    }

    // 3. Stocker dans le cache avec TTL
    await client.setEx(cacheKey, TTL, JSON.stringify(produit));

    return res.json({
      source: 'BASE DE DONNÉES',
      data: produit
    });

  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

// DELETE /cache/:id — invalider le cache
router.delete('/cache/:id', async (req, res) => {
  const { id } = req.params;
  await client.del(`produit:${id}`);
  res.json({ message: `Cache supprimé pour le produit ${id}` });
});

// GET /stats — statistiques du cache
router.get('/stats', async (req, res) => {
  const info = await client.info('stats');
  res.json({ redis_stats: info });
});

module.exports = router;