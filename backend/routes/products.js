const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Fetch all active products and their ratings
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Join with reviews to calculate average rating and review count
    const products = await db.query(`
      SELECT 
        p.*, 
        COALESCE(r.avg_rating, 0) as "averageRating", 
        COALESCE(r.review_count, 0) as "reviewCount"
      FROM products p
      LEFT JOIN (
        SELECT 
          "productId", 
          AVG(rating) as avg_rating, 
          COUNT(id) as review_count 
        FROM reviews 
        GROUP BY "productId"
      ) r ON p.id = r."productId"
      WHERE p."isArchived" = false 
      ORDER BY p."createdAt" DESC
    `);
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/products/archived
// @desc    Fetch all archived products
// @access  Private/Admin
router.get('/archived', protect, admin, async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products WHERE "isArchived" = true ORDER BY "createdAt" DESC');
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @route   GET /api/products/:id
// @desc    Fetch a single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, price, imageUrl, category, description, stock } = req.body;
    try {
        const numericStock = Number(stock) || 0;
        const isArchived = numericStock <= 0;
        const newProduct = await db.query(
            'INSERT INTO products (name, price, "imageUrl", category, description, stock, "isArchived") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, price, imageUrl, category, description, numericStock, isArchived]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product and its archived status based on stock
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { name, price, imageUrl, category, description, stock } = req.body;
    try {
        const numericStock = Number(stock) || 0;
        const isArchived = numericStock <= 0;

        const updatedProduct = await db.query(
            'UPDATE products SET name = $1, price = $2, "imageUrl" = $3, category = $4, description = $5, stock = $6, "isArchived" = $7 WHERE id = $8 RETURNING *',
            [name, price, imageUrl, category, description, numericStock, isArchived, req.params.id]
        );
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Archive a product if it's in orders, otherwise delete it.
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        const orderItemsResult = await client.query(
            'SELECT 1 FROM order_items WHERE "productId" = $1 LIMIT 1',
            [req.params.id]
        );

        let result;
        let message;

        if (orderItemsResult.rows.length > 0) {
            result = await client.query(
                'UPDATE products SET "isArchived" = true WHERE id = $1',
                [req.params.id]
            );
            message = 'Product archived successfully';
        } else {
            await client.query('DELETE FROM reviews WHERE "productId" = $1', [req.params.id]);
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
        res.status(500).json({ message: 'Server Error' });
    } finally {
        client.release();
    }
});

// --- REVIEWS ---

// @route   GET /api/products/:id/reviews
// @desc    Get all reviews for a product
// @access  Public
router.get('/:id/reviews', async (req, res) => {
    try {
        const reviews = await db.query(
            `SELECT r.id, r."productId", r."userId", r.rating, r.comment, r."createdAt" as date, 
                    u."firstName", u."paternalLastName" 
             FROM reviews r
             JOIN users u ON r."userId" = u.id
             WHERE r."productId" = $1 
             ORDER BY r."createdAt" DESC`,
            [req.params.id]
        );
        
        const formattedReviews = reviews.rows.map(r => ({
            ...r,
            userName: `${r.firstName} ${r.paternalLastName}`.trim()
        }));

        res.json(formattedReviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a review for a product
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    try {
        // 1. Verify the user has purchased and received this product
        const purchaseResult = await db.query(
            `SELECT 1 FROM orders o
             JOIN order_items oi ON o.id = oi."orderId"
             WHERE o."userId" = $1 AND oi."productId" = $2 AND o.status = 'Entregado'
             LIMIT 1`,
            [userId, productId]
        );

        if (purchaseResult.rows.length === 0) {
            return res.status(403).json({ message: 'You can only review products you have purchased and received.' });
        }
        
        // 2. Insert the review (or update if it exists, due to UNIQUE constraint)
        const newReview = await db.query(
            `INSERT INTO reviews ("productId", "userId", rating, comment)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT ("productId", "userId") DO UPDATE
             SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, "createdAt" = NOW()
             RETURNING *`,
            [productId, userId, rating, comment]
        );
        
        res.status(201).json(newReview.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server Error' });
    }
});


module.exports = router;