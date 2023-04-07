const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: '34.30.55.76',
    user: 'root',
    password: 'group034',
    database: 'video_info'
});

app.get('/getTrendingMovies', (req, res) => {
    const query = `
    SELECT v.Title, v.VideoId, v.ChannelId, n.Likes, n.Dislikes, n.ViewCount
    FROM video_info.Video v JOIN (
      SELECT VideoId, ViewCount, Likes, Dislikes
      FROM video_info.VideoStats
      WHERE (VideoId, TrendingDate) IN (
        SELECT VideoId, MAX(TrendingDate)
        FROM video_info.VideoStats
        GROUP BY VideoId
      )
    ) AS n USING (VideoId)
    WHERE n.Likes + n.Dislikes != 0
      AND n.Likes / (n.Likes + n.Dislikes) > 0.95
      AND n.ViewCount >= 10000
    ORDER BY n.ViewCount DESC
    LIMIT 15;
  `;

  db.query(query, (error, results) => {
    res.send(results)
  });
});

    
app.listen(5501, () => console.log('Server running on port 5501'));