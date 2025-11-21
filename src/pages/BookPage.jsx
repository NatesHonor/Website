import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import "../styles/BookPage.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const BookPage = () => {
  const [activeTab, setActiveTab] = useState("Gaming");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const tabs = ["Gaming", "Social", "Business"];

  const items = {
    Gaming: [
      { title: "Valorant Coaching Session", desc: "Improve your aim, game sense, and strategy.", price: 25, action: "Book Now" },
      { title: "Play Valorant With Me", desc: "Queue up and enjoy some ranked or customs.", price: 15, action: "Book Game" },
      { title: "Play Minecraft With Me", desc: "Survival, mini-games, or building session.", price: 10, action: "Book Game" },
      { title: "Play GTA With Me", desc: "Cruise, missions, or just chaos.", price: 15, action: "Book Game" },
      { title: "Game Night Party", desc: "Join my private gaming session with friends.", price: 20, action: "Join Event" },
      { title: "Valorant VOD Review", desc: "Send a recording for feedback.", price: 20, action: "Submit VOD" },
      { title: "Fortnite Duo Session", desc: "Win some games and have fun.", price: 10, action: "Book Game" },
      { title: "CS2 Coaching", desc: "Analyze your play and tactics.", price: 25, action: "Book Session" },
      { title: "Custom Aim Routine Setup", desc: "Get a personalized aim routine.", price: 10, action: "Get Routine" },
      { title: "Casual Gaming Chat", desc: "Hang out while gaming.", price: 5, action: "Book Chat" }
    ],
    Social: [
      { title: "Text Me", desc: "Chat with me directly for a set time.", price: 5, action: "Start Chat" },
      { title: "Call Me", desc: "Talk over a voice call.", price: 10, action: "Start Call" },
      { title: "Become Friends", desc: "Let’s get to know each other.", price: 0, action: "Send Request" },
      { title: "Join Discord Hangout", desc: "Hang out in a private Discord server.", price: 3, action: "Join Now" },
      { title: "Watch Movie Together", desc: "Netflix or YouTube watch party.", price: 8, action: "Book Time" },
      { title: "Study Together", desc: "Co-work or focus session.", price: 5, action: "Join Session" },
      { title: "Life Chat", desc: "Talk about anything on your mind.", price: 10, action: "Book Chat" },
      { title: "Music Share Session", desc: "Share playlists and listen together.", price: 4, action: "Join" },
      { title: "Daily Check-In", desc: "A quick motivational talk daily.", price: 15, action: "Subscribe" },
      { title: "Social Collab", desc: "Plan content or stream together.", price: 20, action: "Plan Collab" }
    ],
    Business: [
      { title: "Book a 1-on-1 Meeting", desc: "Discuss your project ideas or development needs.", price: 50, action: "Book Meeting" },
      { title: "Website Development", desc: "Get a professional site built.", price: 250, action: "Request Quote" },
      { title: "Plugin Development", desc: "Custom Minecraft or web plugin.", price: 100, action: "Request Build" },
      { title: "API Integration", desc: "Connect your apps with APIs.", price: 120, action: "Get Integration" },
      { title: "Full Stack Project", desc: "End-to-end web app creation.", price: 500, action: "Start Project" },
      { title: "Code Debugging Session", desc: "Fix issues in your codebase.", price: 40, action: "Book Help" },
      { title: "UI/UX Design Help", desc: "Improve your web or app design.", price: 60, action: "Get Design" },
      { title: "Performance Optimization", desc: "Make your app faster and cleaner.", price: 80, action: "Optimize" },
      { title: "Code Review & Feedback", desc: "Get detailed feedback on your work.", price: 35, action: "Submit Code" },
      { title: "Long-Term Development Contract", desc: "Hire me for ongoing software projects.", price: 0, action: "Contact Me" }
    ]
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/cart/get`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.cart) {
          setCart(data.cart);
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    fetchCart();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.title === item.title);
      if (existing) {
        return prev.map((i) =>
          i.title === item.title ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQty = (title) => {
    setCart((prev) =>
      prev.map((i) =>
        i.title === title ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQty = (title) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.title === title ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const proceedToCheckout = async () => {
    try {
      await fetch(`${API_BASE}/cart/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart })
      });
      navigate("/book/checkout");
    } catch (err) {
      console.error("Failed to set cart:", err);
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1>Book Time With Me</h1>
        <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
          <ShoppingCart size={28} />
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          {showCart && (
            <div className="cart-dropdown" onClick={(e) => e.stopPropagation()}>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item">
                      <span>{item.title}</span>
                      <div className="cart-controls">
                        <button onClick={() => decreaseQty(item.title)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.title)}>+</button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-summary">
                    <span>Subtotal: ${subtotal.toFixed(2)}</span>
                    <button
                      className="checkout-btn"
                      onClick={proceedToCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <p>Choose a category below and explore all the ways you can connect, play, or work with me.</p>

      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="items-grid">
        {items[activeTab].map((item, index) => (
          <div className="item-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className="price">${item.price}</div>
            <button className="action-btn" onClick={() => addToCart(item)}>
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookPage;