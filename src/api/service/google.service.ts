import { google } from 'googleapis';
import open from 'open';
import http from 'http';

const CLIENT_ID = '297448176893-vmdvt5uvt2i8j5gh1iqab5v0bee7ht1h.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:10002/oauth2callback';
export const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export async function getAuthenticatedClient() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload', 'profile', 'email'],
  });
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    // @ts-ignore
    const server = http.createServer(async (req: any, res: any) => {
      if (req.url.startsWith('/oauth2callback')) {
        const url = new URL(req.url, REDIRECT_URI);
        const code = url.searchParams.get('code');
        const {tokens} = await oauth2Client.getToken(code);
        setTimeout(() => {
          server.close(() => console.log('OAuth server closed.'));
        }, 3000);
        res.end('Authenticated! You can close this.');
        resolve(tokens);
      }
    });

    await server.listen(10002);
    await open(authUrl);
    setTimeout(() => {
      server.close(() => {
        console.log('OAuth server closed due to timeout.');
        resolve(null); // Resolve with null if no response after timeout
      });
    }, 60000); // Wait for 10 seconds before closing the server if no response
  });
}
