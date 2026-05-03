const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { validateProduct } = require('../middlewares/product.validator');

// POST /products
router.post('/', validateProduct, productController.createProduct);

// GET /products
router.get('/', productController.getProducts);

module.exports = router;