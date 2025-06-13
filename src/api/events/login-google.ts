import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { getAuthenticatedClient } from "../service/google.service";
import log from 'electron-log';

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.LOGIN_GOOGLE, async (event) => {
    log.info("Login google:");

    const client = await getAuthenticatedClient();
    log.info(client);
    
    

    // Do something with data (like start a download process)
  });
}

const initLoginGoogle = initialize;

export default initLoginGoogle;