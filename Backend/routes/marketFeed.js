const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET: Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// POST: Create a new order
router.post("/", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { symbol, price, side, quantity, offer_price, offer_size } = req.body;

    // Validate required fields
    if (!symbol || !price || !side || !quantity) {
      return res.status(400).json({ error: "Missing required fields: symbol, price, side, and quantity" });
    }

    // Convert side to uppercase
    const normalizedSide = side.toUpperCase();
    if (!["BUY", "SELL"].includes(normalizedSide)) {
      return res.status(400).json({ error: "Side must be either 'BUY' or 'SELL'" });
    }

    // Ensure numeric fields are valid
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity, 10);
    const parsedOfferPrice = parseFloat(offer_price) || 0;
    const parsedOfferSize = parseInt(offer_size, 10) || 0;

    if (isNaN(parsedPrice) || isNaN(parsedQuantity) || isNaN(parsedOfferPrice) || isNaN(parsedOfferSize)) {
      return res.status(400).json({ error: "Price, quantity, offer_price, and offer_size must be valid numbers" });
    }

    const newOrder = new Order({
      symbol,
      price: parsedPrice,
      side: normalizedSide,
      quantity: parsedQuantity,
      offer_price: parsedOfferPrice,
      offer_size: parsedOfferSize,
    });

    await newOrder.save(); // Save the order to the database
    res.status(201).json({ message: "Order created successfully", data: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// GET: Fetch top-of-book for a specific symbol
router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const topOrders = await Order.aggregate([
      { $match: { symbol } },
      { $sort: { price: -1 } },
      { $group: { _id: "$price", size: { $sum: "$quantity" } } },
      { $limit: 1 },
    ]);

    if (!topOrders || topOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for the given symbol" });
    }

    res.status(200).json(topOrders[0]);
  } catch (error) {
    console.error("Error fetching top-of-book:", error);
    res.status(500).json({ message: "Failed to fetch top-of-book" });
  }
});

// DELETE: Delete all orders
router.delete("/", async (req, res) => {
  try {
    await Order.deleteMany(); // Delete all orders from the database
    res.status(200).json({ message: "All orders removed successfully" });
  } catch (error) {
    console.error("Error deleting orders:", error);
    res.status(500).json({ message: "Failed to delete orders" });
  }
});

module.exports = router;
