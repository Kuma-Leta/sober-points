const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    company: { type: String },
    customRates: [{ type: mongoose.Schema.Types.ObjectId, ref: "SellRate" }], // Client-specific sell rates
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Client", ClientSchema);
  