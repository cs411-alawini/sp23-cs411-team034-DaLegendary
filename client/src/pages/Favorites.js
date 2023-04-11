import "../App.css";

import React, { useState, useEffect } from "react";
import Video from "../components/Video";
import Axios from "axios";

function Favorites() {
  const [watchlists, setWatchlists] = useState([]);

  useEffect(() => {
    Axios.get("http://127.0.0.1:5000/api/watchlist_videos", {
      params: data,
    })
      .then((response) => {
        setWatchlists(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const data = {
    UserId: "08p4cz", // hard-coded for now
  };

  const watchlistElements = watchlists.map((watchlist, watchlistIndex) => (
    <div key={watchlistIndex}>
      <h2>{watchlist.WatchListName}</h2>
      <div className="video-container">
        {watchlist.Videos.map((video, videoIndex) => (
          <Video
            key={video.VideoId}
            videoid={video.VideoId}
            page="WatchList"
            title={video.Title}
            data-title={video.Title}
            likes={video.Likes}
            views={video.ViewCount}
            watchlistname={watchlist.WatchListName}
            thumbnail={`http://img.youtube.com/vi/${video.VideoId}/hqdefault.jpg`}
          ></Video>
        ))}
      </div>
    </div>
  ));

  function renderVideos({ WLname }) {
    if (WLname === "All") {
      const WLAll = watchlists.map((watchlist, watchlistIndex) => (
        <div key={watchlistIndex}>
          <h2>{watchlist.WatchListName}</h2>
          <div className="video-container">
            {watchlist.Videos.map((video, videoIndex) => (
              <Video
                key={video.VideoId}
                videoid={video.VideoId}
                page="WatchList"
                title={video.Title}
                data-title={video.Title}
                likes={video.Likes}
                views={video.ViewCount}
                watchlistname={watchlist.WatchListName}
                thumbnail={`http://img.youtube.com/vi/${video.VideoId}/hqdefault.jpg`}
              ></Video>
            ))}
          </div>
        </div>
      ));
      return { watchlistElements };
    } else {
      return (
        <>
          <h2>{WLname}</h2>
          <div className="video-container">{}</div>
        </>
      );
    }
  }

  const watchlistnames = [
    "All",
    ...watchlists.map((watchlist, watchlistIndex) => watchlist.WatchListName),
  ];
  const [selectedWL, setSelectedWL] = useState("All");
  const handleOptionChange = (event) => {
    setSelectedWL(event.target.value);
  };

  return (
    <div className="App">
      <header>
        <div className="poster"></div>
        <div className="header-container">
          <h1>Favorites</h1>
        </div>
        <div className="dropdown">
          <label htmlFor="my-dropdown">Select an option:</label>
          <select
            id="my-dropdown"
            value={selectedWL}
            onChange={handleOptionChange}
          >
            {watchlistnames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main>{watchlistElements}</main>
    </div>
  );
}

export default Favorites;
