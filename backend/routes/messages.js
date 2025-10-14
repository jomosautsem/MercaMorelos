const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/messages
// @desc    Get all messages for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const messages = await db.query(
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
    let { toId, text } = req.body;
    const fromUser = req.user;

    try {
        // FIX: If a customer sends a message to the generic 'admin-user',
        // find the actual admin ID in the database and use it as the recipient.
        // This ensures messages from customers are correctly routed to the admin.
        if (fromUser.role === 'customer' && toId === 'admin-user') {
            const adminResult = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
            if (adminResult.rows.length > 0) {
                toId = adminResult.rows[0].id;
            } else {
                return res.status(500).json({ message: 'No admin user configured to receive message.' });
            }
        }

        const newMessage = await db.query(
            'INSERT INTO messages ("fromId", "toId", text) VALUES ($1, $2, $3) RETURNING *',
            [fromUser.id, toId, text]
        );
        
        const result = await db.query('SELECT m.id, u_from.role as from, m."fromId", m."toId", m.text, m.timestamp, m.read FROM messages m JOIN users u_from ON m."fromId" = u_from.id WHERE m.id = $1', [newMessage.rows[0].id]);

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
    let { fromId } = req.body; // The other person in the chat
    try {
        // FIX: Resolve the actual admin ID if the generic 'admin-user' is passed.
        // This ensures messages from the admin can be correctly marked as read by customers.
        if (fromId === 'admin-user') {
            const adminResult = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
            if (adminResult.rows.length > 0) {
                fromId = adminResult.rows[0].id;
            } else {
                 return res.status(500).json({ message: 'No admin user found to mark messages from.' });
            }
        }

        await db.query(
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