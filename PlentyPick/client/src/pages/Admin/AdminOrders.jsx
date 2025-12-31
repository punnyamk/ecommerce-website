import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const AdminOrders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem('orders')) || []);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Orders</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No orders yet.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-lg p-5 shadow hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-700">
                Order ID: <span className="font-normal">{order._id}</span>
              </p>
              <p
                className={`px-2 py-1 rounded text-sm font-medium ${
                  order.status === 'Placed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {order.status}
              </p>
            </div>

            <p className="text-gray-600 mb-1">
              <b>Payment:</b> {order.paymentType}
            </p>
            <p className="text-gray-600 mb-1">
              <b>Total:</b> {currency}{order.amount}
            </p>

            <div className="mt-3 border-t pt-3">
              <h4 className="font-semibold mb-2 text-gray-700">Products:</h4>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-gray-600 mb-1"
                >
                  <span>{item.product.name}</span>
                  <span>× {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
