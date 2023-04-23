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
  history: {
    type: [
      {
        type: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        from: {
          type: String,
          required: false,
        },
        to: {
          type: String,
          required: false,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Data", dataSchema);
