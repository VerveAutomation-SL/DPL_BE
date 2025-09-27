const robotService = require('../services/robotService');

async function postMove(req, res) {
  try {
    const { vx, vy, w, duration } = req.body;
    const r = await robotService.moveOpenLoop({ vx, vy, w, duration });
    return res.json({ ok: true, result: r });
  } catch (err) {
    console.error("postMove error", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function postStop(req, res) {
  try {
    const r = await robotService.stopMotion();
    return res.json({ ok: true, result: r });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function getBattery(req, res) {
  try {
    const r = await robotService.getBattery(true);
    return res.json({ ok: true, result: r });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function getLocation(req, res) {
  try {
    const r = await robotService.getLocation();
    return res.json({ ok: true, result: r });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function getNavStatus(req, res) {
  try {
    const r = await robotService.getNavStatus(true);
    return res.json({ ok: true, result: r });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { postMove, postStop, getBattery, getLocation, getNavStatus };
