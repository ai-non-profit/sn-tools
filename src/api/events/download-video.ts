import { BrowserWindow, ipcMain } from 'electron';
import { IPCEvent } from 'src/util/constant';
import { TikTokVideo } from '../dto/event';
import path from 'path';
import fs from 'fs';
import pLimit from 'p-limit';
import got from 'got';
import { exec } from 'child_process';
import { getSettings } from '../dal/setting';
import { ffmpegPath } from '../util';
import { getTranscript } from 'src/api/events/version';

const limit = pLimit(3);

const initialize = (mainWindow: BrowserWindow) => {
  let downloadDir = '';
  let outroDir = '';

  ipcMain.on(IPCEvent.DOWNLOAD_VIDEOS, async (_, data: TikTokVideo[]) => {
    console.log('start download videos:', data.length);

    const settings = getSettings();
    console.log(settings.tiktokCookies);

    downloadDir = settings.downloadDir + '/original';
    outroDir = settings.downloadDir + '/outro';

    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
    if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);

    const tasks = data.map((d) => {
      // eslint-disable-next-line prefer-const
      let { id, video, music, author, transcript, startOutro } = d;
      const { duration, format } = video;
      const url = video.playAddr || video.downloadAddr;
      if (!url) return;
      const filename = id + '.' + format;
      const dest = path.join(downloadDir, filename);
      return limit((): Promise<TikTokVideo> =>
        downloadVideo(dest, url, settings.tiktokCookies)
          .then(async (pth) => {
            console.log('File downloaded to:', pth);
            if (!transcript || transcript.length === 0) {
              const rs = await getTranscript(author.uniqueId, id, music.playUrl, settings.tiktokCookies);
              if (rs.success) transcript = rs.data;
            }
            console.log(transcript);
            if (!startOutro && transcript?.length) {
              const lastTranscript = transcript[transcript.length - 1];
              startOutro = lastTranscript && lastTranscript.end_time < duration * 1000
                ? lastTranscript.end_time / 1000
                : lastTranscript.start_time / 1000;
            }
            const videoPath = await cutOutro(pth, outroDir, startOutro || duration - 5);
            console.log('Outro cutted to:', videoPath);
            return {
              ...d,
              id,
              video,
              music,
              author,
              transcript,
              startOutro,
              localPath: {
                original: dest,
                outro: path.join(outroDir, filename)
              }
            };
          })
          .catch((err) => {
            console.error('Error downloading file:', err.message);
            return d;
          })
      );
    });

    Promise.all(tasks)
      .then((tasks) => {
        console.log('All files downloaded');
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 100,
            message: 'Download completed',
            data: tasks
          }
        });
      }).catch((err) => {
        console.error('Error downloading files:', err.message);
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 0,
            message: 'Download failed',
            error: err.message,
          }
        });
      });
  });
};

const downloadVideo = (path: string, url: string, cookies: string): Promise<string> => {
  const file = fs.createWriteStream(path);

  const stream = got.stream(url,
    {
      http2: true,
      headers: {
        'cookie': cookies,
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

const cutOutro = (videoPath: string, outroDir: string, startOutro: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const command = `${ffmpegPath} -y -ss ${startOutro} -i "${videoPath}" -movflags +faststart -t 5 -c copy "${outroDir}/${path.basename(videoPath)}"`;

    exec(command, (err) => {
      if (err) reject(err);
      else resolve(videoPath);
    });
  });

};

const initDownload = initialize;

export default initDownload;