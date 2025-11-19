const express = require("express");
const router = express.Router();

const adminController = require('../controllers/userController');

router.post("/Adminregister", adminController.Adminregister);
router.post("/Adminlogin", adminController.Adminlogin);
router.post("/controllerLogin", adminController.controllerlogin)
router.get('/admins', adminController.getAllAdmins);
router.get('/admins/:id', adminController.getAdminById);
router.put('/admins/:id', adminController.updateAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);

module.exports = router;
