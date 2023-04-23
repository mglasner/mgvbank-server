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

// transfer
router.patch("/users/transfer/", async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    if (!from) {
      return res.status(400).send({ error: "from parameter not found" });
    }
    if (!to) {
      return res.status(400).send({ error: "to parameter not found" });
    }
    if (!amount) {
      return res.status(400).send({ error: "amount parameter not found" });
    }

    const fromUser = await Model.findOne({ email: from });
    const toUser = await Model.findOne({ email: to });

    if (!fromUser) {
      return res.status(404).send({ error: `user ${from} not found` });
    }
    if (!toUser) {
      return res.status(404).send({ error: `user ${to} not found` });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).send({ error: "amount must be a number" });
    }

    const balance = fromUser.history.reduce((acc, val) => acc + val.amount, 0);
    if (parsedAmount > balance) {
      return res.status(400).send({ error: "not enough funds" });
    }

    fromUser.history.push({
      type: "transfer",
      to: toUser.email,
      amount: -1 * parsedAmount,
    });
    toUser.history.push({
      type: "transfer",
      from: fromUser.email,
      amount: parsedAmount,
    });

    await fromUser.save();
    await toUser.save();

    res.json({
      status: `transfer succeeded from ${fromUser.email} to ${toUser.email}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
