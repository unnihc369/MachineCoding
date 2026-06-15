"use client";

import { createContext, useContext, useMemo, useState } from "react";
import "./Cart.css";

const PRODUCTS_DATA = [
  { id: 1, name: "iPhone", price: 80000 },
  { id: 2, name: "Laptop", price: 60000 },
  { id: 3, name: "Headphones", price: 5000 },
];

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const item = prev.find((c) => c.id === product.id);

      if (item) {
        return prev.map((c) =>
          c.id === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, type) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          const qty = type === "inc" ? item.qty + 1 : item.qty - 1;
          return { ...item, qty };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const value = useMemo(
    () => ({ cart, addToCart, updateQty }),
    [cart]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

function CartContent() {
  const { cart, addToCart, updateQty } = useCart();
  const [promo, setPromo] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promo === "SAVE10" ? total * 0.1 : 0;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="cart">
      <header className="cart__header">
        <h2 className="cart__title">Shopping Cart</h2>
        <p className="cart__subtitle">
          Add products, adjust quantities, and apply promo code{" "}
          <code>SAVE10</code> for 10% off.
        </p>
      </header>

      <section className="cart__section">
        <h3 className="cart__section-title">Products</h3>
        <div className="cart__products">
          {PRODUCTS_DATA.map((product) => (
            <article key={product.id} className="cart__card">
              <h4 className="cart__card-name">{product.name}</h4>
              <p className="cart__card-price">₹{product.price.toLocaleString()}</p>
              <button
                type="button"
                className="cart__btn cart__btn--primary"
                onClick={() => addToCart(product)}
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="cart__section">
        <h3 className="cart__section-title">
          My cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
        </h3>

        {cart.length === 0 ? (
          <p className="cart__empty">Your cart is empty.</p>
        ) : (
          <ul className="cart__list">
            {cart.map((item) => (
              <li key={item.id} className="cart__item">
                <span className="cart__item-name">{item.name}</span>
                <div className="cart__qty">
                  <button
                    type="button"
                    className="cart__qty-btn"
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => updateQty(item.id, "dec")}
                  >
                    −
                  </button>
                  <span className="cart__qty-value">{item.qty}</span>
                  <button
                    type="button"
                    className="cart__qty-btn"
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() => updateQty(item.id, "inc")}
                  >
                    +
                  </button>
                </div>
                <span className="cart__item-total">
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="cart__checkout">
        <label className="cart__promo-label">
          Promo code
          <input
            className="cart__promo-input"
            placeholder="Try SAVE10"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
        </label>

        {discount > 0 && (
          <p className="cart__discount">
            Discount: −₹{discount.toLocaleString()}
          </p>
        )}

        <p className="cart__total">
          Total: <strong>₹{(total - discount).toLocaleString()}</strong>
        </p>
      </section>
    </div>
  );
}

export default function Cart() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  );
}
