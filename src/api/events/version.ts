import { BrowserWindow, ipcMain, app } from "electron";
import { IPCEvent } from "src/util/constant";

const initialize = (_: BrowserWindow) => {
  ipcMain.handle(IPCEvent.GET_VERSION, async (_) => {
    return app.getVersion();
  });

}

const initVersion = initialize;

export default initVersion;
