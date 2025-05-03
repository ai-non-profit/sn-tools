import store from "./store";
import { Credentials } from "google-auth-library";

export function saveTokens(token: Credentials) {
  store.set('ytToken', token);
}

export function getTokens(): Credentials {
  return store.get('ytToken');
}

export function saveTiktokCookie(cookie: string) {
  store.set('tiktokCookie', cookie);
}

export function getTiktokCookie(): string {
  return store.get('tiktokCookie');
}