// routes/robot.routes.js
const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');

router.post('/task_list', robotController.getTaskList);
router.post('/execute_task', robotController.executeTask);

module.exports = router;
