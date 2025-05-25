import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Props = {
  title: string;
  message: any;
  isOpen: boolean;
  onClose?: () => void,
  onConfirm?: () => void,
  type: string;
}

export type AlertProps = Props;

export default function AlertDialog(props: Props) {
  const handleClose = () => {
    props.onClose();
  };

  const handleConfirm = () => {
    props?.onConfirm();
  }

  return (
    <Dialog
      open={props.isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose(); // Only close if it's NOT from clicking outside
        }
      }}
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose}>Close</Button>
        {props.onConfirm && <Button variant='contained' onClick={handleConfirm} autoFocus>OK</Button>}
      </DialogActions>
    </Dialog>
  );
}
