import { BrowserWindow, ipcMain } from 'electron';
import { IPCEvent } from 'src/util/constant';
import { getAuthenticatedClient, oauth2Client } from '../service/google.service';
import { UploadVideoOptions } from '../dto/event';
import { google, youtube_v3 } from 'googleapis';
import fs from 'fs';
import { getSettings } from '../dal/setting';
import log from 'electron-log';
import { getTokens } from '../dal/token';

let isProcessing = false;

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.UPLOAD_VIDEO, async (_, data: UploadVideoOptions) => {
    // mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
    //   event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
    //   data: {
    //     percent: 100
    //   }
    // });
    // return;
    if (isProcessing) {
      log.info('Upload already in progress');
      mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
        event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
        data: {
          error: true,
          message: 'Upload in progress',
          percent: 50
        }
      });
      return;
    }
    log.info('upload video:', data);
    const setting = getSettings();

    const editDir = setting?.downloadDir + '/edited';

    try {
      for (const video of data.videos) {
        const filePath = video.videoURL ?? editDir + '/' + video.fileName;

        const res = await uploadVideo(filePath, video, (percent) => {
          log.info('Upload progress:', percent);
          // mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
          //   event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
          //   data: {
          //     error: true,
          //     message: 'Upload in progress',
          //     percent: percent
          //   }
          // });
        });
        log.info('Upload response:', res);
        if (!res?.id) throw new Error(res);
      }
      console.log('upload completed');
      mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
        event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
        data: {
          percent: 100
        }
      });
    } catch (err) {
      log.error(err);
      mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
        event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
        data: {
          error: err.message,
          message: 'Upload failed',
          percent: 0
        }
      });
    } finally {
      isProcessing = false;
    }
  });
};

function sanitizeTitle(title: string): string {
  return title
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '') // ✅ removes all emoji
    .replace(/[\u0000-\u001F\u007F]/g, '') // ✅ removes control characters
    .trim();
}


export async function uploadVideo(path: string, body: UploadVideoOptions['videos'][0], callback?: (percent: number) => void): Promise<any> {
  const tokens = getTokens();
  const settings = getSettings();
  const defaultAccount = settings?.defaultAccount;
  const token = tokens[defaultAccount] ?? (await getAuthenticatedClient());
  oauth2Client.setCredentials(token);
  const youtube = google.youtube({version: 'v3', auth: oauth2Client} as youtube_v3.Options);
  const fileSizeInBytes = fs.statSync(path).size;
  try {
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: sanitizeTitle(body.title), // Use a default title if not provided
          description: body.description, // Include "#shorts"
          categoryId: body.categoryId, // People & Blogs
        },
        status: {
          privacyStatus: body.privacyStatus, // or 'public'
        },
      },
      media: {
        body: fs.createReadStream(path),
      },
    }, {
      // <-- This is the second argument, NOT inside the main object
      onUploadProgress: evt => {
        const progress = (evt.bytesRead / fileSizeInBytes) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
        callback(+progress.toFixed(2));
      },
    });
    return response?.data;
  } catch (err) {
    log.error(err);
    return err;
  }
}


const initUploadVideo = initialize;

export default initUploadVideo;