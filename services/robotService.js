const { controlClient, statusClient } = require('./tcpClientService');

/*
Example API numbers - adjust if your robot doc uses different:
2005 - open loop motion (set vx,vy,w)
1007 - battery req (status)
1004 - location req
*/
const API = {
  OPEN_LOOP_MOTION: 2010,
  RELOCATION: 2002,
  BATTERY_REQ: 1007,
  LOCATION_REQ: 1004,
  NAV_STATUS_REQ: 1020
};

async function moveOpenLoop({ vx = 0, vy = 0, w = 0, duration = 2000 }) {
  const body = { vx, vy, w, duration };
  const res = await controlClient.sendRequest(API.OPEN_LOOP_MOTION, body, 3000);
  console.log("Body:", body)
  return res.json || res;
}

async function stopMotion() {
  // sending zero speeds
  return moveOpenLoop({ vx: 0, vy: 0, w: 0 });
}

async function getBattery(simple = true) {
  const body = simple ? { simple: true } : {};
  const res = await statusClient.sendRequest(API.BATTERY_REQ, body, 3000);
  return res.json || res;
}

async function getLocation() {
  const res = await statusClient.sendRequest(API.LOCATION_REQ, null, 3000);
  return res.json || res;
}

async function getNavStatus(simple = true) {
  const res = await statusClient.sendRequest(API.NAV_STATUS_REQ, simple ? { simple: true } : null, 3000);
  return res.json || res;
}

module.exports = { moveOpenLoop, stopMotion, getBattery, getLocation, getNavStatus };
