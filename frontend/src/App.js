import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import api from "./services/api";
import OrderForm from "./components/OrderForm";
import OrderBook from "./components/OrderBook"; // Import the OrderBook component
import "./styles/index.css"; // Assuming you want to keep the styling

const App = () => {
  const [orders, setOrders] = useState([]);
  const [topOrders, setTopOrders] = useState([]); // Store top-of-book data

  useEffect(() => {
    // Fetch orders from the backend
    api.get("/api/market-feed")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));

    // Fetch top-of-book for a specific symbol (Example: "AAPL")
    api.get("/api/market-feed/AAPL")
      .then((response) => setTopOrders(response.data))
      .catch((error) => console.error("Error fetching top-of-book:", error));
  }, []);

  // Sorting and limiting logic for top 5 orders
  const sortedTopOrders = [...orders]
    .sort((a, b) => {
      // Sort by price (descending), then by offer_price (ascending)
      if (b.price !== a.price) {
        return b.price - a.price;
      }
      return a.offer_price - b.offer_price;
    })
    .slice(0, 5); // Limit to the top 5 entries

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/order-book">Order Book</Link>
            </li>
            <li>
              <Link to="/order-form">Order Form</Link> {/* Link to OrderForm page */}
            </li>
          </ul>
        </nav>

        {/* Define routes here */}
        <Routes>
          {/* Home route with top-of-book display */}
          <Route
            path="/"
            element={
              <div>
                <h1 className="app-title">Top of the Book</h1>
                {topOrders && (
                  <div className="top-of-book">
                    <h2>Top-of-Book for AAPL</h2>
                    <p>Price: {topOrders._id}</p>
                    <p>Size: {topOrders.size}</p>
                  </div>
                )}
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Bid Price</th>
                      <th>Bid Size</th>
                      <th>Offer Price</th>
                      <th>Offer Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTopOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.symbol}</td>
                        <td>{order.price}</td>
                        <td>{order.quantity}</td>
                        <td>{order.offer_price}</td>
                        <td>{order.offer_size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />

          {/* OrderBook route without sorting and limiting */}
          <Route path="/order-book" element={<OrderBook orders={orders} />} />

          {/* OrderFormPage route */}
          <Route path="/order-form" element={<OrderForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
