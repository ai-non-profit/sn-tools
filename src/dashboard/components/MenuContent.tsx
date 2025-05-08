import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import Settings from '@mui/icons-material/Settings';
import { IPCEvent } from 'src/util/constant';
import { Link, useLocation } from 'wouter';
import InfoOutline from '@mui/icons-material/InfoOutline';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, href: '/' },
  { text: 'Setting', icon: <Settings />, href: '/settings' },
  { text: 'Clients', icon: <PeopleRoundedIcon /> },
  { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

export default function MenuContent() {
  const [location] = useLocation();
  const [version, setVersion] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const version = await window.electronAPI.invokeMain(IPCEvent.GET_VERSION);
      setVersion(version);
    })();
  }, []);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <Link to={item.href ?? '/'} key={index}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton selected={item.href === location}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <List dense>
        <ListItem key='version' disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
            <ListItemIcon><InfoOutline /></ListItemIcon>
              <ListItemText primary={version} />
            </ListItemButton>
          </ListItem>
      </List>
    </Stack>
  );
}
