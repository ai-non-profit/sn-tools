import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { getAuthenticatedClient } from "../service/google.service";
import { UploadVideoOptions } from "../dto/event";
import { google, youtube_v3 } from "googleapis";
import fs from "fs";
import { getSettings } from "../dal/setting";

let isProcessing = false;

const initialize = (mainWindow: BrowserWindow) => {
  ipcMain.on(IPCEvent.UPLOAD_VIDEO, async (_, data: UploadVideoOptions) => {
    if (isProcessing) {
      console.log("Upload already in progress");
      mainWindow.webContents.send(IPCEvent.UPLOAD_VIDEO_PROGRESS, {
        event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
        data: {
          error: true,
          message: "Upload in progress",
          percent: 50
        }
      });
      return;
    }
    console.log("upload video:", data);
    const setting = getSettings();

    const editDir = setting?.downloadDir + "/edited";

    try {
      //TODO: Handle percentage
      for (const video of data.videos) {
        const filePath = video.videoURL ?? editDir + "/" + video.fileName;

        const res = await uploadVideo(filePath, video);
        console.log('Upload response:', res);
      }

      mainWindow.webContents.send(IPCEvent.UPLOAD_VIDEO_PROGRESS, {
        event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
        data: {
          percent: 100
        }
      });
    } catch (err) {
      mainWindow.webContents.send(IPCEvent.UPLOAD_VIDEO_PROGRESS, {
        event: IPCEvent.UPLOAD_VIDEO_PROGRESS,
        data: {
          error: err.message,
          message: "Upload failed",
          percent: 0
        }
      });
    } finally {
      isProcessing = false;
    }
  });
}

export async function uploadVideo(path: string, body: UploadVideoOptions['videos'][0]) {
  const auth = await getAuthenticatedClient();
  const youtube = google.youtube({ version: 'v3', auth } as youtube_v3.Options);

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: body.title,
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
  });

  return response.data;
}


const initUploadVideo = initialize;

export default initUploadVideo;