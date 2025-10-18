

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

// --- WISHLIST ROUTES ---

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
    try {
        const wishlistProductsResult = await db.query(
            `SELECT 
                p.*,
                COALESCE(r.avg_rating, 0) as "averageRating", 
                COALESCE(r.review_count, 0) as "reviewCount"
             FROM products p
             JOIN wishlist w ON p.id = w."productId"
             LEFT JOIN (
                SELECT 
                  "productId", 
                  AVG(rating) as avg_rating, 
                  COUNT(id) as review_count 
                FROM reviews 
                GROUP BY "productId"
             ) r ON p.id = r."productId"
             WHERE w."userId" = $1 AND p."isArchived" = false`,
            [req.user.id]
        );
        
        const products = wishlistProductsResult.rows.map(p => ({
            ...p,
            price: parseFloat(p.price),
            averageRating: parseFloat(p.averageRating),
            reviewCount: parseInt(p.reviewCount, 10),
        }));

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/users/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist', protect, async (req, res) => {
    const { productId } = req.body;
    try {
        // Use ON CONFLICT to prevent duplicate entries
        await db.query(
            'INSERT INTO wishlist ("userId", "productId") VALUES ($1, $2) ON CONFLICT ("userId", "productId") DO NOTHING',
            [req.user.id, productId]
        );
        res.status(201).json({ msg: 'Product added to wishlist' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/users/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM wishlist WHERE "userId" = $1 AND "productId" = $2',
            [req.user.id, req.params.productId]
        );
        res.json({ msg: 'Product removed from wishlist' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;