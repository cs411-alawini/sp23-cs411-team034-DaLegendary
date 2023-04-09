import './App.css';

import React, { useState, useEffect, useRef } from 'react'
import Video from './components/Video'
import categories from './data/categories.json'
import Axios from 'axios'

export default function Home() {

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();


  const [trendingVideos, setTrendingVideos] = useState([]);
  const [favorites, setFavorites] = React.useState([]);


  const handleAddFavorite = (video) => {
    setFavorites((prevFavorites) => [...prevFavorites, video]);
  };


  const handleSearch = () => {
    const categoryName = document.getElementById('category-select').value;
    const userText = document.getElementById('search-input').value;


    const data = {
      CategoryName: categoryName,
      UserText: userText
    };

    Axios.get('http://127.0.0.1:5000/api/search', {
      params: data
    }).then(response => {
      setTrendingVideos(response.data);
    }).catch(error => {
      console.error(error);
    });
  };


  const trendingVideoElements = trendingVideos.map((video) => (
    <Video key={video.VideoId} title={video.Title} data-title={video.Title} likes={video.Likes} views={video.ViewCount} thumbnail={`http://img.youtube.com/vi/${video.VideoId}/hqdefault.jpg`}>
      <button onClick={() => handleAddFavorite(video)}>Add to favorites</button>
    </Video>
  ));


  return (
    <div className="App">

      <header>
        <div className="poster"></div>
        <div className="search-bar">
          <input id="search-input" type="text" placeholder="Search videos..." />
          <select id="category-select">
            <option value="">All categories</option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={() => window.location.href = '/watchlist'}>Watchlist</button>
      </header>


      <main>
        <div>
          <h2>Trending videos</h2>
          <div className="video-container">{trendingVideoElements}</div>
        </div>

      </main>
    </div>
  );
}
