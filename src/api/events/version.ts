import { app, BrowserWindow, ipcMain } from 'electron';
import { IPCEvent } from 'src/util/constant';
import { getSettings } from '../dal/setting';
import { TranscriptRequest } from 'src/util/dto';

async function getVideoInformation(creatorId: string, videoId: string, cookies: string): Promise<Record<string, any>> {
  const videoInfo = await fetch(`https://www.tiktok.com/@${creatorId}/video/${videoId}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Cookie': cookies,
    }
  });
  const html = await videoInfo.text();
  const match = html.match(
    /<script\s+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"\s+type="application\/json">\s*([\s\S]*?)\s*<\/script>/i
  );

  if (!match) {
    throw new Error('Script tag not found');
  }

  const jsonStr = match[1].trim();

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to parse JSON:', err);
    return null;
  }
}

export async function getTranscript(creatorId: string, videoId: string, musicURL: string, cookies: string): Promise<any> {
  if (!musicURL) {
    const videoInfo = await getVideoInformation(creatorId, videoId, cookies);
    musicURL = videoInfo?.__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo?.itemStruct?.music?.playUrl;
  }
  console.log('musicURL', musicURL);

  const musicRes = await fetch(musicURL, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Cookie': cookies,
    }
  });

  if (!musicRes.ok) {
    throw new Error(`Failed to fetch music: ${musicRes.statusText}`);
  }

  const musicBlob = await musicRes.blob();
  const formData = new FormData();
  formData.append('file', musicBlob);
  formData.append('creatorId', creatorId);
  formData.append('videoId', videoId);

  const res = await fetch('https://www.kolsprite.com/v1/plugin/caption/file', {
    method: 'POST',
    body: formData
  });

  try {
    return await res.json();
  } catch (e) {
    console.log(res);
    throw e;
  }
}

const initialize = (_: BrowserWindow) => {
  ipcMain.handle(IPCEvent.GET_VERSION, async (_) => {
    return app.getVersion();
  });

  ipcMain.handle(IPCEvent.GET_TRANSCRIPT, async (_, {creatorId, videoId, musicURL}: TranscriptRequest) => {
    const settings = getSettings();
    const cookies = settings.tiktokCookies;
    return getTranscript(creatorId, videoId, musicURL, cookies);
  });
};

const initVersion = initialize;

export default initVersion;
