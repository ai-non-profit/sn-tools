import { google } from 'googleapis';
import open from 'open';
import http from 'http';
import { getTokens, saveTokens } from '../dal/token';

export async function getAuthenticatedClient() {
  const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
  console.log(CLIENT_ID, CLIENT_SECRET);
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const tokens = getTokens();
  if (tokens) {
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  });

  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith('/oauth2callback')) {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get('code');
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      saveTokens(tokens);
      res.end('Authenticated! You can close this.');
      server.close();
    }
  });

  await server.listen(3000);
  await open(authUrl);
  return new Promise((resolve) => server.on('close', () => resolve(oauth2Client)));
}
