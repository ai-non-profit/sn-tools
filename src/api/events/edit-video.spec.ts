import { describe, it } from "node:test";
import { appendOutroToVideo } from "./edit-video";

describe('EditVideo', () => {
  it('should group source objects by their IDs', async () => {
    const origin = '/home/kaineki/workspace/ai-non-profit/sn-tools/downloads/original/7462606645957283077.mp4';
    const outro = '/home/kaineki/workspace/ai-non-profit/sn-tools/downloads/outro/7462606645957283077.mp4';
    await appendOutroToVideo(origin, outro, "/home/kaineki/workspace/ai-non-profit/sn-tools/downloads/edited");
  });
});