import { CrossEvent } from "src/api/dto/event";

// src/types/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI?: {
      sendToMain: <T = any>(channel: string, data: T) => void;
      onMessageFromMain: <T = any>(callback: (data: CrossEvent<T>) => any) => void;
    };
  }
}
