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

//Get by email Method
router.get("/users/email/:email", async (req, res) => {
  try {
    const data = await Model.findOne({ email: req.params.email });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Make deposit
router.patch("/users/deposit/:email", async (req, res) => {
  try {
    const user = await Model.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send({ error: "user not found" });
    }
    if (!req.body.deposit) {
      return res.status(404).send({ error: "deposit not found" });
    }
    const deposit = Number(req.body.deposit);
    if (isNaN(deposit)) {
      return res.status(400).send({ error: "deposit must be a number" });
    }
    user.history.push(req.body.deposit);
    await user.save();
    res.json({ status: "deposit succed", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
