
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all customers
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await db.query(
            'SELECT id, "firstName", "paternalLastName", email, address FROM users WHERE role = $1 ORDER BY "createdAt" DESC',
            ['customer']
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    const { firstName, paternalLastName, maternalLastName, address } = req.body;
    try {
        const updatedUser = await db.query(
            'UPDATE users SET "firstName" = $1, "paternalLastName" = $2, "maternalLastName" = $3, address = $4 WHERE id = $5 RETURNING id, "firstName", "paternalLastName", "maternalLastName", email, address, role',
            [firstName, paternalLastName, maternalLastName, address, req.user.id]
        );
        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const userResult = await db.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        }
        
        if (newPassword.length < 6) {
             return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

        res.json({ message: 'Password updated successfully' });

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
        const deleteOp = await db.query('DELETE FROM users WHERE id = $1 AND role = $2', [req.params.id, 'customer']);
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
