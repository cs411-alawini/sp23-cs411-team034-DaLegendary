import React, { useState, useEffect, useRef } from 'react'
import Video from './components/Video'

export default function App() {

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();


  const trendingVideos = [
    {
      id: 1,
      title: 'Never Gonna Give You Up',
      author: 'Rick Astley',
      views: 1234567,
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    },
    {
      id: 2,
      title: 'Evolution of Dance',
      author: 'Judson Laipply',
      views: 2345678,
      thumbnail: 'https://i.ytimg.com/vi/zpOULjyy-n8/maxresdefault.jpg',
    },
    {
      id: 3,
      title: 'Gangnam Style',
      author: 'Psy',
      views: 3456789,
      thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    },
  ];



  const [favorites, setFavorites] = React.useState([]);

  const handleAddFavorite = (video) => {
    setFavorites((prevFavorites) => [...prevFavorites, video]);
  };

  const handleRemoveFavorite = (videoToRemove) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((video) => video.id !== videoToRemove.id)
    );
  };

  const trendingVideoElements = trendingVideos.map((video) => (
    <Video key={video.id} title={video.title} author={video.author} views={video.views} thumbnail={video.thumbnail}>
      <button onClick={() => handleAddFavorite(video)}>Add to favorites</button>
    </Video>
  ));

  const favoriteVideoElements = favorites.map((video) => (
    <Video key={video.id} title={video.title} author={video.author} views={video.views} thumbnail={video.thumbnail}>
      <button onClick={() => handleRemoveFavorite(video)}>Remove from favorites</button>
    </Video>
  ));


  return (
    <div className="App">
      <header>
        <div className="poster"></div>
        <div className="search-bar">
          <input type="text" placeholder="Search videos..." />
          <select>
            <option value="">All categories</option>
            <option value="music">Music</option>
            <option value="entertainment">Entertainment</option>
            <option value="education">Education</option>
            <option value="sports">Sports</option>
          </select>
          <button type="submit">Search</button>
        </div>
      </header>

      <main>
        <h2>Trending videos</h2>
        <div className="video-container">{trendingVideoElements}</div>
        <h2>Favorites</h2>
        <div className="video-container">{favoriteVideoElements}</div>
      </main>
    </div>
  );
}

