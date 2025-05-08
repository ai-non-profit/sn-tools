import store from "./store";
import { Credentials } from "google-auth-library";

export function saveTokens(token: Credentials) {
  store.set('ytToken', token);
}

export function getTokens(): Credentials {
  return store.get('ytToken');
}
