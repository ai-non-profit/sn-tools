import { google } from 'googleapis';
import open from 'open';
import http from 'http';

export async function getAuthenticatedClient() {
  const CLIENT_ID = '297448176893-vmdvt5uvt2i8j5gh1iqab5v0bee7ht1h.apps.googleusercontent.com';
  const CLIENT_SECRET = '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';
  const REDIRECT_URI = 'http://localhost:10002/oauth2callback';
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload', 'profile', 'email'],
  });

  const server = http.createServer(async (req: any, res: any) => {
    if (req.url.startsWith('/oauth2callback')) {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get('code');
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      res.end('Authenticated! You can close this.');
      server.close();
    }
  });

  await server.listen(10002);
  await open(authUrl);
  return new Promise((resolve) => server.on('close', () => resolve(oauth2Client)));
}
