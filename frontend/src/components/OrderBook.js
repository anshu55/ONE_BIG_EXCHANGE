import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/OrderBook.css"; // Correct the filename to match the actual CSS file

const OrderBook = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/api/market-feed")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div className="order-book">
      <h1 className="title">Order Book</h1>
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
          {orders.map((order, index) => (
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
  );
};

export default OrderBook;