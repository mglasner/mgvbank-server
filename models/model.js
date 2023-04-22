const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  balance: {
    required: true,
    type: Number,
    default: 0,
  },
  history: {
    required: true,
    type: [Number],
    default: [],
  },
});

module.exports = mongoose.model("Data", dataSchema);
