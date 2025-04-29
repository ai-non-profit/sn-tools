import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, CardContent, FormControl, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function Crawler() {
  const [search, setSearch] = React.useState<string>('');

  // React.useEffect(() => {
  //   console.log(search);
  // }, [search]);

  const handleSearch = () => {
    console.log(search);
  };

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

      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography>This is data</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
