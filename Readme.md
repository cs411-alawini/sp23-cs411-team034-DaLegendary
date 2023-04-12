# sp23-cs411-team034-DaLegendary
This is the repository to store the project of team034.

# Functionality
## Insert
User can save videso to the target watchlist.
![](/images/insert.gif)

## Search
User can get the recommendation videos based on the input keyword and selected video categories.
![](/images/search.gif)

## Update
User can update the name of selected watchlist.
![](/images/update.gif)

## Delete
User can delete the selected video from target watchlist.
![](/images/delete.gif)

## Advanced SQL Query1
This SQL query is used to count the number of favorite videos for each video category and sort the result by the number of favorite videos in descending order. As the dataset only contains 13 categories, we did not use the LIMIT clause to select the top 15 rows.
![](/images/query1.gif)

## Advanced SQL Query2
This query is finding the 15 most popular videos with at least 10,000 views that have a high proportion of likes relative to their total reactions based on the most recent record of each video information. Since there are many records for each video on different trending dates, this approach helps to ensure that the query results only contain the most recent information.
![](/images/query2.gif)