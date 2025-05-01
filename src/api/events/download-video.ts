import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { VideoDownloads } from "../dto/event";
import path from "path";
import fs from "fs";
import pLimit from "p-limit";
import got from "got";
import { exec } from "child_process";

const downloadDir = path.resolve("downloads/original");
const outroDir = path.resolve("downloads/outro");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);

const limit = pLimit(3);

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.DOWNLOAD_VIDEOS, async (event, data: VideoDownloads) => {
    console.log("Received data from renderer:", data);

    const tasks = data.map(({ id, url, duration }) => {
      return limit(() =>
        downloadVideo(id, url, mainWindow)
          .then(async (dest) => {
            console.log("File downloaded to:", dest);
            const videoPath = await cutOutro(dest, duration);
            console.log("Outro cutted to:", videoPath);
          })
          .catch((err) => {
            console.error("Error downloading file:", err);
          })
      );
    });

    await Promise.all(tasks);

    mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
      event: IPCEvent.SHOW_VIDEO,
      data: data.filter((d: any) => d.type === 1)
    });

    // Do something with data (like start a download process)
  });
}

const downloadVideo = (id: string, url: string, mainWindow: BrowserWindow, format = "mp4"): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  const filename = id + "." + format;
  const dest = path.join(downloadDir, filename);
  const file = fs.createWriteStream(dest);

  const stream = got.stream(url,
    {
      http2: true,
      headers: {
        'cookie': 'tt_chain_token=pW4m8n/60ABC89xH6mXVAw==; passport_csrf_token=79fbe169cdefe713b9cc426e1f0778df; passport_csrf_token_default=79fbe169cdefe713b9cc426e1f0778df; odin_tt=42be8b4705a52b86909d91edfa6a1f78120e8f9f70f8ab51f0fe1c53a5f964516ba9533c7d239a9b9ae25c588b6fa07e3bffa8e81e6be0b6e2ff17bab2be67885585dcefb6974db30b3ff5d955079a6b; tt_csrf_token=PstV9ETE--u8CaGJwzlLhpdqWQXO2rwMUxVo; ttwid=1%7CtSkzoL2V3Doh11N3ayey5N2gcNOS89ybKigQccQUwxA%7C1746074286%7Cafb1d7d7fec904939ed060bdf903982253d1423dac3fd3c551061b4b37d2e36c; msToken=RlbLZ_3mFBxZPBBI0Sk-F2meZFha--GfagIqg7p-8BNDiTDaEpED4DteKnLmPSLrMa1XaCuKkWphiUaoKoI-wGpS_a7s_6aUAkWCFjW2vDfxu_CG7cVTZqyLKZn60EJU8HQbcirCcK1t-A0=',
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