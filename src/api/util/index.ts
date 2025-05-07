import path from "path";
import { Cookie } from "puppeteer";
import fs from "fs";

const buildPath = path.join(process.resourcesPath, 'api', 'bin', 'ffmpeg');

export const ffmpegPath = fs.existsSync(buildPath) ? buildPath : path.resolve('.', 'src', 'api', 'bin', 'ffmpeg');

console.log(ffmpegPath);

export const joinCookie = (cookies: Cookie[]): string => {
  return cookies
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join("; ");
};