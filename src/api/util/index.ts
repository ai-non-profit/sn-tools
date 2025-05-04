import path from "path";
import { Cookie } from "puppeteer";

export const ffmpegPath = path.join(process.resourcesPath, 'bin', 'ffmpeg');

console.log(ffmpegPath)

export const joinCookie = (cookies: Cookie[]): string => {
  return cookies
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join("; ");
};