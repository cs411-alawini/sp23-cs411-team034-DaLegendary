async function getVideoMetadata() {
  const { google } = require('googleapis');
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  });
  const client = await auth.getClient();
  const youtube = google.youtube({ version: 'v3' });
  const response = await youtube.videos.list({
    id: 'gdZLi9oWNZg',
    part: 'snippet,statistics',
  });
  console.log(response.data);
}

getVideoMetadata();