export type CrossEvent<T = any> = {
  event: string;
  data: T;
}

export type Transcript = {
  start_time: number; // in milliseconds
  end_time: number; // in milliseconds
  text: string;
}

export type VideoDownloads = {
  id: string;
  url: string;
  format: string;
  duration: number; // in seconds
  transcript?: Transcript[],
  startOutro: number;
}[];

export type EditOptions = {
  videoPath?: string;
};

export type UploadVideoOptions = {
  googleAccount?: string;
  videos: {
    fileName: string;
    videoURL?: string; // url of the video to be uploaded
    title: string;
    description: string;
    tags?: string[];
    categoryId: string;
    privacyStatus: 'private' | 'public' | 'unlisted';
  }[]
}

export type Settings = {
  downloadDir: string;
  tiktokCookies: string;
  googleAccounts: {
    [keyof: string]: string;
  },
  outroPath: string;
  normalizeOutroPath: string;
  maxConcurrentDownloads: number;
  maxDownloads: number;
}