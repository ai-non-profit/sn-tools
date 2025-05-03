import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { VideoDownloads } from "../dto/event";
import path from "path";
import fs from "fs";
import pLimit from "p-limit";
import got from "got";
import { exec } from "child_process";
import { getTiktokCookie } from "../dal/token";

const downloadDir = path.resolve("downloads/original");
const outroDir = path.resolve("downloads/outro");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);

const limit = pLimit(3);

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.DOWNLOAD_VIDEOS, async (event, data: VideoDownloads) => {
    console.log("start download videos:", data.length);

    const tasks = data.map(({ id, url, duration }) => {
      if (!url) return;
      return limit(() =>
        downloadVideo(id, url, mainWindow)
          .then(async (dest) => {
            console.log("File downloaded to:", dest);
            const videoPath = await cutOutro(dest, duration);
            console.log("Outro cutted to:", videoPath);
          })
          .catch((err) => {
            console.error("Error downloading file:", err.message);
          })
      );
    });

    Promise.all(tasks)
      .then(() => {
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 100,
            message: "Download completed",
          }
        });
      }).catch((err) => {
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

const downloadVideo = (id: string, url: string, mainWindow: BrowserWindow, format = "mp4"): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  const filename = id + "." + format;
  const dest = path.join(downloadDir, filename);
  const file = fs.createWriteStream(dest);

  console.log(getTiktokCookie());

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
    file.on('finish', () => resolve(dest));
    file.on('error', reject);
  });

};

const cutOutro = (videoPath: string, duration: number, outroDur = 5) => {
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