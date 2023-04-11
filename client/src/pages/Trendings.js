import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function Trendings() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        Axios.get('http://127.0.0.1:5000/api/countCategories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className='App'>
            <header><div className="poster"></div>
                <button onClick={() => window.location.href = '/'}>Home</button>
                <div className="header-container">
                    <h1>Current Trendings</h1>
                </div>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Number of Favorites</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
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
