var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');
const { checkLogin, checkRole } = require('../utils/authHandler');

// READ ALL - Admin, Mod
router.get('/', checkLogin, checkRole(['admin', 'mod']), async function (req, res, next) {
  try {
    const users = await userModel.find({ isDeleted: false }).populate('role');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// CREATE, UPDATE, DELETE - Admin only
router.post('/', checkLogin, checkRole(['admin']), async function (req, res, next) {
  // Logic for creating user admin-side
  res.send({ message: "Admin created user" });
});

router.put('/:id', checkLogin, checkRole(['admin']), async function (req, res, next) {
  try {
    const updated = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', checkLogin, checkRole(['admin']), async function (req, res, next) {
  try {
    await userModel.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.send({ message: "Xóa thành công" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
