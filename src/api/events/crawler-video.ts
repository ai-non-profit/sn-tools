import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { headlessConfig, headless } from "src/api/util/headless";
import { saveTiktokCookie } from "../dal/token";
import { joinCookie } from "../util";
import { getSettings } from "../dal/setting";

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.CRAWLER_VIDEO, async (event, { search }) => {
    console.log("Start crawler video from tiktok:", search);

    const { data, cookie }: any = await tryFirstRequest(search);
    // const data = mockData.data;

    saveTiktokCookie(joinCookie(cookie));

    // TODO: Continue get data
    mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
      event: IPCEvent.SHOW_VIDEO,
      data: data.filter((d: any) => d.type === 1),
    });

    // Do something with data (like start a download process)
  });
}

const tryFirstRequest = async (search: string) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const browser = await headless.launch(headlessConfig);
    const page = await browser.newPage();
    // Listen for all responses
    const settings = getSettings();
    const result: Record<string, any>[] = [];
    page.on('response', async (response) => {
      const url = response.url();

      if (url.includes('/api/search/general/full')) {
        const data = await response.json(); // or response.text()
        if (data.data) {
          result.push(...data.data);
        }
        if (data.length > settings.maxDownloads || !data.data?.length || !data.has_more) {
          setTimeout(() => {
            browser.close();
          }, 1000);
          return resolve({
            cookie: await browser.cookies(),
            headers: response.request().headers(),
            resHeaders: response.headers(),
            data: result,
          });
        }
      }
    });

    const url = `https://www.tiktok.com/search?q=${encodeURIComponent(search)}&t=${Date.now()}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      setInterval(() => window.scrollBy(0, window.innerHeight), 100);
    });
  });
}

export default initialize;