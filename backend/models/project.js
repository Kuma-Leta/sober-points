const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Project Name
  type: { type: String, enum: ["Permanent", "Semi-Permanent", "Retail", "Tradeshow"], required: true },
  lineItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "LineItem" }], // Reference to LineItems
  reportTypes: [{ type: String }], // Customizable reports from the matrix
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);
