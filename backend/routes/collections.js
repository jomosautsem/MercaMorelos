const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/collections
// @desc    Fetch all collections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const collections = await db.query('SELECT * FROM collections ORDER BY name ASC');
    res.json(collections.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/collections
// @desc    Create a collection
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, icon, parentCategory } = req.body;
    try {
        const newCollection = await db.query(
            'INSERT INTO collections (name, icon, "parentCategory") VALUES ($1, $2, $3) RETURNING *',
            [name, icon, parentCategory]
        );
        res.status(201).json(newCollection.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/collections/:id
// @desc    Update a collection
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { name, icon, parentCategory } = req.body;
    try {
        const updatedCollection = await db.query(
            'UPDATE collections SET name = $1, icon = $2, "parentCategory" = $3 WHERE id = $4 RETURNING *',
            [name, icon, parentCategory, req.params.id]
        );
        if (updatedCollection.rows.length === 0) {
            return res.status(404).json({ msg: 'Collection not found' });
        }
        res.json(updatedCollection.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/collections/:id
// @desc    Delete a collection and un-assign its products
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        
        // Set collectionId to null for products in this collection
        await client.query('UPDATE products SET "collectionId" = NULL WHERE "collectionId" = $1', [req.params.id]);

        // Delete the collection
        const result = await client.query('DELETE FROM collections WHERE id = $1', [req.params.id]);
        
        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Collection not found' });
        }

        await client.query('COMMIT');
        res.json({ msg: 'Collection deleted successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;
