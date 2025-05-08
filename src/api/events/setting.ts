import { BrowserWindow, ipcMain, dialog } from "electron";
import { IPCEvent } from "src/util/constant";
import { getSettings, saveSettings } from "../dal/setting";
import { Settings } from "../dto/event";
import path from "path";
import { formatVideo } from "../service/video.service";

const initialize = (mainWindow: BrowserWindow) => {
  ipcMain.handle(IPCEvent.GET_SETTINGS, async (_) => {
    console.log("Get settings");
    return getSettings();
  });
  ipcMain.handle(IPCEvent.SAVE_SETTINGS, async (_, data: Partial<Settings>) => {
    console.log("Save settings");
    const currSettings = getSettings();
    if (data.outroPath && currSettings.outroPath !== data.outroPath) {
      const normalizeOutroPath = path.join(data.downloadDir ?? currSettings.downloadDir, 'normalize_outro.mp4');
      await formatVideo(data.outroPath, normalizeOutroPath);
      data.normalizeOutroPath = normalizeOutroPath;
    }
    saveSettings({ ...currSettings, ...data });
    return true;
  });

  ipcMain.handle(IPCEvent.SELECT_FOLDER, async (_) => {
    console.log("Select folder");
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    if (result.canceled) {
      return null;
    }
    const folderPath = result.filePaths[0];
    console.log("Selected folder:", folderPath);
    return folderPath;
  });

  ipcMain.handle(IPCEvent.SELECT_FILE, async (_, data = ['mp4', 'mov']) => {
    console.log("Select file");
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'All Files MP4, MOV', extensions: data },
        // Optionally: { name: 'Videos', extensions: ['mp4', 'mov'] },
      ],
    });
    if (result.canceled) {
      return null;
    }
    const folderPath = result.filePaths[0];
    console.log("Selected folder:", folderPath);
    return folderPath;
  });
}

const initSelectFolder = initialize;

export default initSelectFolder;
