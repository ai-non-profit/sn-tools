import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { EditOptions } from "../dto/event";
import path from "path";
import fs, { unlink, unlinkSync } from "fs";
import { exec } from "child_process";
import { getSettings } from "../dal/setting";
import { ffmpegPath } from "../util";

let isRunning = false;

const initialize = (mainWindow: BrowserWindow) => {
  let downloadDir = path.resolve("downloads/original");
  let outroDir = path.resolve("downloads/outro");
  let editDir = path.resolve("downloads/edited");

  ipcMain.on(IPCEvent.EDIT_VIDEO, async (_, { videoPath, videos }: EditOptions) => {
    console.log("Start edit video");
    if (isRunning) {
      console.warn("Edit process is already running. Ignoring this request.");
      return;
    }
    isRunning = true;

    const settings = getSettings();
    downloadDir = settings.downloadDir + "/original";
    outroDir = settings.downloadDir + "/outro";
    editDir = settings.downloadDir + "/edited";
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
    if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);
    if (!fs.existsSync(editDir)) fs.mkdirSync(editDir);


    const editPath = [];
    try {
      for (const video of videos) {
        try {
          await appendOutroToVideo(video.localPath.raw, videoPath ?? settings.normalizeOutroPath, editDir);
          editPath.push(path.join(editDir, path.basename(video.localPath.raw)));
        } catch (err) {
          console.error(`❌ Failed to process ${video}`, err);
          editPath.push(null);
        }
      }

      mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
        event: IPCEvent.EDIT_VIDEO_PROGRESS,
        data: {
          percent: 100,
          data: editPath
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
    } finally {
      isRunning = false;
    }

    // Do something with data (like start a download process)
  });
}

function isVideoFile(filename: string): boolean {
  return /\.(mp4|mov|mkv|avi)$/i.test(filename);
}


export async function appendOutroToVideo(videoPath: string, outroPath: string, outputPath: string): Promise<void> {
  const dirname = path.dirname(videoPath);
  const tempListPath = path.join(dirname, 'concat_list.txt');

  // const normalizePath = path.join(dirname, 'normalize_' + path.basename(videoPath));
  // await formatVideo(videoPath, normalizePath);

  const content = `file '${videoPath.replace(/'/g, "'\\''")}'\nfile '${outroPath.replace(/'/g, "'\\''")}'`;
  fs.writeFileSync(tempListPath, content);

  const cmd = `${ffmpegPath} -y -f concat -safe 0 -i "${tempListPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${outputPath}/${path.basename(videoPath)}"`;

  console.log(`Executing command: ${cmd}`);

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      unlinkSync(tempListPath);
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