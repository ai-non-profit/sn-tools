import path from "path";
import { Cookie } from "puppeteer";
import isDev from "electron-is-dev";

// export const ffmpegPath =
//   isDev
//     ? path.join(__dirname, 'bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg')
//     : path.join(process.resourcesPath, 'bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');

export const ffmpegPath = 'ffmpeg';


export const joinCookie = (cookies: Cookie[]): string => {
  return cookies
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join("; ");
};