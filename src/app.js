require('dotenv').config();
const express = require('express');
const { connectRedis } = require('./cacheClient');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

start();

module.exports = app;