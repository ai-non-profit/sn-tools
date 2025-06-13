import store from "./store";
import { Credentials } from "google-auth-library";

export function saveTokens(token: Record<string, Credentials>) {
  store.set('ytToken', token);
}

export function getTokens(): Record<string, Credentials> {
  return store.get('ytToken');
}