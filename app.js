const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config/config');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/api', routes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// static or docs route could be added

module.exports = app;
