import Store from 'electron-store';

export interface StoreType {
  ytToken: string;
  tiktokCookie: string;
}

const store: Store = new Store<StoreType>();

export default store;