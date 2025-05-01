import path from "path";
import fs from "fs";

export enum IPCEvent {
  FROM_MAIN = 'from-main',
  CRAWLER_VIDEO = 'crawler-video',
  SHOW_VIDEO = 'show-video',
  DOWNLOAD_VIDEOS = 'download-videos',
  DOWNLOAD_PROGRESS = 'download-progress',
  EDIT_VIDEO = 'edit-video',
  EDIT_VIDEO_PROGRESS = 'edit-video-progress',
  LOGIN_GOOGLE = 'login-google',
  UPLOAD_VIDEO = 'upload-video',
  UPLOAD_VIDEO_PROGRESS = 'upload-video-progress',
}

export const downloadDir = path.resolve("downloads/original");
export const outroDir = path.resolve("downloads/outro");
export const editDir = path.resolve("downloads/edited");
