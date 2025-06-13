export type CrossEvent<T = any> = {
  event: string;
  data: T;
}

export type Transcript = {
  start_time: number; // in milliseconds
  end_time: number; // in milliseconds
  text: string;
}

export type EditOptions = {
  videoPath?: string;
  videos: TikTokVideo[];
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
  offsetDateAgo?: number; // in days
  offsetDateType?: string;
  defaultAccount?: string; // default account to use for uploading
}

export interface TikTokVideo {
  id: string
  desc: string
  video: Video
  stats: Stats
  author: Author
  music: Music
  transcript?: Transcript[],
  startOutro: number;
  localPath?: {
    original: string;
    raw?: string;
    outro?: string;
    edited?: string;
  }
  [key: string]: any; // for future use, like editing options
}

export interface Video {
  id: string
  height: number
  width: number
  duration: number
  ratio: string
  cover: string
  originCover: string
  dynamicCover: string
  playAddr: string
  downloadAddr: string
  shareCover: string[]
  reflowCover: string
  bitrate: number
  encodedType: string
  format: string
  videoQuality: string
  encodeUserTag: string
  codecType: string
  definition: string
  bitrateInfo: BitrateInfo[]
  zoomCover: ZoomCover
  volumeInfo: VolumeInfo
  size: number
  VQScore: string
  claInfo: ClaInfo
}

export interface BitrateInfo {
  GearName: string
  Bitrate: number
  QualityType: number
  PlayAddr: PlayAddr
  CodecType: string
  MVMAF: string
}

export interface PlayAddr {
  Uri: string
  UrlList: string[]
  DataSize: number
  Width: number
  Height: number
  UrlKey: string
  FileHash: string
  FileCs: string
}

export interface ZoomCover {
  "240": string
  "480": string
  "720": string
  "960": string
}

export interface VolumeInfo {
  Loudness: number
  Peak: number
}

export interface ClaInfo {
  hasOriginalAudio: boolean
  enableAutoCaption: boolean
  noCaptionReason: number
}

export interface Stats {
  diggCount: number
  shareCount: number
  commentCount: number
  playCount: number
  collectCount: number
}

export interface Author {
  id: string
  uniqueId: string
  nickname: string
  avatarThumb: string
  avatarMedium: string
  avatarLarger: string
  signature: string
  verified: boolean
  secUid: string
  secret: boolean
  ftc: boolean
  relation: number
  openFavorite: boolean
  commentSetting: number
  duetSetting: number
  stitchSetting: number
  privateAccount: boolean
  isADVirtual: boolean
  ttSeller: boolean
  downloadSetting: number
  isEmbedBanned: boolean
}

export interface Music {
  id: string
  title: string
  playUrl: string
  coverThumb: string
  coverMedium: string
  coverLarge: string
  authorName: string
  original: boolean
  duration: number
  album: string
  isCopyrighted: boolean
}
