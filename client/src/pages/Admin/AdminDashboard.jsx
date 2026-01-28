import React, { useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { categories as staticCategories } from "../../assets/assets"; // ⭐ NEW

const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, "-"); // ⭐ NEW

const AdminDashboard = () => {
  const {
    products,
    setProducts,
    currency,
    adminCategories,
    addAdminCategory,
    deleteAdminCategory,
  } = useAppContext();

  const navigate = useNavigate();
  const editSectionRef = useRef(null);

  // PRODUCT STATES
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // CATEGORY STATES
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");

  // ⭐ SAME CATEGORY LOGIC AS HOME PAGE
  const allCategories = [
    ...staticCategories,
    ...adminCategories.map((c) => ({
      text: c.text,
      image: c.image || null,
      path: slugify(c.text),
      isAdmin: true, // mark admin categories
    })),
  ];

  /* ================= ADD CATEGORY ================= */
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const exists = allCategories.some(
      (c) => c.text.toLowerCase() === newCategory.toLowerCase()
    );
    if (exists) return alert("Category already exists");

    addAdminCategory({
      text: newCategory,
      image: newCategoryImage,
    });

    setNewCategory("");
    setNewCategoryImage("");
  };

  /* ================= DELETE CATEGORY ================= */
  const handleDeleteCategory = (cat) => {
    if (!window.confirm(`Delete category "${cat.text}"?`)) return;

    deleteAdminCategory(cat.text);

    const updatedProducts = products.filter(
      (p) => p.category !== cat.text
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  /* ================= ADD / EDIT PRODUCT ================= */
  const handleAddOrEditProduct = () => {
    if (!name || !price || !offerPrice || !category || image.length === 0) return;

    let updatedProducts;

    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p._id === editingProduct._id
          ? {
              ...p,
              name,
              price: Number(price),
              offerPrice: Number(offerPrice),
              category,
              image,
              inStock: true,
            }
          : p
      );
      setEditingProduct(null);
    } else {
      updatedProducts = [
        {
          _id: Date.now().toString(),
          name,
          price: Number(price),
          offerPrice: Number(offerPrice),
          category,
          image,
          inStock: true,
        },
        ...products,
      ];
    }

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setName("");
    setPrice("");
    setOfferPrice("");
    setCategory("");
    setImage([]);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setOfferPrice(product.offerPrice);
    setCategory(product.category);
    setImage(product.image);
    editSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;
    const updated = products.filter((p) => p._id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <button
        onClick={() => navigate("/admin/orders")}
        className="mb-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        View Orders
      </button>

      {/* ================= CATEGORY MANAGEMENT ================= */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

        <div className="flex gap-4 mb-4">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="border p-2 rounded w-full"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () => setNewCategoryImage(reader.result);
              reader.readAsDataURL(e.target.files[0]);
            }}
            className="border p-2 rounded w-40"
          />

          <button
            onClick={handleAddCategory}
            className="bg-purple-600 text-white px-6 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* ⭐ SAME CATEGORY UI AS HOME PAGE */}
        <div className="flex flex-wrap gap-4">
          {allCategories.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center border p-2 rounded w-32 relative"
            >
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.text}
                  className="h-16 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-sm">{c.text}</span>
                </div>
              )}

              <p className="text-center mt-2 text-sm">{c.text}</p>

              {/* ❌ Delete only admin-added categories */}
              {c.isAdmin && (
                <button
                  onClick={() => handleDeleteCategory(c)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD / EDIT PRODUCT ================= */}
      <div ref={editSectionRef} className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Offer Price"
            className="border p-2 rounded"
          />

          <input
            list="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="border p-2 rounded"
          />

          {/* ⭐ SAME CATEGORY SOURCE */}
          <datalist id="categories">
            {allCategories.map((c, i) => (
              <option key={i} value={c.text} />
            ))}
          </datalist>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () => setImage([reader.result]);
              reader.readAsDataURL(e.target.files[0]);
            }}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={handleAddOrEditProduct}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          {editingProduct ? "Update" : "Add"}
        </button>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="grid md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow">
            <img
              src={product.image?.[0]}
              className="h-40 w-full object-cover mb-2"
            />

            <h3 className="font-semibold">{product.name}</h3>
            <p>
              {currency}
              {product.offerPrice}
            </p>
            <p className="text-sm text-gray-500">{product.category}</p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-yellow-400 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
