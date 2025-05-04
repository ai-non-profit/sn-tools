import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardActions, Button, TextField, Typography, Box,
} from '@mui/material';
import { IPCEvent } from 'src/util/constant';
import { Settings } from 'src/api/dto/event';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({} as any);

  useEffect(() => {
    (async () => {
      const settings = await window.electronAPI.invokeMain<null, Settings>(IPCEvent.GET_SETTINGS);
      setSettings(settings);
      setLoading(false);
    })();
  }, []);

  const selectFolder = async () => {
    const folder = await window.electronAPI.invokeMain<null, string>(IPCEvent.SELECT_FOLDER);
    if (folder) {
      setSettings((prev) => ({ ...prev, downloadDir: folder }));
    }
  };

  const selectOutro = async () => {
    const path = await window.electronAPI.invokeMain<null, string>(IPCEvent.SELECT_FILE);
    if (path) {
      setSettings((prev) => ({ ...prev, outroPath: path }));
    }
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    // Save to electron-store or wherever
    await window.electronAPI.invokeMain<Settings, string>(IPCEvent.SAVE_SETTINGS, settings);
    setLoading(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Application Settings
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Download Folder"
              value={settings.downloadDir || ''}
              fullWidth
              size='small'
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  readOnly: true
                }
              }}
            />
            <Button
              onClick={selectFolder}
              variant="outlined"
              sx={{ height: 'fit-content', mt: 2 }}
            >
              Select
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Default Outro Path"
              value={settings.outroPath || ''}
              fullWidth
              size='small'
              margin="normal"
              slotProps={{
                input: {
                  readOnly: true
                }
              }}
            />
            <Button
              onClick={selectOutro}
              variant="outlined"
              sx={{ height: 'fit-content', mt: 2 }}
            >
              Select
            </Button>
          </Box>

          {/* <TextField
            label="Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
          /> */}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button loading={loading} variant="contained" onClick={handleSave}>
            Save Settings
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
