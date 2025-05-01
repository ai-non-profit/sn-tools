import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { getAuthenticatedClient } from "../service/google.service";

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.LOGIN_GOOGLE, async (event) => {
    console.log("Login google:");

    const client = await getAuthenticatedClient();
    console.log(client);
    
    

    // Do something with data (like start a download process)
  });
}

const initLoginGoogle = initialize;

export default initLoginGoogle;