
import { exec } from 'child_process';

export const formatVideo = (inputPath: string, outputPath: string): Promise<void> => {

  const cmd = `ffmpeg -y -i ${inputPath} -c:v libx264 -c:a aac ${outputPath}`;

  console.log(`Executing command: ${cmd}`);

  return new Promise<void>((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return reject(err);
      }
      console.log(`✅ Created: ${outputPath}`);
      resolve();
    });
  });
}