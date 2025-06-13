import { getAuthenticatedClient } from './google.service';
import { google } from 'googleapis';

describe('getAuthenticatedClient', () => {

  it('should return oauth2Client with cached tokens if useCache is true and tokens exist', async () => {
    const auth = await getAuthenticatedClient(false);
    const people = google.people({ version: 'v1', auth } as any);
    const me = await people.people.get({
      resourceName: 'people/me',
    });
    console.log(me);
  });
});