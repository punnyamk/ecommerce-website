import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { products, setProducts, orders, currency } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [image, setImage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // edit mode

  // Add or Edit Product
  const handleAddOrEditProduct = () => {
    if (!name || !price || !offerPrice || !image) return;

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map((p) =>
        p._id === editingProduct._id
          ? { ...p, name, price: Number(price), offerPrice: Number(offerPrice), image }
          : p
      );
      setProducts(updatedProducts);
      alert("Product updated successfully!");
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct = {
        _id: Date.now().toString(),
        name,
        price: Number(price),
        offerPrice: Number(offerPrice),
        image,
      };
      setProducts([newProduct, ...products]);
      alert("Product added successfully!");
    }

    setName("");
    setPrice("");
    setOfferPrice("");
    setImage("");
  };

  // Delete product with confirmation
  const handleDeleteProduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setOfferPrice(product.offerPrice);
    setImage(product.image);
  };

  const totalOrders = orders?.length || 0;
  const totalProductsOrdered = orders?.reduce(
    (acc, order) => acc + (order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0),
    0
  ) || 0;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Orders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
          <p className="text-3xl mt-2 text-blue-500">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition text-center flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold text-gray-700">Ordered Products</h2>
          <p className="text-3xl mt-2 text-green-500">{totalProductsOrdered}</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            View Ordered Products
          </button>
        </div>
      </div>

      {/* Add / Edit Product */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 hover:shadow-lg transition">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setImage(reader.result);
                reader.readAsDataURL(file);
              }
            }}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleAddOrEditProduct}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Products List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition relative"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
              <p className="text-gray-600">Price: {currency}{product.price}</p>
              <p className="text-gray-600">Offer: {currency}{product.offerPrice}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full font-semibold shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
