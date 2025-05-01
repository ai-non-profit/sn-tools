import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "src/util/constant";
import { headlessConfig, headless } from "src/api/util/headless";
import mockData from "test/crawler-video.json";

const initialize = (mainWindow: BrowserWindow) => {

  ipcMain.on(IPCEvent.CRAWLER_VIDEO, async (event, { search }) => {
    console.log("Received data from renderer:", search);

    // const { data, headers }: any = await tryFirstRequest(search);
    const data = mockData.data;

    // TODO: Continue get data
    mainWindow.webContents.send(IPCEvent.FROM_MAIN, {
      event: IPCEvent.SHOW_VIDEO,
      data: data.filter((d: any) => d.type === 1)
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
    page.on('response', async (response) => {
      const url = response.url();

      if (url.includes('/api/search/general/full')) {
        const data = await response.json(); // or response.text()
        setTimeout(() => {
          browser.close();
        }, 1000);
        resolve({
          headers: response.request().headers(),
          data: data.data,
        });
      }
    });

    const url = `https://www.tiktok.com/search?q=${encodeURIComponent(search)}&t=${Date.now()}`;
    await page.goto(url, { waitUntil: "networkidle2" });
  });
}

export default initialize;