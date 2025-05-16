
const pool = require('../index');

module.exports = async function(req, res, next) {
  try {
    const user = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin permission required.' });
    }

    req.isAdmin = true;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
