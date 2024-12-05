const mongoose = require("mongoose");

// Define the schema for the Order model
const orderSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  price: { 
    type: Number, 
    required: true,
    min: [0, "Price must be a positive number"], // Ensure price is positive
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, "Quantity must be at least 1"], // Ensure quantity is at least 1
  },
  offer_price: { 
    type: Number, 
    default: 0,
    min: [0, "Offer price must be a positive number"] // Ensure offer_price is positive if provided
  },
  offer_size: { 
    type: Number, 
    default: 0,
    min: [0, "Offer size must be a positive number"] // Ensure offer_size is positive if provided
  },
  timestamp: { type: Date, default: Date.now }, // Automatically set timestamp
});

// Create the Order model based on the schema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
