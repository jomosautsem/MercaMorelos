

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
    const productsResult = await db.query(`
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

    const products = productsResult.rows.map(p => ({
        ...p,
        price: parseFloat(p.price),
        averageRating: parseFloat(p.averageRating),
        reviewCount: parseInt(p.reviewCount, 10),
    }));

    res.json(products);
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
    const productsResult = await db.query('SELECT * FROM products WHERE "isArchived" = true ORDER BY "createdAt" DESC');
    const products = productsResult.rows.map(p => ({
        ...p,
        price: parseFloat(p.price)
    }));
    res.json(products);
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
        const productResult = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        const product = productResult.rows[0];
        res.json({ ...product, price: parseFloat(product.price) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, price, imageUrl, category, collectionId, description, stock, isArchived = false } = req.body;
    try {
        const numericStock = Number(stock) || 0;
        const finalCollectionId = collectionId || null; // Treat empty string as NULL
        const newProductResult = await db.query(
            'INSERT INTO products (name, price, "imageUrl", category, "collectionId", description, stock, "isArchived") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, price, imageUrl, category, finalCollectionId, description, numericStock, isArchived]
        );
        
        // FIX: Ensure the returned object has the same shape as the GET endpoint.
        // A new product has no reviews, so its rating is 0.
        const newProduct = {
            ...newProductResult.rows[0],
            price: parseFloat(newProductResult.rows[0].price),
            averageRating: 0,
            reviewCount: 0
        };

        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product.
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { name, price, imageUrl, category, collectionId, description, stock, isArchived } = req.body;
    try {
        const numericStock = Number(stock) || 0;
        const finalCollectionId = collectionId || null; // Treat empty string as NULL

        const updatedProductResult = await db.query(
            'UPDATE products SET name = $1, price = $2, "imageUrl" = $3, category = $4, "collectionId" = $5, description = $6, stock = $7, "isArchived" = $8 WHERE id = $9 RETURNING *',
            [name, price, imageUrl, category, finalCollectionId, description, numericStock, isArchived, req.params.id]
        );
        if (updatedProductResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        const updatedProduct = updatedProductResult.rows[0];
        res.json({ ...updatedProduct, price: parseFloat(updatedProduct.price) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/products/:id/archive
// @desc    Archive a product
// @access  Private/Admin
router.put('/:id/archive', protect, admin, async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE products SET "isArchived" = true WHERE id = $1 RETURNING id',
            [req.params.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json({ msg: 'Product archived successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/products/:id/permanent
// @desc    Delete a product permanently
// @access  Private/Admin
router.delete('/:id/permanent', protect, admin, async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        // Permanently deleting should also remove reviews, but not order items.
        await client.query('DELETE FROM reviews WHERE "productId" = $1', [req.params.id]);
        const result = await client.query('DELETE FROM products WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Product not found' });
        }

        await client.query('COMMIT');
        res.json({ msg: 'Product deleted permanently' });
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
