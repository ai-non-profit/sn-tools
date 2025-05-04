import { Settings } from "../dto/event";
import store from "./store";

export function saveSettings(settings: Settings): void {
  store.set("settings", settings);
}
export function getSettings(): Settings {
  return store.get("settings");
}