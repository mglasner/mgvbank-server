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
    user.history.push({ type: "deposit", amount: deposit });
    await user.save();
    res.json({ status: "deposit succed", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Make withdraw
router.patch("/users/withdraw/:email", async (req, res) => {
  try {
    const user = await Model.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send({ error: "user not found" });
    }
    if (!req.body.withdraw) {
      return res.status(404).send({ error: "withdraw not found" });
    }
    const withdraw = Number(req.body.withdraw);
    if (isNaN(withdraw)) {
      return res.status(400).send({ error: "withdraw must be a number" });
    }
    const balance = user.history.reduce((acc, val) => acc + val, 0);
    if (withdraw > balance) {
      return res.status(400).send({ error: "not enough found" });
    }
    user.history.push({ type: "withdraw", amount: -1 * withdraw });
    await user.save();
    res.json({ status: "withdraw succed", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Make transfer
router.patch("/users/transfer/", async (req, res) => {
  try {
    const fromUser = await Model.findOne({ email: req.body.from });
    const toUser = await Model.findOne({ email: req.body.to });
    if (!req.body.from) {
      return res.status(404).send({ error: "from parameter not found" });
    }
    if (!req.body.to) {
      return res.status(404).send({ error: "to parameter not found" });
    }
    if (!req.body.amount) {
      return res.status(404).send({ error: "amount parameter not found" });
    }
    if (!fromUser) {
      return res.status(404).send({ error: `user ${req.body.from} not found` });
    }
    if (!toUser) {
      return res.status(404).send({ error: `user ${req.body.to} not found` });
    }
    const amount = Number(req.body.amount);
    if (isNaN(amount)) {
      return res.status(400).send({ error: "amount must be a number" });
    }
    const balance = fromUser.history.reduce((acc, val) => acc + val, 0);
    if (amount > balance) {
      return res.status(400).send({ error: "not enough found" });
    }
    fromUser.history.push({
      type: "transfer",
      to: toUser.email,
      amount: -1 * amount,
    });
    toUser.history.push({
      type: "transfer",
      from: fromUser.email,
      amount: amount,
    });

    await fromUser.save();
    await toUser.save();
    res.json({
      status: `transfer succed from ${fromUser.email} to ${toUser.email}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
