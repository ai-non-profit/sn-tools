import { google } from 'googleapis';
import open from 'open';
import http from 'http';

const serviceAccount = {
  "type": "service_account",
  "project_id": "chromeextension-457909",
  "private_key_id": "aa3e5dfd01b3e91ab22aa7cb5cea33221cb8cb58",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDXjEwGO2u3Xxuu\nrkNw9LCW2LIMvkDmj/pw1FAzCBOdgVHbaA5SX0shPqKZCCEKDyNqbQGf3ZFDl98O\nHQSWyw81MZE9Kjq5AaokLJAF/RxU79MvMhDlZsVTFU+uP1Mz8e8wH+L5JBnGCfZX\nIXI8QohNyxzYVCMaHEF3qJlE+b2ph+0roJAbJfeqYAzbeQbwTH0uAIuQo4xpIiCa\nbC9Bk7UdVEV6v7MVq56SH1ue1MUx5ExJ2untgPNI1hS69LzUzI34OGkOpk09jdcr\nPSElyXQwF6Ccgw7kHQQeqxjwZtGY0adVU/UAtFq8+8szsGLzSTS87ACOvdFMG1IE\nnVCUvLmNAgMBAAECggEAMKMTtIRL9gCb+nqP9TkBb8hNxNpZQq1SUYtW3W0BIBVC\nJ0P/l06xYTsE7YsMCX0I/MbECxKv6JSoXELn+i6vq80XfLm+rmhVv/veM7u9XN0Q\nxiGB9oGOHQU+CY94cswwsKdBS/59YlZ1I4wEftx0bTlbtOSnVwjxLNL6YroHtezv\n6ILDyk4xIaov4+MRltxS3Crn52Z/9h2vN5R39/q/jsFg5Nn93jTFcxKoiqTKWWJS\nsXBtqLrrCbVCOreuerMHkYDLiC/01vqGnpcpu16hpxJIk2l1Dr4fFMKNMnuGR9T5\nLSWIGTZDexVtgKYLPkZB81IGd6Tak4rf+jmYLAuRAQKBgQDwrUzCXvBp20YSBYXU\n5115f0fsauEu5Ow5nR0yJbe9qoz+3aALK9/djbFgm/fXV8B2gqM/n7a3siJ4Hr73\nEaTIypBN0noLfL7H5bvyLFwnAcBX7sSARG/Vb/j4sPjz2V5CzO5XPyj10DoVHzLU\nhAO72a6By/v/F438LXNc2QgS3QKBgQDlRW5ACmwPTNzg5u7gbjTaZ14vn2G1uW6F\nm9EKDMk1iQ8ol4i5JuTTpaGBdoyEoXxUSyUfhCM3j8Wd22Xglpq/Wj6O/wnBQJPT\nxTs9eNUDZ78WuTQyYq+BT7twsWT9Vbnd89GeDgUL2h0sl5Rownpw5aoKeA2bN7ZW\nPKZ7oiiecQKBgQDNDgnxLOxOdGkN37C3xWwJoR0JW8KBrr9pEuiWGjajHRVF7FN4\nUShJ3ng65IfT7ErpbcJi6dPGTLo7d46ieGDaRmOOOn6LHPx62cw4t/zHqyFSifbX\nhfd2dRE96aIiOJer+Gg043YlgQSLjGpFUDjSKtQYeFA6dboeGidI+wx67QKBgQCR\n+4h8rGYrw9QsO77EFkf+/KxjBEfRzvVJi3IpxQRk2xVU0k/THKm8/Yx9g39rf+tL\nPOGxVJCb8yZwId+Xhi2YQ5zrrgaHD1hREhdrR8HSPj/U9y3+GwoG+z6tPbbA+9Gy\nOmoxClo6NrI2z3lGzvXpZsLDkbeQKoQmGs4ikJjucQKBgQCv0aEuL6TPqZ4HaoXZ\nBMUexUWUzGDpg1baIGh6UveJu972lxoccLlFs3BV0gvyCSEy4mtZ/H04Sulpo4Ud\nJLQjup3M48e7EXJMTs+IqQyyBhnONYyArKe7uwbGu511HjvKiin/Q8eqeHba8fdo\nu0Ey5IWMOzirYI6Zd/pTrE0+qg==\n-----END PRIVATE KEY-----\n",
  "client_email": "sn-tools@chromeextension-457909.iam.gserviceaccount.com",
  "client_id": "108562485293685117287",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sn-tools%40chromeextension-457909.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

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
        const { tokens } = await oauth2Client.getToken(code);
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

export function getAuthenticatedServiceAccountClient() {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key,
    scopes
  );
  return jwtClient;
}