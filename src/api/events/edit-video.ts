import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { EditOptions } from "../dto/event";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

const downloadDir = path.resolve("downloads/original");
const outroDir = path.resolve("downloads/outro");
const editDir = path.resolve("downloads/edited");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);
if (!fs.existsSync(editDir)) fs.mkdirSync(editDir);

const outroPath = path.resolve("downloads/outro.mp4");

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.EDIT_VIDEO, async (event, data: EditOptions) => {
    console.log("Start edit video:", data);

    const files = fs.readdirSync(downloadDir);
    const videoFiles = files.filter(isVideoFile);
  
    try {
      for (const file of videoFiles) {
        //TODO: Handle percentage
        const originPath = path.join(downloadDir, file);
        try {
          await appendOutroToVideo(originPath, data.videoPath ?? outroPath, editDir);
        } catch (err) {
          console.error(`❌ Failed to process ${file}`, err);
        }
      }
  
      mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
        event: IPCEvent.EDIT_VIDEO_PROGRESS,
        data: {
          percent: 100,
        }
      });
    } catch (err) {
      console.error("Error editing video:", err);
      mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
        event: IPCEvent.EDIT_VIDEO_PROGRESS,
        data: {
          percent: 0,
          message: "Edit failed",
          error: err.message,
        }
      });
    }
    
    // Do something with data (like start a download process)
  });
}

function isVideoFile(filename: string): boolean {
  return /\.(mp4|mov|mkv|avi)$/i.test(filename);
}


export function appendOutroToVideo(videoPath: string, outroPath: string, outputPath: string): Promise<void> {
  const tempListPath = path.join(path.dirname(videoPath), 'concat_list.txt');

  const content = `file '${videoPath.replace(/'/g, "'\\''")}'\nfile '${outroPath.replace(/'/g, "'\\''")}'`;
  fs.writeFileSync(tempListPath, content);

  const cmd = `ffmpeg -y -f concat -safe 0 -i "${tempListPath}" -c copy "${outputPath}/${path.basename(videoPath)}"`;

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      fs.unlinkSync(tempListPath); // clean up
      if (err) {
        console.error(stderr);
        return reject(err);
      }
      console.log(`✅ Created: ${outputPath}`);
      resolve();
    });
  });
}

const initEdit = initialize;

export default initEdit;