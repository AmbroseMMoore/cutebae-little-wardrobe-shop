
const express = require('express');
const router = express.Router();
const pool = require('../index');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Create a new order
router.post('/', auth, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user.id;
    
    // Create order
    const order = await client.query(
      `INSERT INTO orders 
        (user_id, status, total_amount, shipping_address, payment_method) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, 'pending', totalAmount, shippingAddress, paymentMethod]
    );
    
    const orderId = order.rows[0].id;
    
    // Add order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items 
          (order_id, product_id, variant_id, quantity, price) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.variantId, item.quantity, item.price]
      );
      
      // Update inventory
      await client.query(
        `UPDATE product_variants 
         SET stock = stock - $1 
         WHERE id = $2`,
        [item.quantity, item.variantId]
      );
    }
    
    await client.query('COMMIT');
    
    // Get full order details
    const result = await pool.query(`
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product', (SELECT row_to_json(p) FROM products p WHERE p.id = oi.product_id),
            'variant', (SELECT row_to_json(v) FROM product_variants v WHERE v.id = oi.variant_id),
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id
    `, [orderId]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await pool.query(`
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product', (SELECT row_to_json(p) FROM products p WHERE p.id = oi.product_id),
            'variant', (SELECT row_to_json(v) FROM product_variants v WHERE v.id = oi.variant_id),
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    
    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const order = await pool.query(`
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product', (SELECT row_to_json(p) FROM products p WHERE p.id = oi.product_id),
            'variant', (SELECT row_to_json(v) FROM product_variants v WHERE v.id = oi.variant_id),
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1 AND (o.user_id = $2 OR $3 = true)
      GROUP BY o.id
    `, [id, userId, req.isAdmin || false]);
    
    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingId, carrier } = req.body;
    
    const order = await pool.query(
      `UPDATE orders 
       SET status = $1, tracking_id = $2, carrier = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING *`,
      [status, trackingId, carrier, id]
    );
    
    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product', (SELECT row_to_json(p) FROM products p WHERE p.id = oi.product_id),
            'variant', (SELECT row_to_json(v) FROM product_variants v WHERE v.id = oi.variant_id),
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items,
        (SELECT row_to_json(u) FROM users u WHERE u.id = o.user_id) as user
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    
    const params = [];
    
    if (status) {
      query += ` WHERE o.status = $1`;
      params.push(status);
    }
    
    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;
    
    const orders = await pool.query(query, params);
    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create return request
router.post('/:id/return', auth, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { reason, items } = req.body;
    const userId = req.user.id;
    
    // Check if order exists and belongs to user
    const orderCheck = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Create return request
    const return_req = await client.query(
      `INSERT INTO returns 
        (order_id, user_id, status, reason) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [id, userId, 'pending', reason]
    );
    
    const returnId = return_req.rows[0].id;
    
    // Add return items
    for (const item of items) {
      await client.query(
        `INSERT INTO return_items 
          (return_id, order_item_id, quantity, reason) 
         VALUES ($1, $2, $3, $4)`,
        [returnId, item.orderItemId, item.quantity, item.reason]
      );
    }
    
    await client.query('COMMIT');
    
    // Get return details
    const result = await pool.query(`
      SELECT r.*,
        json_agg(
          json_build_object(
            'id', ri.id,
            'orderItem', (SELECT row_to_json(oi) FROM order_items oi WHERE oi.id = ri.order_item_id),
            'quantity', ri.quantity,
            'reason', ri.reason
          )
        ) as items
      FROM returns r
      LEFT JOIN return_items ri ON r.id = ri.return_id
      WHERE r.id = $1
      GROUP BY r.id
    `, [returnId]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// Update return status (Admin only)
router.put('/returns/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const return_req = await pool.query(
      `UPDATE returns 
       SET status = $1, admin_notes = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [status, adminNotes, id]
    );
    
    if (return_req.rows.length === 0) {
      return res.status(404).json({ message: 'Return not found' });
    }
    
    res.json(return_req.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
