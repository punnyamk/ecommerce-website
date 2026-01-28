import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const { orders, currency } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 bg-gray-700 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Order List</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {order.date}</p>
              <p><strong>Amount:</strong> {currency}{order.amount}</p>
              <p><strong>Status:</strong> {order.status || "Pending"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
