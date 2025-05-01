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
    field: 'item.video.cover',
    headerName: 'Thumbnail',
    minWidth: 200,
    renderCell: (params: any) => (
      <img
        src={params.row.item.video.cover}
        alt="item"
        loading="lazy"
        style={{ width: 150, height: 200, objectFit: 'cover', borderRadius: 4, margin: 5 }}
      />
    ),
  },
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

];

export default function Crawler() {
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<[]>([]);
  const [status, setStatus] = React.useState({
    download: false,
    append: false
  });

  const handleSearch = () => {
    window.electronAPI.sendToMain(IPCEvent.CRAWLER_VIDEO, {
      search
    });
  };

  const handleDownloadAll = () => {
    setStatus((status) => ({
      ...status,
      download: true
    }));
    const videos = rows.map<VideoDownloads[0]>((v: any) => ({
      id: v.item.id,
      url: v.item.video.downloadAddr ?? v.item.video.playAddr,
      format: v.item.video.format,
      duration: v.item.video.duration,
    }));
    window.electronAPI.sendToMain<VideoDownloads>(IPCEvent.DOWNLOAD_VIDEOS, videos);
  };

  const handleAppendOutro = () => {
    setStatus((status) => ({
      ...status,
      append: true
    }));
    window.electronAPI.sendToMain(IPCEvent.EDIT_VIDEO, {});
  };

  const testLoginGoogle = () => {
    window.electronAPI.sendToMain(IPCEvent.LOGIN_GOOGLE, {});
  };

  React.useEffect(() => {
    window.electronAPI?.onMessageFromMain(({ event, data }) => {
      if (event === IPCEvent.SHOW_VIDEO) {
        console.log(data);
        setRows(data);
        return;
      }
      if (event === IPCEvent.DOWNLOAD_PROGRESS) {
        //TODO: handle percent
        if (data.percent === 100) {
          setStatus(status => ({ ...status, download: false }));
          return;
        }
      }
      if (event === IPCEvent.EDIT_VIDEO_PROGRESS) {
        //TODO: handle percent
        if (data.percent === 100) {
          setStatus(status => ({ ...status, append: false }));
          return;
        }
      }
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                size="medium"
                value={search}
                id="search"
                placeholder="Search video on tiktok"
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
            <Button
              variant="contained"
              size="medium"
              onClick={handleSearch}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Search
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{ pt: 1 }}>
          <Button variant="contained" size="small" onClick={handleDownloadAll} disabled={status.download}>
            Download All
          </Button>
          <Button variant="contained" size="small" onClick={handleAppendOutro} disabled={status.append}>
            Append Outro
          </Button>
          <Button variant="contained" size="small" onClick={testLoginGoogle}>
            Test Login Google
          </Button>
        </CardActions>
      </Card>



      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={row => row.item.id}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          getRowHeight={() => 210}
        />
      </Box>
    </Box>
  );
}
