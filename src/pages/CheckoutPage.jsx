import React, { useEffect, useState, useCallback } from "react";
import "../styles/CheckoutPage.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function waitForPayPal() {
  return new Promise((resolve) => {
    const check = () => {
      if (window.paypal && window.paypal.createInstance) {
        resolve(window.paypal);
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}

const CheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/cart/get`, { credentials: "include" });
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } catch {
      setStatusMessage("Unable to load cart");
    }
  }, []);

  const getBrowserSafeClientToken = useCallback(async () => {
    const res = await fetch(`${API_BASE}/paypal-api/auth/browser-safe-client-token`);
    const data = await res.json();
    return data.clientToken;
  }, []);

  const createOrder = useCallback(async () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const payload = {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: subtotal.toFixed(2) } }]
    };
    const res = await fetch(`${API_BASE}/paypal-api/checkout/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.id;
  }, [cart]);

  const captureOrder = useCallback(async ({ orderId }) => {
    const res = await fetch(`${API_BASE}/paypal-api/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchCart();
      try {
        const clientToken = await getBrowserSafeClientToken();
        const paypal = await waitForPayPal();

        const sdk = await paypal.createInstance({
          clientToken,
          components: ["paypal-payments"],
          pageType: "checkout"
        });

        // Optional: log eligible methods
        const methods = await sdk.findEligibleMethods({ currencyCode: "USD" });
        console.log("Eligible methods:", methods);

        sdk.Buttons({
          createOrder: async () => await createOrder(),
          onApprove: async ({ orderID }) => {
            await captureOrder({ orderId: orderID });
            window.location.href = `/checkout/success?orderId=${orderID}`;
          },
          onCancel: () => setStatusMessage("Payment Cancelled"),
          onError: () => setStatusMessage("Payment Declined")
        }).render("#paypal-button-container");

        setLoading(false);
      } catch (err) {
        console.error("PayPal init failed", err);
        setLoading(false);
      }
    };
    init();
  }, [fetchCart, getBrowserSafeClientToken, createOrder, captureOrder]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout-container">
      {statusMessage && <div className="notification-bar">{statusMessage}</div>}
      <h1>Checkout</h1>
      <div className="checkout-main">
        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Your Cart</h2>
            {cart.map((item, idx) => (
              <div key={idx} className="cart-item">
                <span>{item.title}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-total">Subtotal: ${subtotal.toFixed(2)}</div>
            <button className="back-button" onClick={() => (window.location.href = "/book")}>
              Back to Booking Page
            </button>
          </div>
        )}
        <div className="payment-panel">
          <h3>Payment Options</h3>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div id="paypal-button-container"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
