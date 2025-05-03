import path from "path";
import { Cookie } from "puppeteer";

export const downloadDir = path.resolve("downloads/original");
export const outroDir = path.resolve("downloads/outro");
export const editDir = path.resolve("downloads/edited");

export const joinCookie = (cookies: Cookie[]): string => {
  return cookies
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join("; ");
};