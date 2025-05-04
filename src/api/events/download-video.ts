import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { VideoDownloads } from "../dto/event";
import path from "path";
import fs from "fs";
import pLimit from "p-limit";
import got from "got";
import { exec } from "child_process";
import { getTiktokCookie } from "../dal/token";
import { getSettings } from "../dal/setting";

const limit = pLimit(3);

const initialize = (mainWindow: BrowserWindow) => {
  let downloadDir = '';
  let outroDir = '';

  ipcMain.on(IPCEvent.DOWNLOAD_VIDEOS, async (_, data: VideoDownloads) => {
    console.log("start download videos:", data.length);

    const settings = getSettings();

    downloadDir = settings.downloadDir + "/original";
    outroDir = settings.downloadDir + "/outro";

    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
    if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);

    const tasks = data.map(({ id, url, duration, format = 'mp4' }) => {
      if (!url) return;
      const filename = id + "." + format;
      const dest = path.join(downloadDir, filename);
      return limit(() =>
        downloadVideo(dest, url)
          .then(async (path) => {
            console.log("File downloaded to:", path);
            const videoPath = await cutOutro(path, duration, outroDir);
            console.log("Outro cutted to:", videoPath);
          })
          .catch((err) => {
            console.error("Error downloading file:", err.message);
          })
      );
    });

    Promise.all(tasks)
      .then(() => {
        console.log("All files downloaded");
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 100,
            message: "Download completed",
          }
        });
      }).catch((err) => {
        console.error("Error downloading files:", err.message);
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 0,
            message: "Download failed",
            error: err.message,
          }
        });
      });
  });
}

const downloadVideo = (path: string, url: string): Promise<string> => {
  const file = fs.createWriteStream(path);

  const stream = got.stream(url,
    {
      http2: true,
      headers: {
        'cookie': getTiktokCookie(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
      }
    } as any);
  return new Promise((resolve, reject) => {
    stream.pipe(file);

    stream.on('error', reject);
    file.on('finish', () => resolve(path));
    file.on('error', reject);
  });

};

const cutOutro = (videoPath: string, duration: number, outroDir: string, outroDur = 5, ) => {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -y -ss ${duration - outroDur} -i "${videoPath}" -movflags +faststart -t 5 -c copy "${outroDir}/${path.basename(videoPath)}"`;

    exec(command, (err) => {
      if (err) reject(err);
      else resolve(videoPath);
    });
  });

}

const initDownload = initialize;

export default initDownload;