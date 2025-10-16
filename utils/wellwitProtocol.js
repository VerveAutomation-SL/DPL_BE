const { Buffer } = require('buffer');

let seqCounter = 1;
function nextSeq() {
  seqCounter = (seqCounter + 1) & 0xffff;
  if (seqCounter === 0) seqCounter = 1;
  return seqCounter;
}

/**
 * Build a Wellwit TCP packet.
 * @param {number} apiNumber - message type (API number)
 * @param {Object|null} jsonObj - data area
 * @returns Buffer
 */
function buildPacket(apiNumber, jsonObj) {
  const json = jsonObj ? JSON.stringify(jsonObj) : '';
  const dataBuf = Buffer.from(json, 'utf8');
  const header = Buffer.alloc(16);
  header.writeUInt8(0x5A, 0);          // sync
  header.writeUInt8(0x01, 1);          // version
  header.writeUInt16BE(nextSeq(), 2);  // serial
  header.writeUInt32BE(dataBuf.length, 4); // length
  header.writeUInt16BE(apiNumber, 8);  // api number (message type)
  // reserved 6 bytes (zero)
  return Buffer.concat([header, dataBuf]);
}

/**
 * Parse buffer into { header, json, apiNumber, serial, length }
 * Returns null if buffer too small.
 */
function parsePacket(buf) {
  if (!buf || buf.length < 16) return null;
  const sync = buf.readUInt8(0);
  if (sync !== 0x5A) return null;
  const version = buf.readUInt8(1);
  const serial = buf.readUInt16BE(2);
  const length = buf.readUInt32BE(4);
  const apiNumber = buf.readUInt16BE(8);
  const data = buf.slice(16, 16 + length);
  let json = null;
  try { json = data.length ? JSON.parse(data.toString('utf8')) : null; } catch(e){ json = null; }
  return { header: { sync, version, serial, length, apiNumber }, apiNumber, serial, length, json };
}

module.exports = { buildPacket, parsePacket };
