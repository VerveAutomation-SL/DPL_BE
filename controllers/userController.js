const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();


// ✅ Register User
exports.Adminregister = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const AdminUserData = {
      email,
      password: hashedPassword,
      full_name,
      role
    };

    // Create the user
    await User.create(AdminUserData);

    // Return success response
    res.status(201).json({ message: "Admin or ShopAdmin registered successfully" });
  } catch (error) {
    console.error("Validation Error Details:", error.errors); // Log validation errors
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.Adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const Adminuser = await User.findOne({ where: { email } });

    if (!Adminuser) {
      return res.status(401).json({ message: "Invalid Email or Email not Found" })
    }

    const isMatch = await bcrypt.compare(password, Adminuser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: Adminuser.id,
        email: Adminuser.email,
        role: Adminuser.role, // include the role
      },
      "your_jwt_secret", // better to use env var
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful", token,
      Adminuser: {
        id: Adminuser.id,
        full_name: Adminuser.full_name,
        email: Adminuser.email,
        role: Adminuser.role
      }
    });
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

exports.controllerlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const controllerUser = await User.findOne({ where: { email, role: 'controller' } });
    if (!controllerUser) {
      return res.status(401).json({ message: "Invalid Email or Email not Found" });
    }
    const isMatch = await bcrypt.compare(password, controllerUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate a JWT token
    const token = jwt.sign(
      {
        id: controllerUser.id,
        email: controllerUser.email,
        role: controllerUser.role,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION }
    );
    res.json({
      message: "Login successful", token,
      controllerUser: {
        id: controllerUser.id,
        full_name: controllerUser.full_name,
        email: controllerUser.email,
        role: controllerUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const users = await User.findAll({
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, password } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (role) user.role = role;

    // If password provided, hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
