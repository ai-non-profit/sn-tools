import React, { useEffect, useState } from 'react';

import { IPCEvent } from 'src/util/constant';
import { Settings } from 'src/api/dto/event';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import { MenuItem, Select } from '@mui/material';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({} as any);
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const settings = await window.electronAPI.invokeMain<null, Settings>(IPCEvent.GET_SETTINGS);
      const accounts = await window.electronAPI.invokeMain<any, string[]>(IPCEvent.GET_STORE, { key: 'ytToken' });
      console.log(accounts);
      setSettings(settings);
      setLoading(false);
      setAccounts(Object.keys(accounts) || []);
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

  const clearYoutubeAccount = async () => {
    await window.electronAPI.invokeMain(IPCEvent.SET_STORE, { key: 'ytToken', value: {} });
  };

  const loginToYouTube = async () => {
    const result: any = await window.electronAPI.invokeMain<null, string>(IPCEvent.LOGIN_YOUTUBE);
    if (result.error) {
      console.error('YouTube login failed:', result.message);
      alert(`YouTube login failed: ${result.message}`);
      return;
    }
    alert('YouTube login successful! You can now upload videos.');
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    // Save to electron-store or wherever
    try {
      await window.electronAPI.invokeMain<Settings, string>(IPCEvent.SAVE_SETTINGS, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.log('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
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

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Max Downloads Number"
              value={settings.maxDownloads || 0}
              fullWidth
              onChange={(e) => handleChange('maxDownloads', e.target.value)}
              size='small'
              margin="normal"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Max Concurrency Downloads Number"
              value={settings.maxConcurrentDownloads || 0}
              fullWidth
              onChange={(e) => handleChange('maxConcurrentDownloads', e.target.value)}
              size='small'
              margin="normal"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type='number'
              label="Offset Date Ago"
              value={settings.offsetDateAgo || 0}
              onChange={(e) => handleChange('offsetDateAgo', +e.target.value)}
              size='small'
              margin="normal"
            />

            <Select
              value={settings.offsetDateType || 'months'}
              onChange={(e: any) => handleChange('offsetDateType', e.target.value)}
              displayEmpty
              size='small'
              sx={{ minWidth: 120, marginTop: '16px' }}
            >
              <MenuItem value="years">Year</MenuItem>
              <MenuItem value="months">Month</MenuItem>
              <MenuItem value="weeks">Week</MenuItem>
              <MenuItem value="days">Day</MenuItem>
            </Select>
          </Box>


          <Box sx={{ display: 'flex', gap: 1, height: 'auto', '& div': { height: 'auto' } }}>
            <TextField
              label="TikTok Cookie"
              value={settings.tiktokCookies || ''}
              fullWidth
              onChange={(e) => handleChange('tiktokCookies', e.target.value)}
              multiline
              rows={4}
              placeholder="Paste your TikTok cookies here"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Select
              value={settings.defaultAccount || ''}
              onChange={(e: any) => handleChange('defaultAccount', e.target.value)}
              displayEmpty
              size='small'
              sx={{ minWidth: 200, marginTop: '16px' }}
            >
              <MenuItem value="" disabled>Select YouTube Account</MenuItem>
              {accounts?.map((account) => (
                <MenuItem key={account} value={account}>
                  {account}
                </MenuItem>
              ))}
            </Select>
            <Button
              onClick={loginToYouTube}
              variant="outlined"
              sx={{ height: 'fit-content', mt: 2 }}
            >
              Login to YouTube
            </Button>
            <Button
              onClick={clearYoutubeAccount}
              variant="outlined"
              sx={{ height: 'fit-content', mt: 2 }}
            >
              Clear
            </Button>
          </Box>


        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', pt: 2 }}>
          <Button loading={loading} variant="contained" onClick={handleSave}>
            Save Settings
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
