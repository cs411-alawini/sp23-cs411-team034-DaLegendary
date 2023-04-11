import "../App.css";

import React, { useState, useEffect } from "react";
import Axios from "axios";

function QueryI() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Axios.get("http://127.0.0.1:5000/api/countCategories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      <div className="poster"></div>

      <table>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Number of Favorites</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.CategoryName}>
              <td>{category.CategoryName}</td>
              <td>{category.num_favorites}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QueryI;
