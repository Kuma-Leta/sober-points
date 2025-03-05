const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Company name
  industry: { type: String }, // Optional industry field
  subscriptionType: {
    type: String,
    enum: ["Free", "Basic", "Premium", "Enterprise"],
    default: "Free"
  }, // Subscription level
  createdAt: { type: Date, default: Date.now },
  logo: { type: String }, 
  settings: {
    markup: { type: Number, default: 1.0 }, // Default markup for company pricing
    surcharge: { type: Number, default: 0.0 }, // Any additional costs
    exchangeRates: { type: Number, default: 1.0 } // Currency exchange rate multiplier
  },

  isActive: { type: Boolean, default: true } // Whether the company is active or not
});

module.exports = mongoose.model("Company", companySchema);
