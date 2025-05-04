import Store from 'electron-store';
import { Settings } from '../dto/event';
import { downloadDir } from '../util';

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
    }
  }
});

export default store;