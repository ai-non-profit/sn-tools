// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IPCEvent } from "./util/constant";
import { CrossEvent } from "./api/dto/event";

contextBridge.exposeInMainWorld("electronAPI", {
  sendToMain: <T = any>(channel: string, data: T) => ipcRenderer.send(channel, data),
  invokeMain: <T = any>(channel: string, data: T) => ipcRenderer.invoke(channel, data),
  onMessageFromMain: <T = any>(callback: (data: CrossEvent<T>) => any) => ipcRenderer.on(IPCEvent.FROM_MAIN, (_event, data) => callback(data)),
   onUpdateAvailable: (callback: any) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback: any) => ipcRenderer.on('update_downloaded', callback),
});
