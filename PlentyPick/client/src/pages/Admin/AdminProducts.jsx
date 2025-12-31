import { useAppContext } from '../../context/AppContext';

const AdminProducts = () => {
  const { products, currency } = useAppContext();

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-6">All Products</h2>

      {products.map((product) => (
        <div
          key={product._id}
          className="border p-4 mb-4 flex justify-between"
        >
          <div>
            <p className="font-medium">{product.name}</p>
            <p>Category: {product.category}</p>
          </div>
          <p>
            {currency}
            {product.offerPrice}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
