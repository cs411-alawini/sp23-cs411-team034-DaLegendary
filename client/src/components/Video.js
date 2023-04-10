import React from 'react';
import Axios from 'axios'

export default function Video(props) {


  const handleAddFavorite = (video) => {
    console.log(video)
    const UserId = '08p4cz' // hard-coded for now
    const WatchListName = window.prompt('Enter Watchlist Name:');
    if (WatchListName) {
      Axios.post(`http://127.0.0.1:5000/api/add_favorite?UserId=${UserId}&VideoId=${video.videoid}&WatchListName=${WatchListName}`)
        .then((response) => {
          alert('Video has been added to your favorites');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="video">
      <img src={props.thumbnail} alt="Video thumbnail" />
      <div className="video-info">
        <h2>{props.title}</h2>
        <p>Likes: {props.likes}</p>
        <p>Views: {props.views}</p>
        <button onClick={() => handleAddFavorite(props)}>Add to favorites</button>
      </div>
    </div>
  );
}