const express = require('express');
const router = express.Router();
const pool = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all customers
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await pool.query(
            'SELECT id, "firstName", "paternalLastName", email, address FROM users WHERE role = $1 ORDER BY "createdAt" DESC',
            ['customer']
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a customer
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const deleteOp = await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [req.params.id, 'customer']);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        res.json({ msg: 'Customer removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
