
const express = require('express');
const router = express.Router();
const pool = require('../index');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, ageGroup, color, size } = req.query;
    
    let query = `
      SELECT p.*, 
        json_agg(DISTINCT jsonb_build_object('id', v.id, 'color', v.color, 'size', v.size, 'stock', v.stock, 'image', v.image)) as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
    `;
    
    const conditions = [];
    const params = [];
    let paramCounter = 1;
    
    if (category) {
      conditions.push(`p.category = $${paramCounter}`);
      params.push(category);
      paramCounter++;
    }
    
    if (ageGroup) {
      conditions.push(`p.age_group = $${paramCounter}`);
      params.push(ageGroup);
      paramCounter++;
    }
    
    if (color) {
      conditions.push(`v.color = $${paramCounter}`);
      params.push(color);
      paramCounter++;
    }
    
    if (size) {
      conditions.push(`v.size = $${paramCounter}`);
      params.push(size);
      paramCounter++;
    }
    
    if (conditions.length) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await pool.query(`
      SELECT p.*, 
        json_agg(DISTINCT jsonb_build_object('id', v.id, 'color', v.color, 'size', v.size, 'stock', v.stock, 'image', v.image)) as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', [auth, adminAuth], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      name,
      price,
      description,
      category,
      ageGroup,
      featured,
      variants
    } = req.body;
    
    // Insert base product
    const newProduct = await client.query(
      `INSERT INTO products 
        (name, price, description, category, age_group, featured) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, price, description, category, ageGroup, featured || false]
    );
    
    const productId = newProduct.rows[0].id;
    
    // Insert variants
    for (const variant of variants) {
      await client.query(
        `INSERT INTO product_variants 
          (product_id, color, size, stock, image) 
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, variant.color, variant.size, variant.stock, variant.image]
      );
    }
    
    await client.query('COMMIT');
    
    // Get the full product with variants
    const result = await pool.query(`
      SELECT p.*, 
        json_agg(DISTINCT jsonb_build_object('id', v.id, 'color', v.color, 'size', v.size, 'stock', v.stock, 'image', v.image)) as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [productId]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// Update product (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      name,
      price,
      description,
      category,
      ageGroup,
      featured,
      variants
    } = req.body;
    
    // Check if product exists
    const product = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product
    await client.query(
      `UPDATE products 
       SET name = $1, price = $2, description = $3, category = $4, age_group = $5, featured = $6, updated_at = NOW()
       WHERE id = $7`,
      [name, price, description, category, ageGroup, featured, id]
    );
    
    // Delete existing variants
    await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    
    // Insert new variants
    for (const variant of variants) {
      await client.query(
        `INSERT INTO product_variants 
          (product_id, color, size, stock, image) 
         VALUES ($1, $2, $3, $4, $5)`,
        [id, variant.color, variant.size, variant.stock, variant.image]
      );
    }
    
    await client.query('COMMIT');
    
    // Get updated product
    const result = await pool.query(`
      SELECT p.*, 
        json_agg(DISTINCT jsonb_build_object('id', v.id, 'color', v.color, 'size', v.size, 'stock', v.stock, 'image', v.image)) as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// Delete product (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Check if product exists
    const product = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete variants first (foreign key constraint)
    await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    
    // Delete product
    await client.query('DELETE FROM products WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    
    res.json({ message: 'Product removed' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
