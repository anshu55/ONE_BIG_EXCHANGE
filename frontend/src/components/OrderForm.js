import React, { useState } from "react";
import api from "../services/api";

const OrderForm = () => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerSize, setOfferSize] = useState("");
  const [side, setSide] = useState(""); // New state for side
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      symbol: symbol.trim(),
      price: price ? parseFloat(price) : null,
      quantity: quantity ? parseInt(quantity, 10) : null,
      offer_price: offerPrice ? parseFloat(offerPrice) : null,
      offer_size: offerSize ? parseInt(offerSize, 10) : null,
      side: side, // Include side field
    };

    console.log("Payload being submitted:", payload);

    // Validate required fields
    if (!payload.symbol || !payload.price || !payload.quantity || !payload.side) {
      alert("Please fill in all required fields: Symbol, Price, Quantity, and Side.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/api/market-feed", payload);
      console.log("Order added successfully:", response.data);
      alert("Order added successfully!");

      // Reset form after submission
      setSymbol("");
      setPrice("");
      setQuantity("");
      setOfferPrice("");
      setOfferSize("");
      setSide("");
    } catch (error) {
      console.error("Error adding order:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong while adding the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2>Add New Order</h2>
      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <select value={side} onChange={(e) => setSide(e.target.value)} required>
        <option value="">Select Side</option>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <input
        type="number"
        placeholder="Offer Price"
        value={offerPrice}
        onChange={(e) => setOfferPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Offer Size"
        value={offerSize}
        onChange={(e) => setOfferSize(e.target.value)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Order"}
      </button>
    </form>
  );
};

export default OrderForm;