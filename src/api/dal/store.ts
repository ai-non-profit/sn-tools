import Store from 'electron-store';
import { Settings } from '../dto/event';

export interface StoreType {
  ytToken: string;
  tiktokCookie: string;
  settings: Settings;
}

const store: Store = new Store<StoreType>({
  defaults: {
    settings: {
      downloadDir: './downloads',
      outroFolder: './downloads/outro.mp4',
      maxDownloads: 100,
      maxConcurrentDownloads: 3,
      offsetDateAgo: 5,
      offsetDateType: 'months'
    }
  }
});

export default store;