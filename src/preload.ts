// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IPCEvent } from "./util/constant";
import { CrossEvent } from "./api/dto/event";

contextBridge.exposeInMainWorld("electronAPI", {
  sendToMain: (channel: string, data: any) => ipcRenderer.send(channel, data),
  onMessageFromMain: (callback: (data: CrossEvent) => any) => ipcRenderer.on(IPCEvent.FROM_MAIN, (_event, data) => callback(data)),
});
