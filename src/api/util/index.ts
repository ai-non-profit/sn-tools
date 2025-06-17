import path from 'path';
import isDev from 'electron-is-dev';

const devBinPath = {
  win32: path.join(__dirname, '..', '..', 'bin', 'win', 'ffmpeg.exe'),
  darwin: path.join(__dirname, '..', '..', 'bin', 'mac', 'ffmpeg'),
  linux: path.join(__dirname, '..', '..', 'bin', 'linux', 'ffmpeg')
};

const prodBinPath = {
  win32: path.join(process.resourcesPath, 'bin', 'win', 'ffmpeg.exe'),
  darwin: path.join(process.resourcesPath, 'bin', 'mac', 'ffmpeg'),
  linux: path.join(process.resourcesPath, 'bin', 'linux', 'ffmpeg')
};

export const ffmpegPath: string =
  isDev
    ? devBinPath[process.platform as keyof typeof devBinPath] as string
    : prodBinPath[process.platform as keyof typeof prodBinPath] as string;

export const getYoutubeID = (url: string) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export function parseISODuration(isoDuration: string) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}
