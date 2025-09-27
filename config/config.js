// D:\VERVE PROJECTS\DPL\dpl_be\config.js
require('dotenv').config();
module.exports = {
  robot: {
    ip: process.env.ROBOT_IP || '192.168.192.5',
    controlPort: Number(process.env.ROBOT_CONTROL_PORT || 19205),
    statusPort: Number(process.env.ROBOT_STATUS_PORT || 19204)
  },
  server: {
    port: Number(process.env.PORT || 3000)
  }
};