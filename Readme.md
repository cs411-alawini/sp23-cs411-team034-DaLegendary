# sp23-cs411-team034-DaLegendary


# Introduction
This project aims to develop a hot video recommendation application based on the dataset of daily trending YouTube Videos. The application will utilize the data from the USA region to provide recommendations that match users’ interests and preferences. The data includes video title, channel title, publish time, tags, views and so on, which will be used to determine the popularity and relevance of the videos.

The goal of this project is to provide users with a seamless experience of discovering new and trending videos on Youtube and to solve the problem of overwhelming choices by
presenting them with personalized and relevant recommendations. The application will consider factors such as the category of the video and the popularity of the video to provide accurate and relevant recommendations. Overall, this project will provide a simple and efficient way for users to discover new and interesting videos.
# Quick Start
```bash
# To run the client
cd client
npm install
npm start
```
```bash
# To run the server
cd server
python app.py
```

# Functionality
## CURD Operations
### Insert
User can save videso to the target watchlist.
![](/images/insert.gif)

### Search
User can get the recommendation videos based on the input keyword and selected video categories.
![](/images/search.gif)

### Update
User can update the name of selected watchlist.
![](/images/update.gif)

### Delete
User can delete the selected video from target watchlist.
![](/images/delete.gif)

## Advanced Queries

### Advanced SQL Query1
This SQL query is used to count the number of favorite videos for each video category and sort the result by the number of favorite videos in descending order. As the dataset only contains 13 categories, we did not use the LIMIT clause to select the top `15` rows.
![](/images/query1.gif)

### Advanced SQL Query2
This query is finding the 15 most popular videos with at least `10,000` views that have a high proportion of likes relative to their total reactions based on the most recent record of each video information. Since there are many records for each video on different trending dates, this approach helps to ensure that the query results only contain the most recent information.
![](/images/query2.gif)

## Other
We also implemented two triggers to update the date for `most favoried videos`. Whenever a newly added video meets certain criteria `(like_ratio > 0.95 and total_votes >= 10000)`, the information of that video will be recorded, and then the users can go to the `MostFavoriedVideos` page to see which movies are currently collected by all the users.
![](/images/mostFavoriedVideos.gif)
