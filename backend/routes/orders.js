const express = require('express');
const router = express.Router();
const pool = require('../db').getClient;
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    const { cartItems, shippingInfo, total } = req.body;
    const client = await pool();

    try {
        await client.query('BEGIN');

        // 1. Check stock for all items
        for (const item of cartItems) {
            const productResult = await client.query('SELECT stock, name FROM products WHERE id = $1 FOR UPDATE', [item.id]);
            if (productResult.rows.length === 0) {
                throw new Error(`Product with ID ${item.id} not found.`);
            }
            const productInStock = productResult.rows[0];
            if (item.quantity > productInStock.stock) {
                throw new Error(`Not enough stock for ${productInStock.name}. Only ${productInStock.stock} left.`);
            }
        }

        // 2. Create the order
        const addBusinessDays = (date, days) => {
            const newDate = new Date(date);
            let addedDays = 0;
            while (addedDays < days) {
                newDate.setDate(newDate.getDate() + 1);
                const dayOfWeek = newDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday and Saturday
                    addedDays++;
                }
            }
            return newDate;
        };

        const orderDate = new Date();
        const deliveryDays = 5 + Math.floor(Math.random() * 3);
        const estimatedDeliveryDate = addBusinessDays(orderDate, deliveryDays);

        const orderResult = await client.query(
            'INSERT INTO orders ("userId", "estimatedDeliveryDate", total, "shippingInfo") VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, estimatedDeliveryDate.toISOString(), total, shippingInfo]
        );
        const newOrder = orderResult.rows[0];

        // 3. Insert order items and update stock
        for (const item of cartItems) {
            await client.query(
                'INSERT INTO order_items ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)',
                [newOrder.id, item.id, item.quantity, item.price]
            );
            // This query now also handles auto-archiving if stock reaches 0 or less
            await client.query(
                'UPDATE products SET stock = stock - $1, "isArchived" = (stock - $1 <= 0) WHERE id = $2',
                [item.quantity, item.id]
            );
        }
        
        await client.query('COMMIT');

        // 4. Fetch the full order to return
        const fullOrderResult = await client.query(
            `SELECT json_build_object(
                'id', o.id,
                'date', o.date,
                'estimatedDeliveryDate', o."estimatedDeliveryDate",
                'total', o.total,
                'status', o.status,
                'shippingInfo', o."shippingInfo",
                'items', (
                    SELECT json_agg(
                        json_build_object(
                            'id', p.id,
                            'name', p.name,
                            'imageUrl', p."imageUrl",
                            'price', oi.price,
                            'quantity', oi.quantity
                        )
                    )
                    FROM order_items oi
                    JOIN products p ON p.id = oi."productId"
                    WHERE oi."orderId" = o.id
                )
            ) as order_data
            FROM orders o
            WHERE o.id = $1`,
            [newOrder.id]
        );
        
        res.status(201).json(fullOrderResult.rows[0].order_data);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.message);
        res.status(500).json({ message: error.message || 'Server Error' });
    } finally {
        client.release();
    }
});


// @route   GET /api/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const ordersResult = await require('../db').query(
            `SELECT o.id, o.date, o."estimatedDeliveryDate", o.total, o.status
             FROM orders o
             WHERE o."userId" = $1
             ORDER BY o.date DESC`,
            [req.user.id]
        );
        res.json(ordersResult.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const orderResult = await require('../db').query(
           `SELECT json_build_object(
                'id', o.id,
                'date', o.date,
                'estimatedDeliveryDate', o."estimatedDeliveryDate",
                'total', o.total,
                'status', o.status,
                'shippingInfo', o."shippingInfo",
                'items', (
                    SELECT json_agg(
                        json_build_object(
                            'id', p.id,
                            'name', p.name,
                            'imageUrl', p."imageUrl",
                            'category', p.category,
                            'description', p.description,
                            'stock', p.stock,
                            'price', oi.price,
                            'quantity', oi.quantity
                        )
                    )
                    FROM order_items oi
                    JOIN products p ON p.id = oi."productId"
                    WHERE oi."orderId" = o.id
                )
            ) as order
            FROM orders o
            WHERE o.id = $1`,
            [req.params.id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        
        // Basic authorization: check if user is admin or the order owner
        const orderData = orderResult.rows[0].order;
        const orderOwnerId = (await require('../db').query('SELECT "userId" from orders WHERE id = $1', [req.params.id])).rows[0].userId;

        if (req.user.role !== 'admin' && orderOwnerId !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to view this order' });
        }

        res.json(orderData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- ADMIN ROUTES ---

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const ordersResult = await require('../db').query(
           `SELECT o.id, o.date, o.total, o.status, 
                   u."firstName", u."paternalLastName"
            FROM orders o
            JOIN users u ON o."userId" = u.id
            ORDER BY o.date DESC`
        );
        
        const orders = ordersResult.rows.map(order => ({
            id: order.id,
            date: order.date,
            total: order.total,
            status: order.status,
            shippingInfo: { // Mimic the old structure for the admin view
                firstName: order.firstName,
                paternalLastName: order.paternalLastName
            }
        }));

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await require('../db').query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );

        if (updatedOrder.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(updatedOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order by a user
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    const client = await pool();
    try {
        await client.query('BEGIN');
        
        const orderResult = await client.query('SELECT * FROM orders WHERE id = $1 AND "userId" = $2', [req.params.id, req.user.id]);
        
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found or you are not authorized' });
        }
        
        const orderToCancel = orderResult.rows[0];
        if(orderToCancel.status !== 'Procesando') {
            return res.status(400).json({ msg: 'Order can no longer be cancelled' });
        }

        const updatedOrder = await client.query(
            "UPDATE orders SET status = 'Cancelado' WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        
        const orderItemsResult = await client.query('SELECT "productId", quantity FROM order_items WHERE "orderId" = $1', [req.params.id]);

        // Restock items
        for (const item of orderItemsResult.rows) {
            await client.query(
                'UPDATE products SET stock = stock + $1, "isArchived" = false WHERE id = $2',
                [item.quantity, item.productId]
            );
        }

        await client.query('COMMIT');
        res.json(updatedOrder.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});


module.exports = router;