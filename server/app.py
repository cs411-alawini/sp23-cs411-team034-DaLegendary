from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
import pymysql
import datetime

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['JSONIFY_MIMETYPE'] = 'application/json;charset=utf-8'

# Database connection information
db = pymysql.connect(host='34.30.55.76', 
                     user='root', 
                     password='group034', 
                     db='video_info', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)

# 1.Define API route for adding videos to favorites - INSERT
@app.route('/api/add_favorite', methods=['POST'])
def add_favorite():
    try:
        # Get request data
        data = request.get_json()
        UserId= data['UserId']
        VideoId = data['VideoId']
        WatchListName = data['WatchListName']
        VideoAddedDate = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """INSERT INTO Favorites (UserId, VideoId, WatchListName, VideoAddedDate) 
                    VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (UserId, VideoId, WatchListName, VideoAddedDate))
            db.commit()
            
            return jsonify({'message': 'Favorite added successfully.'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

# 2.Define API route for searching videos - SEARCH
@app.route('/api/search', methods=['GET'])
def search_videos():
    try:
        with db.cursor() as cursor:
            CategoryName = request.args.get('CategoryName')
            UserText = request.args.get('UserText')
            print("request: ", request)
            print("CategoryName: ", CategoryName)
            if CategoryName is not None and UserText is not None:
                # Execute SQL query
                sql = """SELECT v.Title, v.VideoId, v.ChannelId, n.Likes, n.Dislikes, n.ViewCount
                    FROM Video v JOIN (
                        SELECT VideoId, ViewCount, Likes, Dislikes
                        FROM VideoStats
                        WHERE (VideoId, TrendingDate) IN (
                            SELECT VideoId, MAX(TrendingDate)
                            FROM VideoStats
                            GROUP BY VideoId
                        )
                    ) AS n USING (VideoId) 
                    WHERE v.CategoryName = %s AND v.Title LIKE CONCAT('%%', %s, '%%')
                    ORDER BY n.ViewCount DESC
                    LIMIT 15"""
                cursor.execute(sql, (CategoryName, UserText))
                # Get query results
                results = cursor.fetchall()
                # Convert results to JSON format string and encode with UTF-8
                response_data = jsonify(results).get_data().decode('utf8')
                # Create a new response object and pass the encoded string as data
                response = make_response(response_data)
                response.headers['Content-Type'] = 'application/json'
                return response
            else:
                return jsonify({'error': 'Invalid data'})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})

# 3. Define API route for updating a watchlist name - UPDATE
@app.route('/api/update_watchlistname', methods=['PUT'])
def update_watchlistname():
    try:
        with db.cursor() as cursor:
            data = request.get_json()
            UserId= data['UserId']
            NewWatchListName = data['NewWatchListName']
            WatchListName = data['WatchListName']
            # Execute SQL query
            sql = """UPDATE Favorites
                    SET WatchListName = %s
                    WHERE WatchListName = %s AND UserId = %s"""
            cursor.execute(sql, (NewWatchListName, WatchListName, UserId))
            db.commit()
          
            return jsonify({'message': 'WatchListName updated successfully'})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})

# 4. Define API route for deleting a video from favorites - DELETE
@app.route('/api/delete_video', methods=['DELETE'])
def delete_video():
    try:
        # Get the user_id and video_id from the request data
        data = request.get_json()
        UserId= data['UserId']
        VideoId = data['VideoId']
        # Open a connection to the database
        with db.cursor() as cursor:
            # Execute the DELETE statement
            sql = """DELETE FROM Favorites
                     WHERE UserId = %s AND VideoId = %s"""
            cursor.execute(sql, (UserId, VideoId))
            # Commit the changes to the database
            db.commit()
            # Return a success message
            return jsonify({'message': 'Video deleted successfully'})
    except Exception as e:
        # Rollback the changes if there's an error
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    
# 5.1 Define API route ADVANCEDSQL1 - CountCategory
@app.route('/api/countCategories', methods=['GET'])
def countCategories():
    try:
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """SELECT v.CategoryName, COUNT(*) AS num_favorites
                    FROM Video v JOIN Favorites f ON v.VideoId = f.VideoId
                    GROUP BY v.CategoryName
                    ORDER BY num_favorites DESC"""
            cursor.execute(sql)
            # Get query results
            results = cursor.fetchall()
            # Convert results to JSON format string and encode with UTF-8
            response_data = jsonify(results).get_data().decode('utf8')
            # Create a new response object and pass the encoded string as data
            response = make_response(response_data)
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})

# 5.2 Define API route ADVANCEDSQL2 - DisplayTrendingVids
@app.route('/api/trending', methods=['GET'])
def trending_videos():
    try:
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """SELECT v.Title, v.VideoId, v.ChannelId, n.Likes, n.Dislikes, n.ViewCount
                    FROM Video v JOIN (
                        SELECT VideoId, ViewCount, Likes, Dislikes
                        FROM VideoStats
                        WHERE (VideoId, TrendingDate) IN (
                            SELECT VideoId, MAX(TrendingDate)
                            FROM VideoStats
                            GROUP BY VideoId
                        )
                    ) AS n USING (VideoId) 
                    WHERE n.Likes + n.Dislikes != 0 AND n.Likes / (n.Likes + n.Dislikes) > 0.95 AND n.ViewCount >= 10000
                    ORDER BY n.ViewCount DESC
                    LIMIT 15"""
            cursor.execute(sql)
            # Get query results
            results = cursor.fetchall()
            # Convert results to JSON format string and encode with UTF-8
            response_data = jsonify(results).get_data().decode('utf8')
            # Create a new response object and pass the encoded string as data
            response = make_response(response_data)
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

#END OF BACKEND CODE.