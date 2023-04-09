import React from 'react';
import Video from '../components/Video';




export default function WatchList() {
  return (
    <div className='App'>
      <header><div className="poster"></div>
      <button onClick={() => window.location.href = '/'}>Home</button>
      </header>

      {/* <main>
        <div>
          <h2>Favorites</h2>
          <div className="video-container">{favoriteVideoElements}</div>
        </div>
      </main> */}
    </div>
  );
}