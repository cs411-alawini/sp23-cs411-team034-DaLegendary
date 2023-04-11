import '../App.css';

import React, { useState, useEffect } from 'react'
import Axios from 'axios'



export default function Settings() {
    const [watchlists, setWatchlists] = useState([]);
    const [editingWatchlist, setEditingWatchlist] = useState(null);

    const config = {
        UserId: '08p4cz' // hard-coded for now
    };

    const fetchWatchlists = () => {
        Axios.get('http://127.0.0.1:5000/api/watchlist_videos', {
            params: config
        }).then(response => {
            console.log(response.data)
            setWatchlists(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        fetchWatchlists();
    }, []);

    const handleEditWatchlist = (watchlist) => {
        setEditingWatchlist(watchlist);
    };

    const handleCancelEdit = () => {
        setEditingWatchlist(null);
    };


    const handleSaveWatchlistName = (watchlist, oldWatchListName) => {
        const newWatchListName = document.getElementById(`watchlist-${watchlist.WatchListName}-name`).value;
        const UserId = '08p4cz'; // hard-coded for now
        const WatchListName = oldWatchListName;
        const NewWatchListName = newWatchListName;
        Axios.put(`http://127.0.0.1:5000/api/update_watchlistname?UserId=${UserId}&WatchListName=${WatchListName}&NewWatchListName=${NewWatchListName}`).catch(error => {
            console.error(error);
        });

        setEditingWatchlist(null);
    };


    const watchlistStats = watchlists.map((watchlist) => (
        <tr key={watchlist.WatchListName}>
          <td>
            {editingWatchlist && editingWatchlist.WatchListName === watchlist.WatchListName ?
              <input id={`watchlist-${watchlist.WatchListName}-name`} defaultValue={watchlist.WatchListName} />
              :
              <span>{watchlist.WatchListName}</span>
            }
          </td>
          <td>{watchlist.Videos.length}</td>
          <td>
            {editingWatchlist && editingWatchlist.WatchListId === watchlist.WatchListId ?
              <div>
                <button onClick={() => handleSaveWatchlistName(watchlist, watchlist.WatchListName)}>✓</button>
                <button onClick={handleCancelEdit}>✗</button>
              </div>
              :
              <button onClick={() => handleEditWatchlist(watchlist)}>Edit</button>
            }
          </td>
        </tr>
      ));
    

    return (
        <div className='App'>
            <header><div className="poster"></div>
                <div className="header-container">
                    <h1>Settings</h1>
                </div>
            </header>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Watchlist Name</th>
                            <th>Number of Videos</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlistStats}
                    </tbody>
                </table>
            </div>
        </div>
    );
}