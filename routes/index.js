const express = require('express');
const router = express.Router();
const robotCtrl = require('../controllers/robotController');
const taskCtrl = require('../controllers/taskController');

// Robot endpoints
router.post('/move', robotCtrl.postMove);
router.post('/stop', robotCtrl.postStop);
router.get('/status/battery', robotCtrl.getBattery);
router.get('/status/location', robotCtrl.getLocation);
router.get('/status/nav', robotCtrl.getNavStatus);

// // Task endpoints
// router.post('/tasks', taskCtrl.createTask);
// router.get('/tasks', taskCtrl.listTasks);

module.exports = router;
