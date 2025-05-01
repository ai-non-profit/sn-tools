import { CrossEvent } from "src/api/dto/event";
import { Theme as MaterialTheme } from "@mui/material/styles";

// src/types/global.d.ts
export { };

declare global {
  interface Window {
    electronAPI?: {
      sendToMain: <T = any>(channel: string, data: T) => void;
      onMessageFromMain: <T = any>(callback: (data: CrossEvent<T>) => any) => void;
    };
  }
}

declare module "@mui/material/styles" {
  interface Theme extends MaterialTheme {
    vars: Record<string, any>;
  }
}
