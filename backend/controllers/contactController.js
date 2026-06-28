// controllers/contactController.js
const Contact = require('../models/Contact');

/* POST /api/contact */
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const doc = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip: req.ip,
    });
    res.status(201).json({ message: 'Message received! I will get back to you shortly.', id: doc._id });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    next(err);
  }
};

/* GET /api/contact — Admin view (protect in production!) */
exports.getMessages = async (req, res, next) => {
  try {
    const msgs = await Contact.find().sort({ createdAt: -1 }).limit(50);
    res.json({ count: msgs.length, messages: msgs });
  } catch (err) { next(err); }
};
