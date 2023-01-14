const mongoose = require("mongoose");

const Exercice = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: { 
    type: String, 
    required: true, 
  },
  series: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Serie' }]
});

module.exports = mongoose.model("Exercice", Exercice);