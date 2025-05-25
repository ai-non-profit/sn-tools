import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IPCEvent } from 'src/util/constant';
import { formatViewCount } from 'src/util/common';
import { Settings, UploadVideoOptions, VideoDownloads } from 'src/api/dto/event';
import AlertDialog, { AlertProps } from 'src/dashboard/components/AlertDialog';
import type { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CardActions from '@mui/material/CardActions';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { useGridApiRef } from '@mui/x-data-grid';
import { Dialog, DialogContent } from '@mui/material';
import TikTokStylePage from './TikTokStylePage';
import { mockFetchData } from './mock';
import { useVideoStore } from 'src/dashboard/stores/video';

const mockFetch = Promise.resolve(mockFetchData);

const columns: GridColDef[] = [
  {field: 'item.id', headerName: 'ID', width: 90, valueGetter: (_val, row) => row.id},
  {
    flex: 0.025,
    field: 'item.video.cover',
    headerName: 'Thumbnail',
    minWidth: 200,
    renderCell: (params: any) => (
      <img
        src={params.row.video.cover}
        alt="item"
        loading="lazy"
        style={{width: 150, height: 200, objectFit: 'cover', borderRadius: 4, margin: 5}}
      />
    ),
  },
  {
    field: 'item.video.playAddr',
    headerName: 'Video',
    minWidth: 130,
    renderCell: (params) => <Button variant="contained" size="small">View Online</Button>
  },
  {
    flex: 0.1,
    field: 'desc',
    headerName: 'Description',
    minWidth: 150,
  },
  {
    field: 'item.stats.diggCount',
    headerName: 'Digg',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val, row) => row.stats.diggCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.stats.playCount',
    headerName: 'View',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val, row) => row.stats.playCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.stats.shareCount',
    headerName: 'Share',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val, row) => row.stats.shareCount,
    valueFormatter: formatViewCount,
  },


];

export default function Crawler() {
  const [alert, setAlert] = React.useState<AlertProps>();
  const [search, setSearch] = React.useState<string>('');
  const {videos, setVideos, setIndex} = useVideoStore();
  const [status, setStatus] = React.useState({
    download: false,
    append: false,
    upload: false,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);

  const apiRef = useGridApiRef();

  columns[2].renderCell = (param) =>
    <Button variant="contained" size="small"
            onClick={() => {
              setIndex(param.api.getRowIndexRelativeToVisibleRows(param.id));
              setOpen(true);
            }}
    >
      View Online
    </Button>;

  const handleKeyUp = (event: any) => {
    if (isLoading) return;
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      search,
      limit: limit.toString(),
    });
    fetch(`https://dev.bbltech.org/headless-browser/api/v1/tiktok/search?${params.toString()}`)
    .then((res) => res.json())
    // mockFetch
      .then(({data, statusCode}) => {
        if (statusCode !== 200) {
          setAlert({
            isOpen: true,
            title: 'Error',
            message: data.message,
            type: 'error'
          });
          setIsLoading(false);
          return;
        }
        setVideos(data.videos);
        setStatus((status) => ({
          ...status,
          download: !!data.videos.length
        }));
        setIsLoading(false);
        window.electronAPI.invokeMain(IPCEvent.SAVE_SETTINGS, {
          tiktokCookies: data.cookie,
        }).then(() => {
          console.log('Save cookies success');
        });
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
      upload: false,
      download: false
    }));
    setProgress(50);
    const videoDownloads: VideoDownloads = [];
    videos.forEach((v: any) => {
      if (!selectedRows.has(v.id)) return;
      videoDownloads.push(({
        id: v.id,
        url: v.video.downloadAddr ?? v.video.playAddr,
        format: v.video.format,
        duration: v.video.duration,
      }));
    });
    window.electronAPI.sendToMain<VideoDownloads>(IPCEvent.DOWNLOAD_VIDEOS, videoDownloads);
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
    const selectedRows = apiRef.current.getSelectedRows();
    setStatus((status) => ({
      ...status,
      upload: false
    }));
    const videosUpload = videos.filter(w => selectedRows.has(w.id)).map<UploadVideoOptions['videos'][0]>((v: any) => ({
      title: v.desc,
      description: v.desc,
      categoryId: '22',
      privacyStatus: 'private',
      fileName: v.id + '.' + v.video.format,
    }));
    window.electronAPI.sendToMain(IPCEvent.UPLOAD_VIDEO, {
      videos: videosUpload
    });
  };

  const closeAlert = () => {
    setAlert((alert: any) => ({...alert, isOpen: false}));
  };

  React.useEffect(() => {
    window.electronAPI?.onMessageFromMain(({event, data}) => {
      if (event === IPCEvent.DOWNLOAD_PROGRESS) {
        console.log(data);
        setIsLoading(false);
        setStatus(status => ({...status, download: true, append: true, upload: false}));
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
        setStatus(status => ({...status, append: false, upload: true}));
        if (data.percent === 100) {
          setVideos(videos.filter((v: any) => data.ids[v.id] === 1));
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
      if (event === IPCEvent.UPLOAD_VIDEO_PROGRESS) {
        setStatus(status => ({...status, upload: true}));
        if (data.percent === 100) {
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'Upload video completed',
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
    (async () => {
      const settings = await window.electronAPI.invokeMain<null, Settings>(IPCEvent.GET_SETTINGS);
      setLimit(settings.maxDownloads);
    })();
  }, []);


  return (
    <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{mb: 2}}>
        Crawler
      </Typography>
      <Card sx={{minWidth: 275, marginBottom: 2}}>
        <CardContent>
          <Box sx={{display: 'flex', gap: 1}}>
            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                size="medium"
                value={search}
                id="search"
                placeholder="Search video on tiktok"
                onKeyUp={handleKeyUp}
                onChange={(e) => setSearch(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{color: 'text.primary'}}>
                    <SearchRoundedIcon fontSize="small"/>
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
              sx={{whiteSpace: 'nowrap'}}
              disabled={isLoading}
            >
              Search
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{pt: 1}}>
          <Button variant="contained" size="small" onClick={() => setOpen(true)}>
            POPUP
          </Button>
          <Button variant="contained" size="small" onClick={handleDownloadAll} disabled={!status.download}>
            Download
          </Button>
          <Button variant="contained" size="small" onClick={handleAppendOutro} disabled={!status.append}>
            Append Outro
          </Button>
          <Button variant="contained" size="small" onClick={uploadYoutube} disabled={!status.upload}>
            Upload Youtube
          </Button>
        </CardActions>
      </Card>
      {progress > 0 && <LinearProgress variant="determinate" value={progress}/>}
      <Box sx={{flexGrow: 1, height: '100%', width: '100%'}}>
        <DataGrid
          apiRef={apiRef}
          rows={videos}
          columns={columns}
          autoHeight
          getRowId={row => row.id}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSelector
          pageSizeOptions={[20, 50, 100]}
          disableDensitySelector
          getRowHeight={() => 210}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: {pageSize: 20, page: 0},
            },
          }}
        />
      </Box>
      <AlertDialog
        {...alert}
        onClose={closeAlert}
      />
      <Dialog
        fullScreen
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setOpen(false);
          }
        }}
      >
        <DialogContent>
          <TikTokStylePage />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
