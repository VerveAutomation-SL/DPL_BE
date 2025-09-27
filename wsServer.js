const WebSocket = require('ws');
const { controlClient, statusClient } = require('./services/tcpClientService');

function startWSServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });
  wss.on('connection', (ws) => {
    console.log('WS client connected');
  });

  // forward robot packets to all WS clients
  function forward(parsed) {
    const payload = { api: parsed.apiNumber, json: parsed.json };
    const msg = JSON.stringify(payload);
    wss.clients.forEach((c) => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
  }

  controlClient.on('packet', forward);
  statusClient.on('packet', forward);

  return wss;
}

module.exports = startWSServer;
