import React from 'react';

export default function Video(props) {
  return (
    <div className="video">
      <img src={props.thumbnail} alt="Video thumbnail" />
      <div className="video-info">
        <h2>{props.title}</h2>
        <p>by {props.author}</p>
        <p>Views: {props.views}</p>
        <button>Add to favorites</button>
      </div>
    </div>
  );
}
