const mongoose = require("mongoose");

const LineItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Example: "Design/Detailing/Engineering"
    applicableTo: [{ type: String, enum: ["Permanent", "Semi-Permanent", "Retail", "Tradeshow"] }], // Where it applies
    cost: { type: Number, required: true }, // Default cost
    description: { type: String }
  });
  
  module.exports = mongoose.model("LineItem", LineItemSchema);
  