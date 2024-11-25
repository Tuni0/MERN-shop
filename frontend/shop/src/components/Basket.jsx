import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserLoginContext } from "../App";

function Basket() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const { user } = useContext(UserLoginContext);
  const shipping = 5.0;
  const tax = 8.32;
  const total = subtotal + shipping + tax;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3006/checkout")
      .then((result) => {
        console.log(result.data[0]);
        setItems(result.data);
        calculateSubtotal(result.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  const calculateSubtotal = (items) => {
    if (!user) {
      return;
    }
    const subtotal = items.reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
    setSubtotal(subtotal);
  };

  const handleOnChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value);
    const updatedItems = items.map((item) =>
      item.idbasket === itemId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    calculateSubtotal(updatedItems);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-lg shadow">
            {!user && <p>Please log in and add items to basket to see</p>}
            {items.map((item) => (
              <div
                key={item.idbasket}
                className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.img_src}
                    alt={item.img_alt}
                    className="w-20 h-20 rounded-lg"
                  />
                  <div className="ml-4">
                    <h2 className="font-medium">{item.description}</h2>
                    <p className="text-sm text-gray-500 text-left">
                      {item.color}
                    </p>
                    <p className="text-sm text-gray-500 text-left">
                      {item.size}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        item.stockStatus === "In stock"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {item.stockStatus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <select
                    className="border-gray-300 rounded p-1"
                    value={item.quantity}
                    onChange={(e) => handleOnChange(e, item.idbasket)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <p className="ml-4 font-medium">
                    $
                    {item.price
                      ? (item.price * item.quantity).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            {user && (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p>Shipping estimate</p>
                  <p>${shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p>Tax estimate</p>
                  <p>${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Order total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </>
            )}
            {!user && (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <p>Subtotal</p>
                  <p>$0</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p>Shipping estimate</p>
                  <p>$0</p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <p>Tax estimate</p>
                  <p>$0</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Order total</p>
                  <p>$0</p>
                </div>
              </>
            )}
            <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Basket;
