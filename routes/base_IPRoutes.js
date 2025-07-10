const express = require('express');
const router = express.Router();
const baseipController = require('../controllers/BaseIPController');

router.post('/', baseipController.createBaseIP);
router.get('/', baseipController.getAllBaseIPs);
router.delete('/:id', baseipController.deleteBaseIP);

module.exports = router;
