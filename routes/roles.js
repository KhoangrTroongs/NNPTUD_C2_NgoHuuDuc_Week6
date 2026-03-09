var express = require("express");
var router = express.Router();
let roleModel = require("../schemas/roles");
const { checkLogin, checkRole } = require("../utils/authHandler");

// READ ALL - Admin, Mod
router.get("/", checkLogin, checkRole(['admin', 'mod']), async function (req, res, next) {
    try {
        let roles = await roleModel.find({ isDeleted: false });
        res.send(roles);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// CREATE, UPDATE, DELETE - Admin only
router.post("/", checkLogin, checkRole(['admin']), async function (req, res, next) {
    try {
        let newItem = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newItem.save();
        res.status(201).send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.put("/:id", checkLogin, checkRole(['admin']), async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) return res.status(404).send({ message: "id not found" });
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", checkLogin, checkRole(['admin']), async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!updatedItem) return res.status(404).send({ message: "id not found" });
        res.send({ message: "Xóa thành công" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;
