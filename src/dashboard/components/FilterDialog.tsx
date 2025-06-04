import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initStart: Dayjs;
  initEnd: Dayjs;
  handleApply?: (dateRange: { startDate: Dayjs | null; endDate: Dayjs | null }) => void
};

export default function DateRangeDialog({ open, setOpen, initStart, initEnd, handleApply }: Props) {
  const [startDate, setStartDate] = useState<Dayjs | null>(initStart);
  const [endDate, setEndDate] = useState<Dayjs | null>(initEnd);

  const handleSubmit = () => {
    console.log('Start Date:', startDate?.format('YYYY-MM-DD'));
    console.log('End Date:', endDate?.format('YYYY-MM-DD'));
    if (handleApply) {
      handleApply({ startDate, endDate });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Start and End Dates</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '7px !important' }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
