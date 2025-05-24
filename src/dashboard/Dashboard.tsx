import * as React from 'react';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import Crawler from './pages/Crawler';
import SettingsPage from './pages/Setting';
import { HashRouter, Route, Routes } from 'react-router-dom';
import TikTokStylePage from './pages/TikTokStylePage';


export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <HashRouter>
      <AppTheme {...props} >
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu />
          <AppNavbar />
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />
              <Routes>
                <Route path="/" element={<Crawler />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/video" element={<TikTokStylePage />} />
                {/* <Route path="/video" element={<VerticalVideoSlider />} /> */}

              </Routes>
            </Stack>
          </Box>
        </Box>
      </AppTheme>
    </HashRouter>

  );
}
