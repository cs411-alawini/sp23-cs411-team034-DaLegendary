import '../App.css';

import React, { useState, useEffect } from 'react'
import Video from '../components/Video'
import Axios from 'axios'



export default function MostFavoriedVideos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    Axios.get('http://127.0.0.1:5000/api/most_favorited_videos', {
      params: data
    }).then(response => {
        setVideos(response.data);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  const data = {
    UserId: '08p4cz' // hard-coded for now
  };


  const videoElements = videos.map((video) => (
    <Video
      key={video.VideoId}
      videoid={video.VideoId}
      page='MostFavoriedVideos'
      title={video.Title}
      data-title={video.Title}
      likes={video.Likes}
      views={video.ViewCount}
      savedcount={video.SavedCount}
      thumbnail={`http://img.youtube.com/vi/${video.VideoId}/hqdefault.jpg`}>
    </Video>
  ));

  return (
    <div className='App'>
      <header><div className="poster"></div>
      </header>
      <main>
        <div>
          <div className="video-container">{videoElements}</div>
        </div>
      </main>
    </div>
  );
}