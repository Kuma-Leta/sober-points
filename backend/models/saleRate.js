const mongoose = require("mongoose");

const SellRateSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }, // Client association
    projectType: { type: String, enum: ["Permanent", "Semi-Permanent", "Retail", "Tradeshow"], required: true },
    laborRate: { type: Number, required: true }, // Cost per hour
    markup: { type: Number, required: true }, // Percentage markup
    additionalFees: [{ name: String, amount: Number }] // Other costs like maintenance, rentals, etc.
  });
  
  module.exports = mongoose.model("SellRate", SellRateSchema);
  