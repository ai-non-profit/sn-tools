import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, CardContent, FormControl, InputAdornment, OutlinedInput, } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IPCEvent } from 'src/util/constant';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatViewCount } from 'src/util/common';

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
    window.electronAPI.sendToMain(IPCEvent.DOWNLOAD_VIDEO, {
      search
    });
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
