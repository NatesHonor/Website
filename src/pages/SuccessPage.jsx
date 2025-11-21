import React, { useEffect, useState } from "react";
import "../styles/SuccessPage.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const SuccessPage = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    if (orderId) {
      fetch(`${API_BASE}/paypal-api/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json())
        .then((data) => setOrderData(data))
        .catch((err) => console.error("Error fetching order:", err));
    }
  }, []);

  function downloadInvoice() {
    if (!orderData) return;
    const invoiceContent = `
      Invoice
      ----------------------------
      Order ID: ${orderData.id}
      Status: ${orderData.status}
      Amount: ${orderData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value} ${orderData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code}
      Payer: ${orderData.payer?.name?.given_name || ""} ${orderData.payer?.name?.surname || ""}
      Email: ${orderData.payer?.email_address || ""}
      ----------------------------
      Thank you for your purchase!
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderData.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!orderData) {
    return (
      <div className="success-container">
        <h1>Loading receipt...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const capture = orderData.purchase_units?.[0]?.payments?.captures?.[0];

  return (
    <div className="success-container">
      <h1>Payment Successful</h1>
      <div className="receipt">
        <p><strong>Order ID:</strong> {orderData.id}</p>
        <p><strong>Status:</strong> {orderData.status}</p>
        <p><strong>Amount:</strong> {capture?.amount?.value} {capture?.amount?.currency_code}</p>
        <p><strong>Payer:</strong> {orderData.payer?.name?.given_name} {orderData.payer?.name?.surname}</p>
        <p><strong>Email:</strong> {orderData.payer?.email_address}</p>
        <p><strong>Transaction ID:</strong> {capture?.id}</p>
        <p><strong>Update Time:</strong> {capture?.update_time}</p>
      </div>
      <button className="download-btn" onClick={downloadInvoice}>Download Invoice</button>
    </div>
  );
};

export default SuccessPage;
