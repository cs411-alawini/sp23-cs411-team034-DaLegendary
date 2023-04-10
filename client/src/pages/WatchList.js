import '../App.css';

import React, { useState, useEffect } from 'react'
import Video from '../components/Video'
import Axios from 'axios'



export default function WatchList() {
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  const data = {
    UserId: '08p4cz' // hard-coded for now
  };

  Axios.get('http://127.0.0.1:5000/api/watchlist_videos', {
    params: data
  }).then(response => {
    setWatchlists(response.data);
  }).catch(error => {
    console.error(error);
  });

  const handleRemoveVideo = (watchlistIndex, videoIndex) => {
    setWatchlists((prevWatchlists) => {
      const newWatchlists = [...prevWatchlists];
      newWatchlists[watchlistIndex].videos.splice(videoIndex, 1);
      return newWatchlists;
    });
  };

  const watchlistElements = watchlists.map((watchlist, watchlistIndex) => (
    <div key={watchlistIndex}>
      <h2>{watchlist.WatchListName}</h2>
      <div className="video-container">
        {watchlist.Videos.map((video, videoIndex) => (
          <Video
            key={video.VideoId}
            title={video.Title}
            data-title={video.Title}
            likes={video.Likes}
            views={video.ViewCount}
            thumbnail={`http://img.youtube.com/vi/${video.VideoId}/hqdefault.jpg`}
          >
            <button onClick={() => handleRemoveVideo(watchlistIndex, videoIndex)}>Remove from {watchlist.WatchListName}</button>
          </Video>
        ))}
      </div>
    </div>
  ));

  return (
    <div className='App'>
      <header><div className="poster"></div>
        <button onClick={() => window.location.href = '/'}>Home</button>
        <div className="header-container">
          <h1>Favorite Movies</h1>
        </div>
      </header>
      <main>
        {watchlistElements}
      </main>
    </div>
  );
}