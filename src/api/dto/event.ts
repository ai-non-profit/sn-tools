export type CrossEvent<T = any> = {
  event: string;
  data: T;
}

export type VideoDownloads = {
  id: string;
  url: string;
  format: string;
  duration: number; // in seconds
}[];

export type EditOptions = {
  videoPath?: string;
};