const express = require('express');
const router = express.Router();
const getClient = require('../db').getClient;
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Fetch all active products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pool = require('../db');
    // Note: This now only fetches non-archived products.
    // Assumes a column `isArchived` (BOOLEAN DEFAULT false) exists on the products table.
    const products = await pool.query('SELECT * FROM products WHERE "isArchived" = false ORDER BY "createdAt" DESC');
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/products/:id
// @desc    Fetch a single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pool = require('../db');
        // Also check "isArchived" flag here to prevent direct navigation to archived products
        const product = await pool.query('SELECT * FROM products WHERE id = $1 AND "isArchived" = false', [req.params.id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, price, imageUrl, category, description, stock } = req.body;
    try {
        const pool = require('../db');
        // When creating a product, it is active by default.
        const newProduct = await pool.query(
            'INSERT INTO products (name, price, "imageUrl", category, description, stock, "isArchived") VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *',
            [name, price, imageUrl, category, description, stock]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { name, price, imageUrl, category, description, stock } = req.body;
    try {
        const pool = require('../db');
        // Note: This does not update the `isArchived` status. Deleting/Archiving is a separate action.
        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, price = $2, "imageUrl" = $3, category = $4, description = $5, stock = $6 WHERE id = $7 RETURNING *',
            [name, price, imageUrl, category, description, stock, req.params.id]
        );
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/products/:id
// @desc    Archive a product if it's in orders, otherwise delete it.
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    const client = await getClient();
    try {
        await client.query('BEGIN');

        // Check if the product is part of any order
        const orderItemsResult = await client.query(
            'SELECT 1 FROM order_items WHERE "productId" = $1 LIMIT 1',
            [req.params.id]
        );

        let result;
        let message;

        if (orderItemsResult.rows.length > 0) {
            // Product is in an order, so archive it (soft delete)
            result = await client.query(
                'UPDATE products SET "isArchived" = true WHERE id = $1',
                [req.params.id]
            );
            message = 'Product archived successfully';
        } else {
            // Product is not in any order, so delete it permanently (hard delete)
            result = await client.query(
                'DELETE FROM products WHERE id = $1',
                [req.params.id]
            );
            message = 'Product deleted successfully';
        }

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Product not found' });
        }

        await client.query('COMMIT');
        res.json({ msg: message });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});


module.exports = router;