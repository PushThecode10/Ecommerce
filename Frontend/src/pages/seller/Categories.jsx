import React, { useEffect, useState } from "react";
import { publicAPI } from "../../service/apiAuth.js"; // ✅ correct import
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await publicAPI.getCategories(); // ✅ use this
      setCategories(res.data.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
        <button onClick={()=> nav('/seller/categories/add')}>+ Add Category</button>
      <h2>Categories</h2>

      {categories.map((cat) => (
        <div key={cat._id}>
          <h3>{cat.name}</h3>
          <p>{cat.description}</p>

          <img
            src={`http://localhost:3000${cat.image}`}
            alt={cat.name}
            width="120"
          />
        </div>
      ))}
    </div>
  );
};

export default Categories;