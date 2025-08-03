import { Box, Button, CardContent, FormControl, MenuItem, Select, TextField } from "@mui/material";
import React from "react";

export function Search({ handleMoreOptions, handleSearch, isLoading }: any) {
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('search');
  
  return (
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
            <MenuItem value="youtube">Youtube</MenuItem>
            <MenuItem value="googleSheet">GoogleSheet</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ display: 'flex', gap: 1, height: 'auto', '& div': { height: 'auto' } }}>
          <TextField
            multiline
            maxRows={2}
            minRows={2}
            size="medium"
            value={search}
            id="search"
            placeholder="Search video on tiktok"
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </FormControl>
        <Button
          variant="contained"
          size="medium"
          onClick={() => handleSearch(search, type)}
          sx={{ whiteSpace: 'nowrap' }}
          disabled={isLoading}
        >
          Search
        </Button>

      </Box>
    </CardContent>
  )
}