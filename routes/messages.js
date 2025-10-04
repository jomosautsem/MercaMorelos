const express = require('express');
const router = express.Router();
const pool = require('../db');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/messages
// @desc    Get all messages for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const messages = await pool.query(
            'SELECT m.id, u_from.role as from, m."fromId", m."toId", m.text, m.timestamp, m.read FROM messages m JOIN users u_from ON m."fromId" = u_from.id WHERE m."fromId" = $1 OR m."toId" = $1 ORDER BY m.timestamp ASC',
            [req.user.id]
        );
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
    const { toId, text } = req.body;
    try {
        const newMessage = await pool.query(
            'INSERT INTO messages ("fromId", "toId", text) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, toId, text]
        );
        
        const result = await pool.query('SELECT m.id, u_from.role as from, m."fromId", m."toId", m.text, m.timestamp, m.read FROM messages m JOIN users u_from ON m."fromId" = u_from.id WHERE m.id = $1', [newMessage.rows[0].id]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/messages/read
// @desc    Mark messages as read
// @access  Private
router.put('/read', protect, async (req, res) => {
    const { fromId } = req.body; // The other person in the chat
    try {
        await pool.query(
            'UPDATE messages SET read = true WHERE "toId" = $1 AND "fromId" = $2',
            [req.user.id, fromId]
        );
        res.status(200).json({ msg: 'Messages marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
