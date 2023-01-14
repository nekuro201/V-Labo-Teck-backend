const mongoose = require("mongoose");

const Serie = new mongoose.Schema({
  indexSequence: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  exerciceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercice",
    required: true,
  }
});

module.exports = mongoose.model("Serie", Serie);