import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories as staticCategories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products, adminCategories } = useAppContext();
  const { category } = useParams(); // ✅ extract category from URL

  // Merge static categories and admin-added categories
  const allCategories = [
    ...staticCategories,
    ...(adminCategories?.map((c) => ({
      path: c.text.toLowerCase().replace(/\s+/g, "-"), // convert name to path
      text: c.text,
      image: c.image || null,
    })) || []),
  ];

  // Find category info
  const searchCategory = allCategories.find(
    (item) => item.path.toLowerCase() === category
  );

  // Filter products belonging to this category
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className="mt-16 px-4">
      {searchCategory && (
        <div className="flex flex-col items-center md:items-start w-full mb-8">
          <div className="flex items-center gap-4">
            {searchCategory.image ? (
              <img
                src={searchCategory.image}
                alt={searchCategory.text}
                className="w-16 h-16 object-cover rounded-full border"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full border">
                <span className="text-sm font-medium">{searchCategory.text}</span>
              </div>
            )}
            <p className="text-3xl font-bold">{searchCategory.text.toUpperCase()}</p>
          </div>
          <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          {searchCategory?.image && (
            <img
              src={searchCategory.image}
              alt={searchCategory.text}
              className="w-24 h-24 object-cover rounded-full border"
            />
          )}
          <p className="text-2xl font-medium text-primary">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
