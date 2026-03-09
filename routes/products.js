var express = require('express');
var router = express.Router();
const productModel = require('../schemas/products');
const { checkLogin, checkRole } = require('../utils/authHandler');

// GET all products - Everyone (No login required)
router.get('/', async function (req, res, next) {
    try {
        const products = await productModel.find({ isDeleted: false });
        res.send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET single product
router.get('/:id', async function (req, res, next) {
    try {
        const product = await productModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!product) return res.status(404).send({ message: "Sản phẩm không tồn tại" });
        res.send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// CREATE product - Mod, Admin
router.post('/', checkLogin, checkRole(['mod', 'admin']), async function (req, res, next) {
    try {
        const newProduct = new productModel(req.body);
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE product - Mod, Admin
router.put('/:id', checkLogin, checkRole(['mod', 'admin']), async function (req, res, next) {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).send({ message: "Sản phẩm không tồn tại" });
        res.send(updatedProduct);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE product - Admin only
router.delete('/:id', checkLogin, checkRole(['admin']), async function (req, res, next) {
    try {
        const deletedProduct = await productModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!deletedProduct) return res.status(404).send({ message: "Sản phẩm không tồn tại" });
        res.send({ message: "Xóa thành công" });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
