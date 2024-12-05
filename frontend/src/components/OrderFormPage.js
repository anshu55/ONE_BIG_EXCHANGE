// src/components/OrderFormPage.js
import React from "react";
import OrderForm from "./OrderForm";

const OrderFormPage = () => {
  return (
    <div className="order-form-page">
      <h1>Add New Order</h1>
      <OrderForm />
    </div>
  );
};

export default OrderFormPage;