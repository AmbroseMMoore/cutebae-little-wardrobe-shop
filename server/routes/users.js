
const express = require('express');
const router = express.Router();
const pool = require('../index');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await pool.query(
      `SELECT id, name, email, phone, address, created_at
       FROM users 
       WHERE id = $1`,
      [userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;
    
    const updatedUser = await pool.query(
      `UPDATE users 
       SET name = $1, phone = $2, address = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, phone, address`,
      [name, phone, address, userId]
    );
    
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to wishlist
router.post('/wishlist', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    
    // Check if already in wishlist
    const existing = await pool.query(
      'SELECT * FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }
    
    // Add to wishlist
    await pool.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)',
      [userId, productId]
    );
    
    res.status(201).json({ message: 'Item added to wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user wishlist
router.get('/wishlist', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const wishlist = await pool.query(
      `SELECT w.id, w.created_at,
        (SELECT row_to_json(p) FROM products p WHERE p.id = w.product_id) as product
       FROM wishlists w
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );
    
    res.json(wishlist.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/wishlist/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    
    await pool.query(
      'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make user an admin (Admin only)
router.put('/:id/role', [auth, adminAuth], async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (role !== 'user' && role !== 'admin') {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
