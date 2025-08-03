
import { exec } from 'child_process';
import { ffmpegPath } from '../util';
import log from 'console';
import { YTResponse } from '../dto/youtube';
import { getAuthenticatedServiceAccountClient } from './google.service';
import { google } from 'googleapis';

const ytHeaders = new Headers();
ytHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
ytHeaders.append("accept-language", "en-us,en;q=0.5");
ytHeaders.append("content-type", "application/json");
ytHeaders.append("origin", "https://www.youtube.com");
ytHeaders.append("priority", "u=1, i");
ytHeaders.append("referer", "https://www.youtube.com/");
ytHeaders.append("sec-ch-ua", "\"Brave\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"");
ytHeaders.append("sec-ch-ua-arch", "\"x86\"");
ytHeaders.append("sec-ch-ua-bitness", "\"64\"");
ytHeaders.append("sec-ch-ua-full-version-list", "\"Brave\";v=\"137.0.0.0\", \"Chromium\";v=\"137.0.0.0\", \"Not/A)Brand\";v=\"24.0.0.0\"");
ytHeaders.append("sec-ch-ua-mobile", "?0");
ytHeaders.append("sec-ch-ua-model", "\"\"");
ytHeaders.append("sec-ch-ua-platform", "\"Linux\"");
ytHeaders.append("sec-ch-ua-platform-version", "\"6.8.0\"");
ytHeaders.append("sec-ch-ua-wow64", "?0");
ytHeaders.append("sec-fetch-dest", "empty");
ytHeaders.append("sec-fetch-mode", "cors");
ytHeaders.append("sec-fetch-site", "same-origin");
ytHeaders.append("sec-gpc", "1");
ytHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36");
ytHeaders.append("x-goog-visitor-id", "CgtBVDBKaVRhUUtwdyih58HCBjIKCgJWThIEGgAgTw%3D%3D");
ytHeaders.append("x-youtube-client-name", "28");
ytHeaders.append("x-youtube-client-version", "1.60.19");

export const formatVideo = (inputPath: string, outputPath: string): Promise<void> => {

  const cmd = `"${ffmpegPath}" -y -i ${inputPath} -c:v libx264 -c:a aac ${outputPath}`;

  log.info(`Executing command: ${cmd}`);

  return new Promise<void>((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        log.error(stderr);
        return reject(err);
      }
      log.info(`✅ Created: ${outputPath}`);
      resolve();
    });
  });
}

export const getInfoYT = async (videoId: string, options: { format?: string } = {}): Promise<YTResponse> => {
  const raw = JSON.stringify({
    "playbackContext": {
      "contentPlaybackContext": {
        "html5Preference": "HTML5_PREF_WANTS"
      }
    },
    "contentCheckOk": true,
    "racyCheckOk": true,
    "videoId": videoId,
    "context": {
      "client": {
        "hl": "en",
        "timeZone": "UTC",
        "utcOffsetMinutes": 0,
        "clientName": "ANDROID_VR",
        "clientVersion": "1.60.19",
        "deviceMake": "Oculus",
        "deviceModel": "Quest 3",
        "androidSdkVersion": 32,
        "userAgent": "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip",
        "osName": "Android",
        "osVersion": "12L"
      }
    }
  });

  const requestOptions = {
    method: "POST",
    headers: ytHeaders,
    body: raw,
    redirect: "follow"
  };

  const res = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", requestOptions as any);
  console.log(res);
  if (!res.ok) {
    const errorText = await res.text();
    log.error(`Failed to download YouTube video: ${errorText}`);
    throw new Error(`YouTube API request failed with status ${res.status}`);
  }
  return res.json();
}

export const getGoogleSheetsData = async (spreadsheetId: string, range = 'Sheet1!A1:Z100'): Promise<any> => {
  const jwtClient = getAuthenticatedServiceAccountClient();
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    log.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}