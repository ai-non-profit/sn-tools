import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, CardContent, FormControl, InputAdornment, OutlinedInput, } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IPCEvent } from 'src/util/constant';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatViewCount } from 'src/util/common';
import { VideoDownloads } from 'src/api/dto/event';

const columns: GridColDef[] = [
  { field: 'item.id', headerName: 'ID', width: 90, valueGetter: (_val, row) => row.item.id },
  {
    field: 'item',
    headerName: 'Description',
    minWidth: 150,
    valueGetter: (_val, row) => row.item.desc
  },
  {
    field: 'item.stats.diggCount',
    headerName: 'Digg',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val, row) => row.item.stats.diggCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.stats.playCount',
    headerName: 'View',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val, row) => row.item.stats.playCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.stats.shareCount',
    headerName: 'Share',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val, row) => row.item.stats.shareCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.video.playAddr',
    headerName: 'Video',
    minWidth: 100,
    renderCell: (params) => <Button variant='contained' size="small" >View Online</Button>
  },
  {
    field: 'item.video.cover',
    headerName: 'Thumbnail',
    minWidth: 150,
    renderCell: (params: any) => (
      <img
        src={params.row.item.video.cover}
        alt="item"
        style={{ width: 150, height: 300, objectFit: 'cover', borderRadius: 4 }}
      />
    ),
  },
];

export default function Crawler() {
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<[]>([]);

  const handleSearch = () => {
    window.electronAPI.sendToMain(IPCEvent.CRAWLER_VIDEO, {
      search
    });
  };

  const testDownload = () => {
    const mockVideos: VideoDownloads = [
      {
        id: "7462606645957283077",
        url: "https://webapp-va.tiktok.com/b12dbcc16b8c7ffa81f60f9e000908db/6815f100/kmoat/mps/logo/v3/r/p/v09044g40000ctco96nog65q9gtodl1g/f70796d31eeb4790bbcabde4876af015/20c1443ae8aeb174cf88a34873e4c53f/mp4/main.mp4?a=1988&bti=NDU3ZjAwOg%3D%3D&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=0&bt=0&cs=0&ds=3&ft=bLZkJm7nPD12NrGTch-Ux7yvGY6e3wv25scAp&mime_type=video_mp4&qs=0&rc=cnF8b2hsc2d3SkBwbmQxaDFwekApNGk5O2hlZmU8N2g0ZzwzaWcpNGd3PDhqcTxmZjMzajc8eXljRl5Nc3FePmJKYSNgbV90YmJeYDItXjQxYV5fLTRfYjAzNDQ6Y2RpbGRuM2wzbHEtLTExLS06&btag=e000b0000&definition=720p&du=13&item_id=7447130383260355846&l=20250501183322948058FD91409263AD23&logo_type=tiktok_creator&ply_type=2&policy=eyJ2bSI6MiwiY2siOiJ0dF9jaGFpbl90b2tlbiJ9&sign_params=item_id%2Cuser_text&user_text=tanji_kunxx",
        format: "mp4",
        duration: 15,
      },
    ];
    window.electronAPI.sendToMain<VideoDownloads>(IPCEvent.DOWNLOAD_VIDEOS, mockVideos);
  };

  React.useEffect(() => {
    window.electronAPI?.onMessageFromMain((data) => {
      if (data.event !== IPCEvent.SHOW_VIDEO) return;
      setRows(data.data)
    });
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Crawler
      </Typography>
      <Card sx={{ minWidth: 275, marginBottom: 2 }}>
        <CardContent>
          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              size="medium"
              value={search}
              id="search"
              placeholder="Search video on tiktok"
              fullWidth
              sx={{ flexGrow: 1 }}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              }
              inputProps={{
                'aria-label': 'search',
              }}
            />
          </FormControl>
        </CardContent>
        <CardActions sx={{ pt: 1 }}>
          <Button variant='contained' size="small" onClick={handleSearch}>Search</Button>
          <Button variant='contained' size="small" onClick={testDownload}>Test Send Download</Button>
        </CardActions>
      </Card>


      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={row => row.item.id}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
