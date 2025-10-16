const net = require('net');
const { buildPacket, parsePacket } = require('../utils/wellwitProtocol');
const EventEmitter = require('events');
const config = require('../config/config');

class TCPClient extends EventEmitter {
  constructor(ip, port, name) {
    super();
    this.ip = ip;
    this.port = port;
    this.name = name;
    this.client = null;
    this.buffer = Buffer.alloc(0);
    this.pending = new Map(); // serial -> {resolve, reject, timeout}
    this.connect();
  }

  connect() {
    this.client = new net.Socket();
    this.client.connect(this.port, this.ip, () => {
      this.emit('connected', { name: this.name, ip: this.ip, port: this.port });
      console.log(`[TCPClient:${this.name}] connected ${this.ip}:${this.port}`);
    });

    this.client.on('data', (data) => {
      this.buffer = Buffer.concat([this.buffer, data]);
      // try parse one packet at a time
      while (this.buffer.length >= 16) {
        const length = this.buffer.readUInt32BE(4);
        const total = 16 + length;
        if (this.buffer.length < total) break;
        const packet = this.buffer.slice(0, total);
        this.buffer = this.buffer.slice(total);
        const parsed = parsePacket(packet);
        if (parsed) {
          // emit event for all
          this.emit('packet', parsed);
          const serial = parsed.serial;
          if (this.pending.has(serial)) {
            const p = this.pending.get(serial);
            clearTimeout(p.timeout);
            p.resolve(parsed);
            this.pending.delete(serial);
          }
        }
      }
    });

    this.client.on('close', () => {
      console.log(`[TCPClient:${this.name}] closed. reconnecting in 2s...`);
      this.emit('closed');
      setTimeout(() => this.connect(), 2000);
    });

    this.client.on('error', (err) => {
      console.error(`[TCPClient:${this.name}] error`, err.message);
      this.emit('error', err);
    });
  }

  /**
   * send API request, return Promise that resolves with parsed response
   * @param {number} apiNumber
   * @param {Object|null} data
   * @param {number} timeoutMs
   */
  sendRequest(apiNumber, data = null, timeoutMs = 4000) {
    return new Promise((resolve, reject) => {
      const packet = buildPacket(apiNumber, data);
      const serial = packet.readUInt16BE(2); // sequence used in buildPacket
      // write
      try {
        this.client.write(packet);
      } catch (e) {
        return reject(e);
      }
      // store pending
      const to = setTimeout(() => {
        this.pending.delete(serial);
        reject(new Error('timeout'));
      }, timeoutMs);
      this.pending.set(serial, { resolve, reject, timeout: to });
    });
  }
}

const controlClient = new TCPClient(config.robot.ip, config.robot.controlPort, 'control');
const statusClient = new TCPClient(config.robot.ip, config.robot.statusPort, 'status');
const naviClient = new TCPClient(config.robot.ip, config.robot.naviPort, 'navi');
const otherClient = new TCPClient(config.robot.ip, config.robot.otherPort, 'other');
const ConfigurationClient = new TCPClient(config.robot.ip, config.robot.ConfigurationPort, 'Configuration');

module.exports = { controlClient, statusClient,naviClient, otherClient, ConfigurationClient };
