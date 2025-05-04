import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, CardContent, FormControl, InputAdornment, LinearProgress, OutlinedInput, } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IPCEvent } from 'src/util/constant';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { formatViewCount } from 'src/util/common';
import { VideoDownloads } from 'src/api/dto/event';
import AlertDialog, { AlertProps } from 'src/dashboard/components/AlertDialog';

const columns: GridColDef[] = [
  { field: 'item.id', headerName: 'ID', width: 90, valueGetter: (_val, row) => row.item.id },
  {
    flex: 0.025,
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
    flex: 0.1,
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
    minWidth: 130,
    renderCell: (params) => <Button variant='contained' size="small" >View Online</Button>
  },

];

export default function Crawler() {
  const [alert, setAlert] = React.useState<AlertProps>();
  const [search, setSearch] = React.useState<string>('');
  const [rows, setRows] = React.useState<[]>([]);
  const [status, setStatus] = React.useState({
    download: false,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  const apiRef = useGridApiRef();

  const handleKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    window.electronAPI.sendToMain(IPCEvent.CRAWLER_VIDEO, {
      search
    });
  };

  const handleDownloadAll = () => {
    const selectedRows = apiRef.current.getSelectedRows();
    if (!selectedRows.size) {
      return setAlert({
        isOpen: true,
        title: 'Warning',
        message: 'Please select a least one video to download',
        type: 'warning'
      });
    }
    setIsLoading(true);
    setStatus((status) => ({
      ...status,
      download: false
    }));
    setProgress(50);
    const videos: VideoDownloads = [];
    rows.forEach((v: any) => {
      if (!selectedRows.has(v.item.id)) return;
      videos.push(({
        id: v.item.id,
        url: v.item.video.downloadAddr ?? v.item.video.playAddr,
        format: v.item.video.format,
        duration: v.item.video.duration,
      }));
    });
    window.electronAPI.sendToMain<VideoDownloads>(IPCEvent.DOWNLOAD_VIDEOS, videos);
  };

  const handleAppendOutro = () => {
    setIsLoading(true);
    setStatus((status) => ({
      ...status,
      append: true
    }));
    window.electronAPI.sendToMain(IPCEvent.EDIT_VIDEO, {});
  };

  const uploadYoutube = () => {
    window.electronAPI.sendToMain(IPCEvent.LOGIN_GOOGLE, {});
  };

  const closeAlert = () => {
    setAlert(alert => ({ ...alert, isOpen: false }));
  }

  React.useEffect(() => {
    window.electronAPI?.onMessageFromMain(({ event, data }) => {
      if (event === IPCEvent.SHOW_VIDEO) {
        setRows(data);
        setStatus(status => ({ ...status, download: !!data.length }));
        setIsLoading(false);
        return;
      }
      if (event === IPCEvent.DOWNLOAD_PROGRESS) {
        console.log(data);
        setIsLoading(false);
        setStatus(status => ({ ...status, download: true }));
        if (data.error) {
          setAlert({
            isOpen: true,
            title: 'Error',
            message: data.message ?? data.error,
            type: 'error'
          });
          setProgress(0);
          return;
        }
        if (data.percent === 100) {
          setProgress(100);
          setTimeout(() => {
            setProgress(0);
          }, 2000);
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'Download completed',
            type: 'success'
          });
          return;
        }
      }
      if (event === IPCEvent.EDIT_VIDEO_PROGRESS) {
        setIsLoading(false);
        if (data.percent === 100) {
          console.log(data);
          setRows((rows) => [...rows.filter<any>((v: any) => data.ids[v.item.id] === 1)]);
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'Append outro video completed',
            type: 'success'
          });
          return;
        }
        if (data.error) {
          setAlert({
            isOpen: true,
            title: 'Error',
            message: data.message ?? data.error,
            type: 'error'
          });
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
                onKeyUp={handleKeyUp}
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
          <Button variant="contained" size="small" onClick={handleDownloadAll} disabled={!status.download}>
            Download
          </Button>
          <Button variant="contained" size="small" onClick={handleAppendOutro}>
            Append Outro
          </Button>
          <Button variant="contained" size="small" onClick={uploadYoutube}>
            Upload Youtube
          </Button>
        </CardActions>
      </Card>
      {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
      <Box sx={{ flexGrow: 1, height: '100%', width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          autoHeight
          getRowId={row => row.item.id}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          getRowHeight={() => 210}
          loading={isLoading}
        />
      </Box>
      <AlertDialog
        {...alert}
        onClose={closeAlert}
      />
    </Box>
  );
}
