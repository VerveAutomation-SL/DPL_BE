const BaseIP = require('../models/baseIP');

// Create new BaseIP
exports.createBaseIP = async (req, res) => {
  try {
    const { URL_IP } = req.body;

    // Check if a record already exists
    const existing = await BaseIP.findOne();

    if (existing) {
      // Update the existing record
      existing.URL_IP = URL_IP;
      await existing.save();
      return res.status(200).json({ message: 'BaseIP updated', data: existing });
    }

    // Otherwise, create a new one
    const newEntry = await BaseIP.create({ URL_IP });
    res.status(201).json({ message: 'BaseIP created', data: newEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all BaseIPs
exports.getAllBaseIPs = async (req, res) => {
  try {
    const entries = await BaseIP.findAll();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete BaseIP by ID
exports.deleteBaseIP = async (req, res) => {
  try {
    const entry = await BaseIP.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Not found' });

    await entry.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
