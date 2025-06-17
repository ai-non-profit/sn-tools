import { getInfoYT } from './video.service';

describe('getInfoYT E2E', () => {
  it('should respond with video info for a valid YouTube URL', async () => {
    // You may need to listen for the response event, depending on your implementation
    // For example, if you send back IPCEvent.FROM_MAIN with the result:
    // mainWindow.webContents.on('ipc-message', (event, channel, data) => { ... })
    const response = await getInfoYT('LyHgaeA1zVk');
    console.log(response);

    // For demonstration, just check that the response is defined
    expect(response).toBeDefined();
    // Optionally, check for expected fields
    // expect(response.title).toContain('Rick Astley');
  });
});