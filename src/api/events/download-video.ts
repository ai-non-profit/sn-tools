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
import log from 'electron-log';

const limit = pLimit(3);
let isProcessing = false;

const initialize = (mainWindow: BrowserWindow) => {
  let downloadDir = '';
  let outroDir = '';
  let rawDir = '';

  ipcMain.on(IPCEvent.DOWNLOAD_VIDEOS, async (_, data: TikTokVideo[]) => {
    log.info('start download videos:', data.length);
    if (isProcessing) {
      log.info('Download already in progress');
      return;
    }
    isProcessing = true;

    const settings = getSettings();
    log.info(settings.tiktokCookies);

    downloadDir = settings.downloadDir + '/original';
    outroDir = settings.downloadDir + '/outro';
    rawDir = settings.downloadDir + '/raw';

    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
    if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);
    if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir);

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
            log.info('File downloaded to:', pth);
            if (!startOutro || startOutro <= 0) {
              // if not manually set, calculate startOutro based on duration
              if (!transcript || transcript.length === 0) {
                const rs = await getTranscript(author.uniqueId, id, music.playUrl, settings.tiktokCookies);
                transcript = rs.data;
              }
              log.info(transcript);
              if (transcript?.length) {
                const lastTranscript = transcript[transcript.length - 1];
                startOutro = lastTranscript && lastTranscript.end_time < duration * 1000
                  ? lastTranscript.end_time / 1000
                  : lastTranscript.start_time / 1000;
              }
            }
            startOutro = startOutro || duration - 5; // Default to 5 seconds before the end if not specified
            const outroPath = await cutVideo(pth, outroDir, startOutro);
            const rawPath = await cutVideo(pth, rawDir, 0, duration - startOutro);
            log.info('Outro cutted to:', outroPath);
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
                outro: outroPath,
                raw: rawPath,
              }
            };
          })
          .catch((err) => {
            log.error(err);
            log.error('Error downloading file:', err.message);
            return d;
          })
      );
    });

    Promise.all(tasks)
      .then((tasks) => {
        log.info('All files downloaded');
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 100,
            message: 'Download completed',
            data: tasks
          }
        });
      }).catch((err) => {
        log.error('Error downloading files:', err.message);
        mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          event: IPCEvent.DOWNLOAD_PROGRESS,
          data: {
            percent: 0,
            message: 'Download failed',
            error: err.message,
          }
        });
      }).finally(() => {
        isProcessing = false;
      }
    );
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

/**
 * Cuts a video from startSecond to endSecond and saves it to outroDir.
 * @param videoPath Path to the input video file.
 * @param outDir Directory to save the cut video.
 * @param startSecond Start time in seconds.
 * @param endSecond End time in seconds.
 * @returns Promise<string> - Path to the output video.
 */
const cutVideo = (
  videoPath: string,
  outDir: string,
  startSecond: number,
  endSecond?: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let durationArg = '';
    if (typeof endSecond === 'number' && endSecond > startSecond) {
      durationArg = `-t ${endSecond - startSecond}`;
    }
    const outputPath = `${outDir}/${path.basename(videoPath)}`;
    const command = `"${ffmpegPath}" -y -ss ${startSecond} -i "${videoPath}" -movflags +faststart ${durationArg} -c copy "${outputPath}"`;

    exec(command, (err) => {
      if (err) reject(err);
      else resolve(outputPath);
    });
  });
};

const initDownload = initialize;

export default initDownload;