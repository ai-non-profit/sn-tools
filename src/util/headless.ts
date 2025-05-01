import puppeteer, { VanillaPuppeteer } from 'puppeteer-extra'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

export const headlessConfig: Parameters<VanillaPuppeteer['launch']>[0] = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=640,640',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-site-isolation-trials'
  ],
  targetFilter: (target: any) => {
    if (target.type() === 'browser' || target.type() === 'tab')
      return true
    return !!target.url()
  }
};

export const headless = puppeteer;