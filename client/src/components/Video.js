import React, { useRef,useState } from 'react';
import Axios from 'axios'
import ReactDOM from 'react-dom';
export default function Video(props) {

  const videoRef = useRef(null); 
  const UserId = '08p4cz' // hard-coded for now

  const videoUrl = `https://www.youtube.com/watch?v=${props.videoid}`;

  const handleClick = () => {
    window.open(videoUrl, '_blank');
  };


  const handleButtonAction = () => {
    if (props.page === 'Home') {
      handleAddFavorite(props);
    } else if (props.page === 'Favorites') {
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
        const node = ReactDOM.findDOMNode(videoRef.current);
        if (node) {
          node.remove();
        }
      })
      .catch((error) => {
        console.log('delete fail')
        console.error(error);
      });
  };

  const buttonLabel = props.page === 'Home' ? 'Add to favorites' : 'Delete';

  return (
    <div className="video" ref={videoRef}>
      <img src={props.thumbnail} alt="Video thumbnail" onClick={handleClick}/>
      <div className="video-info">
        <h2>{props.title}</h2>
        {props.page === 'MostFavoriedVideos' ? <p>SavedCount: {props.savedcount}</p> : <p>Likes: {props.likes}</p>}
        <p>Views: {props.views}</p>
        <button onClick={handleButtonAction}>{buttonLabel}</button>
      </div>
    </div>

  );
}