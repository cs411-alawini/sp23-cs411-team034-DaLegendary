import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "../App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function QueryI() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Axios.get("http://127.0.0.1:5000/api/countCategories_procedure")
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

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BarChart width={800} height={600} data={categories}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CategoryName" tick={{ fill: '#ffffff' }} />
          <YAxis tick={{ fill: '#ffffff' }}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="NumFavorites" fill="#ffffff" />
        </BarChart>
      </div>
    </div>
  );
}

