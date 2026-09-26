/**
 * routes/categories.js
 * ------------------------------------------------------------
 * RESTful API endpoints for event categories.
 *
 * Endpoints:
 *   GET    /api/categories      -> list all categories
 *   POST   /api/categories      -> add a new custom category
 *   DELETE /api/categories/:id  -> delete a custom category
 * ------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../event_db');

// ------------------------------------------------------------
// GET /api/categories
// Return all categories (used by the search page filter dropdown).
// ------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT category_id, category_name, description, is_custom FROM categories ORDER BY category_name'
    );
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('GET /api/categories error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// ------------------------------------------------------------
// POST /api/categories
// Add a new custom category (is_custom = 1).
// ------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    // Check for duplicate name
    const [existing] = await pool.query('SELECT category_id FROM categories WHERE category_name = ?', [category_name]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Category with this name already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (category_name, description, is_custom) VALUES (?, ?, 1)',
      [category_name, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category_id: result.insertId, category_name, is_custom: 1 }
    });
  } catch (err) {
    console.error('POST /api/categories error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// ------------------------------------------------------------
// DELETE /api/categories/:id
// Delete a category. Only custom categories (is_custom = 1)
// can be deleted. Initial seed data is protected.
// ------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    // Check if category exists and whether it is custom
    const [rows] = await pool.query('SELECT category_id, is_custom FROM categories WHERE category_id = ?', [categoryId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (rows[0].is_custom === 0) {
      return res.status(403).json({ success: false, message: 'Initial seed categories cannot be deleted' });
    }

    // Check if any events use this category
    const [used] = await pool.query('SELECT COUNT(*) AS cnt FROM events WHERE category_id = ?', [categoryId]);
    if (used[0].cnt > 0) {
      return res.status(409).json({ success: false, message: 'Cannot delete: events are still linked to this category' });
    }

    await pool.query('DELETE FROM categories WHERE category_id = ?', [categoryId]);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/categories/:id error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

module.exports = router;
