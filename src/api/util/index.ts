import path from "path";
import isDev from "electron-is-dev";

export const ffmpegPath =
  isDev
    ? path.join(__dirname, '..', '..', 'bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg')
    : path.join(process.resourcesPath, 'bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');

// export const ffmpegPath = 'ffmpeg';
