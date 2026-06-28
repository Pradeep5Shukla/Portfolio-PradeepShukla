// routes/contact.js
const express = require('express');
const router  = express.Router();
const { sendMessage, getMessages } = require('../controllers/contactController');

router.post('/',   sendMessage);
router.get('/',    getMessages);   /* Remove or protect in production */

module.exports = router;
