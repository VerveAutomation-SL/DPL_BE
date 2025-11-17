const WebSocket = require('ws');
const { controlClient, statusClient } = require('./services/tcpClientService');
const { moveOpenLoop, stopMotion } = require('./services/robotService');

function startWSServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });
  wss.on('connection', (ws) => {
    console.log('WS client connected');

    ws.on('message', async (message) => {
      try {
        const parsed = JSON.parse(message);
        console.log('Received WS message:', parsed);

        let response;

        const { type, vx, vy, w, duration } = parsed;

        switch (type) {
          case 'MOVE':
            response = await moveOpenLoop({ vx, vy, w, duration });
            break;
          case 'STOP':
            response = await stopMotion();
            break;
          case 'ESTOP':
            response = await Estop(1);
            break;
          case 'ESTOP_RELEASE':
            response = await Estop(0);
            break;
          default:
            console.warn('Unknown action:', type);
            return;
        }
        console.log('➡️ Sent to robot, response:', response);

        ws.send(JSON.stringify({ type: 'robot_response', data: response }));

      } catch (error) {
        console.error('Error parsing WS message:', error);
      }
    });
  });

  // forward robot packets to all WS clients
  function forward(parsed) {
    const payload = { api: parsed.apiNumber, json: parsed.json };
    const msg = JSON.stringify(payload);
    console.log('Forwarding packet to WS clients:', msg);
    wss.clients.forEach((c) => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
  }

  controlClient.on('packet', forward);
  statusClient.on('packet', forward);

  return wss;
}

module.exports = startWSServer;
