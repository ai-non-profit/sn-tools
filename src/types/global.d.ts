import { CrossEvent } from "src/api/dto/event";

// src/types/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI?: {
      sendToMain: (channel: string, data: any) => void;
      onMessageFromMain: (callback: (data: CrossEvent) => any) => void;
    };
  }
}
