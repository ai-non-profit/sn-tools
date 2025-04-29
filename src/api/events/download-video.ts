import { ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";

ipcMain.on(IPCEvent.DOWNLOAD_VIDEO, (event, data) => {
  console.log("Received data from renderer:", data);

  // Do something with data (like start a download process)
});

export default {};