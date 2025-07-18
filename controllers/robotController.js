// controllers/robot.controller.js
const axios = require('axios');

// Replace with your actual robot IP

exports.getTaskList = async (req, res) => {
  try {
    const {ROBOT_BASE_URL} = req.body
    const response = await axios.get(`${ROBOT_BASE_URL}/task_list`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch tasks:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks from robot." });
  }
};

exports.executeTask = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await axios.post(`${ROBOT_BASE_URL}/execute_task`, { id });
    res.json(response.data);
  } catch (error) {
    console.error("Task execution failed:", error.message);
    res.status(500).json({ error: "Failed to execute task on robot." });
  }
};
