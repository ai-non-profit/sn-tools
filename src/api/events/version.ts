import { app, BrowserWindow, ipcMain } from 'electron';
import { IPCEvent } from 'src/util/constant';
import { getSettings } from '../dal/setting';
import { TranscriptRequest } from 'src/util/dto';

interface Options {
  startDate: number;
  endDate: number;
  maxDownloads: number;
}

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

export async function searchTiktok(search: string, cookies: string, { maxDownloads, startDate, endDate }: Options): Promise<any> {
  console.log(startDate);
  console.log(endDate);
  const options = {
    method: 'GET',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.8',
      priority: 'u=1, i',
      'sec-ch-ua': '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      Cookie: cookies
    }
  };
  const params = new URLSearchParams({
    WebIdLastTime: Date.now().toString(),
    aid: '1988',
    app_language: 'en',
    app_name: 'tiktok_web',
    browser_language: 'en-US',
    browser_name: 'Mozilla',
    browser_online: 'true',
    browser_platform: 'Linux x86_64',
    browser_version: '5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    channel: 'tiktok_web',
    cookie_enabled: 'true',
    data_collection_enabled: 'true',
    device_id: '7497448105643329031',
    device_platform: 'web_pc',
    device_type: 'web_h264',
    focus_state: 'true',
    from_page: 'search',
    history_len: '3',
    is_fullscreen: 'false',
    is_page_visible: 'true',
    keyword: search,
    odinId: '7497447860569588754',
    os: 'linux',
    region: 'VN',
    screen_height: '1050',
    screen_width: '1680',
    search_source: 'normal_search',
    tz_name: 'Asia/Saigon',
    user_is_login: 'false',
    web_search_code: '{"tiktok":{"client_params_x":{"search_engine":{"ies_mt_user_live_video_card_use_libra":1,"mt_search_general_user_live_card":1}},"search_server":{}}}',
    webcast_language: 'en',
  });
  let url = 'https://www.tiktok.com/api/search/general/full/?' + params.toString();
  const result: any[] = [];
  let json: any = null;
  main: do {
    console.count('Page');
    url = 'https://www.tiktok.com/api/search/general/full/?' + params.toString();
    const res = await fetch(url, options);
    json = await res.json();
    const msToken = res.headers.get('set-cookie') || '';
    params.set('focus_state', 'false');
    params.set('msToken', msToken.match(/msToken=([^;]+)/)[1]);
    params.set('offset', json?.cursor || '0');
    if (!params.has('search_id')) {
      params.set('search_id', json?.extra?.logid || '');
    }
    options.headers.Cookie = cookies + '; ' + msToken;
    for (const { type, item } of json?.data || []) {
      if (type !== 1 || item.createTime <= startDate || item.createTime >= endDate) continue;
      result.push(item);
      if (result.length >= maxDownloads) {
        console.log('Max downloads reached:', maxDownloads);
        break main;
      }
    }
  } while (json?.has_more === 1)
  console.countReset('Page');
  return {
    success: true,
    data: result,
  };
}

const initialize = (_: BrowserWindow) => {
  ipcMain.handle(IPCEvent.GET_VERSION, async (_) => {
    return app.getVersion();
  });

  ipcMain.handle(IPCEvent.GET_TRANSCRIPT, async (_, { creatorId, videoId, musicURL }: TranscriptRequest) => {
    const settings = getSettings();
    const cookies = settings.tiktokCookies;
    return getTranscript(creatorId, videoId, musicURL, cookies);
  });

  ipcMain.handle(IPCEvent.CRAWLER_VIDEO, async (_, { search, type, options }) => {
    const settings = getSettings();
    const cookies = settings.tiktokCookies;
    const maxDownload = settings.maxDownloads || 100;
    try {
      return searchTiktok(search, cookies, { ...options, maxDownloads: maxDownload });
    } catch (error) {
      console.error('Error fetching TikTok videos:', error);
      return {
        success: false,
        message: 'Failed to fetch TikTok videos',
        error: error.message,
      };
    }
  });
};

const initVersion = initialize;

export default initVersion;
