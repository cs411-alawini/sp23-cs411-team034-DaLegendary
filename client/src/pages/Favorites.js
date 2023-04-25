import '../App.css';

import React, { useState, useEffect } from 'react'
import Video from '../components/Video'
import { UserId } from "../data/config.js";
import Axios from 'axios'



export default function Favorites() {
  const [watchlists, setWatchlists] = useState([]);

  useEffect(() => {
    Axios.get('http://127.0.0.1:5000/api/watchlist_videos', {
      params: data
    }).then(response => {
      setWatchlists(response.data);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  const data = {
    UserId: UserId // hard-coded for now
  };


  const watchlistElements = watchlists.map((watchlist, watchlistIndex) => (
    <div key={watchlistIndex}>
      <h2>{watchlist.WatchListName}</h2>
      <div className="video-container">
        {watchlist.Videos.map((video, videoIndex) => (
          <Video
            key={video.VideoId}
            videoid={video.VideoId}
            page='Favorites'
            title={video.Title}
            data-title={video.Title}
            likes={video.Likes}
            views={video.ViewCount}
            watchlistname={watchlist.WatchListName}
            thumbnail={`http://img.youtube.com/vi/${video.VideoId}/hqdefault.jpg`}
          >
          </Video>
        ))}
      </div>
    </div>
  ));

  return (
    <div className='App'>
      <header><div className="poster"></div>
      </header>
      <main>
        {watchlistElements}
      </main>
    </div>
  );
}