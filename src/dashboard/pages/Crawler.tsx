import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IPCEvent } from 'src/util/constant';
import { formatViewCount } from 'src/util/common';
import { EditOptions, Settings, TikTokVideo, UploadVideoOptions } from 'src/api/dto/event';
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
import { Dialog, DialogContent, IconButton } from '@mui/material';
import TikTokStylePage from './TikTokStylePage';
import { useVideoStore } from 'src/dashboard/stores/video';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CloseOutlined } from '@mui/icons-material';
import FilterDialog from '../components/FilterDialog';
import dayjs from 'dayjs';


const columns: GridColDef[] = [
  { flex: 0.05, field: 'item.id', headerName: 'ID', width: 90, valueGetter: (_val, row) => row.id },
  {
    flex: 0.08,
    field: 'item.video.cover',
    headerName: 'Thumbnail',
    maxWidth: 200,
    minWidth: 150,
    renderCell: (params: any) => (
      <img
        src={params.row.video.cover}
        alt="item"
        loading="lazy"
        style={{ width: 150, height: 200, objectFit: 'cover', borderRadius: 4, margin: 5 }}
      />
    ),
  },
  {
    flex: 0.03,
    field: 'item.video.playAddr',
    headerName: 'Video',
    minWidth: 130,
    renderCell: () => <Button variant="contained" size="small">View Online</Button>
  },
  {
    flex: 0.125,
    field: 'desc',
    headerName: 'Description',
    minWidth: 100,
    valueGetter: (_val: any, row: any) => row.desc,
  },
  {
    field: 'item.createTime',
    headerName: 'Create Time',
    minWidth: 100,
    valueGetter: (_val: any, row: any) => dayjs.unix(row.createTime).format('YYYY-MM-DD'),
  },
  {
    field: 'item.stats.diggCount',
    headerName: 'Digg',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val: any, row: any) => row.stats.diggCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.stats.playCount',
    headerName: 'View',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val: any, row: any) => row.stats.playCount,
    valueFormatter: formatViewCount,
  },
  {
    field: 'item.stats.shareCount',
    headerName: 'Share',
    minWidth: 80,
    type: 'number',
    valueGetter: (_val: any, row: any) => row.stats.shareCount,
    valueFormatter: formatViewCount,
  },


];

export default function Crawler() {
  const [alert, setAlert] = React.useState<AlertProps>();
  const [type, setType] = React.useState<string>('search');
  const [search, setSearch] = React.useState<string>('');
  const { videos, setVideos, setIndex, setEditVideo } = useVideoStore();
  const [status, setStatus] = React.useState({
    download: false,
    append: false,
    upload: false,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [filter, setFilter] = React.useState<any>({
    startDate: null,
    endDate: null,
  });
  const [settings, setSettings] = React.useState<Settings>({} as any);

  const apiRef = useGridApiRef();

  columns[2].renderCell = (param: any) =>
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

  const handleSearch = async () => {
    setIsLoading(true);
    const options = {
      startDate: filter.startDate ? +filter.startDate.startOf('day').unix() : null,
      endDate: filter.endDate ? +filter.endDate.startOf('day').unix() : null,
    };
    window.electronAPI.invokeMain<any, any>(IPCEvent.CRAWLER_VIDEO, { search, options })
      .then(({ data, success }) => {
        if (success === false) {
          setAlert({
            isOpen: true,
            title: 'Error',
            message: data.message,
            type: 'error'
          });
          setIsLoading(false);
          return;
        }
        setVideos(data);
        setStatus((status) => ({
          ...status,
          download: !!data.length
        }));
        setIsLoading(false);
      });
  };

  const handleMoreOptions = async () => {
    setOpen(false);
    setOpenFilter(true);
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
    const videoDownloads: TikTokVideo[] = [];
    videos.forEach((v: any) => {
      if (!selectedRows.has(v.id)) return;
      videoDownloads.push(v);
    });
    window.electronAPI.sendToMain<TikTokVideo[]>(IPCEvent.DOWNLOAD_VIDEOS, videoDownloads);
  };

  const handleAppendOutro = () => {
    setIsLoading(true);
    setStatus((status) => ({
      ...status,
      append: true
    }));
    window.electronAPI.sendToMain<EditOptions>(IPCEvent.EDIT_VIDEO, { videos });
  };

  const uploadYoutube = () => {
    const selectedRows = apiRef.current.getSelectedRows();
    setStatus((status) => ({
      ...status,
      upload: false
    }));
    const videosUpload = videos.filter((w: any) => selectedRows.has(w.id)).map<UploadVideoOptions['videos'][0]>((v: any) => ({
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
    setAlert((alert: any) => ({ ...alert, isOpen: false }));
  };

  const handleSetFilter = (dateRange: { startDate: any; endDate: any }) => {
    setOpenFilter(false);
    setFilter({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  };

  React.useEffect(() => {
    window.electronAPI?.onMessageFromMain(({ event, data }) => {
      console.log('Event received:', event, data);
      if (event === IPCEvent.DOWNLOAD_PROGRESS) {
        setIsLoading(false);
        setStatus(status => ({ ...status, download: true, append: true, upload: false }));
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
          console.log(data);
          setProgress(100);
          setTimeout(() => {
            setProgress(0);
          }, 2000);
          setVideos(data.data);
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'Download completed',
            type: 'success'
          });
          return;
        }
      }
      else if (event === IPCEvent.EDIT_VIDEO_PROGRESS) {
        setIsLoading(false);
        setStatus(status => ({ ...status, append: false, upload: true }));
        if (data.percent === 100) {
          console.log(data.data);
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'Append outro video completed',
            type: 'success'
          });
          setEditVideo(data.data);
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
      else if (event === IPCEvent.UPLOAD_VIDEO_PROGRESS) {
        setStatus(status => ({ ...status, upload: true }));
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
    window.electronAPI.invokeMain<null, Settings>(IPCEvent.GET_SETTINGS).then((settings) => {
      setSettings(settings);
      setFilter({
        startDate: dayjs().subtract(+settings.offsetDateAgo || 5, settings.offsetDateType as any || 'months'),
        endDate: dayjs(),
      });
    });
  }, []);

  console.log(videos);


  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Crawler
      </Typography>
      <Card sx={{ minWidth: 275, marginBottom: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="medium"
              onClick={handleMoreOptions}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Options
            </Button>
            <FormControl variant="outlined" sx={{ width: 200 }}>
              <Select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                displayEmpty
              >
                <MenuItem value="search">Search Box</MenuItem>
                <MenuItem value="account">Account</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                size="medium"
                value={search}
                id="search"
                placeholder="Search video on tiktok"
                onKeyUp={handleKeyUp}
                onChange={(e: any) => setSearch(e.target.value)}
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
              disabled={isLoading}
            >
              Search
            </Button>

          </Box>
        </CardContent>

        <CardActions sx={{ pt: 1 }}>
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
      {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
      <Box sx={{ flexGrow: 1, height: '100%', width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={videos}
          columns={columns}
          autoHeight
          getRowId={(row: any) => row.id}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSelector
          pageSizeOptions={[20, 50, 100]}
          disableDensitySelector
          getRowHeight={() => 210}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
        />
      </Box>
      <AlertDialog
        {...alert}
        onClose={closeAlert}
      />
      {open &&
        <Dialog
          fullScreen
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={(event: any, reason: any) => {
            if (reason !== 'backdropClick') {
              setOpen(false);
            }
          }}
        >
          <DialogContent sx={{ padding: 0, backgroundColor: '#2C2F33', color: '#FFFFFF' }}>
            <IconButton
              sx={{ position: 'absolute', top: 10, left: 0, color: '#FFFFFF', zIndex: 100 }}
              onClick={() => setOpen(false)}
            >
              <CloseOutlined />
            </IconButton>

            <TikTokStylePage />
          </DialogContent>
        </Dialog>
      }
      {
        openFilter &&
        <FilterDialog
          open={openFilter}
          setOpen={setOpenFilter}
          handleApply={handleSetFilter}
          initStart={filter.startDate}
          initEnd={filter.endDate}
        />
      }
    </Box>
  );
}
