import React, { useEffect, useState } from "react";
import "../styles/CheckoutPage.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
    if (window.paypal) {
      onPayPalWebSdkLoaded();
    }
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  async function fetchCart() {
    try {
      const res = await fetch(`${API_BASE}/cart/get`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      setStatusMessage("Unable to load cart");
    }
  }

  async function getBrowserSafeClientToken() {
    const res = await fetch(`${API_BASE}/paypal-api/auth/browser-safe-client-token`);
    const data = await res.json();
    return data.accessToken;
  }

  async function createOrder() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: subtotal.toFixed(2)
          }
        }
      ]
    };
    return fetch(`${API_BASE}/paypal-api/checkout/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    })
      .then((res) => res.json())
      .then((data) => ({ orderId: data.id }));
  }

  async function captureOrder({ orderId }) {
    return fetch(`${API_BASE}/paypal-api/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }).then((res) => res.json());
  }

  async function onPayPalWebSdkLoaded() {
    try {
      const clientToken = await getBrowserSafeClientToken();
      const sdkInstance = await window.paypal.createInstance({
        clientToken,
        components: ["paypal-payments"],
        pageType: "checkout"
      });
      const paymentMethods = await sdkInstance.findEligibleMethods({
        currencyCode: "USD"
      });
      if (paymentMethods.isEligible("paypal")) {
        setUpPayPalButton(sdkInstance);
      }
      if (paymentMethods.isEligible("paylater")) {
        const details = paymentMethods.getDetails("paylater");
        setUpPayLaterButton(sdkInstance, details);
      }
      if (paymentMethods.isEligible("credit")) {
        const details = paymentMethods.getDetails("credit");
        setUpPayPalCreditButton(sdkInstance, details);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  const paymentSessionOptions = {
    async onApprove(data) {
      try {
        await captureOrder({ orderId: data.orderId });
        window.location.href = "checkout/success?orderId=" + data.orderId;
      } catch (err) {
        setStatusMessage("Payment Declined");
      }
    },
    onCancel() {
      setStatusMessage("Payment Cancelled");
    },
    onError() {
      setStatusMessage("Payment Declined");
    },
    onTimeout() {
      setStatusMessage("Payment Timed Out");
    }
  };

  async function setUpPayPalButton(sdkInstance) {
    const session = sdkInstance.createPayPalOneTimePaymentSession(paymentSessionOptions);
    const btn = document.querySelector("paypal-button");
    if (!btn) return;
    btn.removeAttribute("hidden");
    btn.addEventListener("click", async () => {
      try {
        await session.start({ presentationMode: "auto" }, createOrder());
      } catch (err) {}
    });
  }

  async function setUpPayLaterButton(sdkInstance, details) {
    const session = sdkInstance.createPayLaterOneTimePaymentSession(paymentSessionOptions);
    const btn = document.querySelector("paypal-pay-later-button");
    if (!btn) return;
    btn.productCode = details.productCode;
    btn.countryCode = details.countryCode;
    btn.removeAttribute("hidden");
    btn.addEventListener("click", async () => {
      try {
        await session.start({ presentationMode: "auto" }, createOrder());
      } catch (err) {}
    });
  }

  async function setUpPayPalCreditButton(sdkInstance, details) {
    const session = sdkInstance.createPayPalCreditOneTimePaymentSession(paymentSessionOptions);
    const btn = document.querySelector("paypal-credit-button");
    if (!btn) return;
    btn.countryCode = details.countryCode;
    btn.removeAttribute("hidden");
    btn.addEventListener("click", async () => {
      try {
        await session.start({ presentationMode: "auto" }, createOrder());
      } catch (err) {}
    });
  }

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
                <div className="cart-controls">
                  <button disabled>-</button>
                  <span>{item.quantity}</span>
                  <button disabled>+</button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-total">Subtotal: ${subtotal.toFixed(2)}</div>
            <button className="back-button" onClick={() => window.location.href = "/book"}>
              Back to Booking Page
            </button>
          </div>
        )}
        <div className="payment-panel">
          <h3>Payment Options</h3>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="buttons-container">
              <paypal-button type="pay" hidden></paypal-button>
              <paypal-pay-later-button hidden></paypal-pay-later-button>
              <paypal-credit-button hidden></paypal-credit-button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
