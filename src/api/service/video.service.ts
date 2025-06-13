
import { exec } from 'child_process';
import { ffmpegPath } from '../util';
import log from 'console';

export const formatVideo = (inputPath: string, outputPath: string): Promise<void> => {

  const cmd = `"${ffmpegPath}" -y -i ${inputPath} -c:v libx264 -c:a aac ${outputPath}`;

  log.info(`Executing command: ${cmd}`);

  return new Promise<void>((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        log.error(stderr);
        return reject(err);
      }
      log.info(`✅ Created: ${outputPath}`);
      resolve();
    });
  });
}