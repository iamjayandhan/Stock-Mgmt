const express = require('express');
const { createStock, getStocks, updateStock, deleteStock } = require('../controllers/stockController');

const router = express.Router();

// Routes for stock operations
router.post('/', createStock);      // Create
router.get('/', getStocks);         // Read
router.put('/:id', updateStock);    // Update
router.delete('/:id', deleteStock); // Delete

module.exports = router;
