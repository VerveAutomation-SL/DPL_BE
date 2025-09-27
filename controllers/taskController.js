// const { Task } = require('../models');

// async function createTask(req, res) {
//   try {
//     const { name, targetStation, payload } = req.body;
//     const task = await Task.create({ name, targetStation, payload });
//     return res.json({ ok: true, task });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ ok: false, error: err.message });
//   }
// }

// async function listTasks(req, res) {
//   try {
//     const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
//     return res.json({ ok: true, tasks });
//   } catch (err) {
//     return res.status(500).json({ ok: false, error: err.message });
//   }
// }

// module.exports = { createTask, listTasks };
