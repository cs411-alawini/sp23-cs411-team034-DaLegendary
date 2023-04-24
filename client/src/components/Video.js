import React from 'react';
import Axios from 'axios'

export default function Video(props) {

  const UserId = '08p4cz' // hard-coded for now

  const handleButtonAction = () => {
    if (props.page === 'Home') {
      handleAddFavorite(props);
    } else if (props.page === 'WatchList') {
      handleRemoveFavorite(props);
    }
  }

  const handleAddFavorite = (video) => {
    console.log(video)
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

  const handleRemoveFavorite = (video) => {
    Axios.delete(`http://127.0.0.1:5000/api/delete_video?UserId=${UserId}&VideoId=${video.videoid}&WatchListName=${video.watchlistname}`)
      .then((response) => {
        alert('Video has been removed from your favorites');
        // props.onUpdateWatchlists(response.data);
      })
      .catch((error) => {
        console.log('delete fail')
        console.error(error);
      });
  };

  const buttonLabel = props.page === 'Home' ? 'Add to favorites' : 'Delete';

  return (
    <div className="video">
      <img src={props.thumbnail} alt="Video thumbnail" />
      <div className="video-info">
        <h2>{props.title}</h2>
        <p>Likes: {props.likes}</p>
        <p>Views: {props.views}</p>
        <button onClick={handleButtonAction}>{buttonLabel}</button>
      </div>
    </div>
  );
}