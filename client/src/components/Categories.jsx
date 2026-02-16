import React from 'react';
import { categories as staticCategories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, "-");

const Categories = () => {
  const { navigate, adminCategories } = useAppContext();

  // ✅ Merge static + admin categories
  const allCategories = [
    ...staticCategories,
    ...adminCategories.map((cat) => ({
      text: cat.text,
      image: cat.image || null,
      path: slugify(cat.text),
      bgColor: "#f3f4f6", // default background for admin categories
    })),
  ];

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
        {allCategories.map((category, index) => (
          <div
            key={index}
            className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
          >
            {category.image ? (
              <img
                src={category.image}
                alt={category.text}
                className='group-hover:scale-110 transition max-w-28'
              />
            ) : (
              <div className='h-20 w-20 bg-gray-200 rounded flex items-center justify-center'>
                <span className='text-sm'>{category.text}</span>
              </div>
            )}

            <p className='text-sm font-medium'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
