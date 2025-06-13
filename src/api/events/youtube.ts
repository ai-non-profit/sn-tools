import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { getAuthenticatedClient } from "../service/google.service";
import { google } from "googleapis";
import { getTokens, saveTokens } from "../dal/token";


const initialize = (_: BrowserWindow) => {
  ipcMain.handle(IPCEvent.LOGIN_YOUTUBE, async (_) => {
    const tokens = getTokens();
    const auth = await getAuthenticatedClient();
    const people = google.people({ version: 'v1', auth } as any);
    const me = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });
    const email = me.data.emailAddresses?.[0]?.value;
    if (!email) {
      return {
        error: true,
        message: "No email found in Google account",
      }
    }
    tokens[email] = auth;
    saveTokens(tokens);
    return {
      error: false,
      message: "YouTube login successful",
    }
  });
}


const initYoutube = initialize;

export default initYoutube;