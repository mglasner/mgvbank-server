const express = require("express");
const Model = require("../models/model");
const router = express.Router();

module.exports = router;

//Post Method
router.post("/users", async (req, res) => {
  const data = new Model({ name: req.body.name, email: req.body.email });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/users", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/users/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/email/:email", async (req, res) => {
  try {
    const data = await Model.findOne({ email: req.params.email });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
