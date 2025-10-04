const express = require('express');
const router = express.Router();
const pool = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Fetch all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products ORDER BY "createdAt" DESC');
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
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
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
        const newProduct = await pool.query(
            'INSERT INTO products (name, price, "imageUrl", category, description, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
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
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const deleteOp = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
