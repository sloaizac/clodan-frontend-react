import React, { useState, useEffect } from 'react';
import {
  listMemberships,
  getUsers,
  updatePlan,
  updateUser,
} from '../services/api_service';
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  Paper,
  IconButton,
  InputBase,
  ListItemIcon,
  Collapse,
  ListItemText,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAlert } from '../AlertContext';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [membership, setMembership] = useState([]);
  const [detailsIndex, setDetailsIndex] = useState();
  const [filter, setFilter] = useState('');
  const { showAlert } = useAlert();

  useEffect(() => {
    getData();
    listMemberships()
      .then((response) => {
        if (response && response.result) {
          setMembership(response.result);
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  }, []);

  const getData = () => {
    getUsers()
      .then((response) => {
        if (response && response.result) {
          setUsers(response.result);
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };

  const update = (email_notifications, whatsapp_notifications) => {
    const user = users[detailsIndex];
    user.send_notifications_email = email_notifications;
    user.send_notifications_whatsapp = whatsapp_notifications;
    updateUser(user.users_id, user)
      .then((response) => {
        if (response) {
          getData();
          showAlert('Configuración actualizada!', 'success');
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };

  const updateMembership = (membership_id) => {
    const user = users[detailsIndex];
    updatePlan(user.users_id, { membership_id })
      .then((response) => {
        if (response) {
          getData();
          showAlert('Configuración actualizada!', 'success');
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar usuarios"
          onChange={(e) => setFilter(e.target.value)}
          inputProps={{ 'aria-label': 'sebuscar usuarios' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <List sx={{ width: '100%' }}>
        {users
          .filter((u) => u.name.toUpperCase().startsWith(filter.toUpperCase()))
          .map((user, index) => (
            <ListItem
              disablePadding
              key={index}
              sx={{
                display: 'contents',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <ListItemButton
                onClick={() => {
                  detailsIndex === index
                    ? setDetailsIndex(null)
                    : setDetailsIndex(index);
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary={user.name}
                  secondary={`CC ${user.identification_number}`}
                />
              </ListItemButton>
              <Collapse
                in={detailsIndex === index}
                timeout="auto"
                sx={{ mt: '2rem', mb: '2rem' }}
                unmountOnExit
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={user.send_notifications_whatsapp}
                        onChange={() =>
                          update(
                            user.send_notifications_email,
                            !user.send_notifications_whatsapp
                          )
                        }
                      />
                    }
                    label="Enviar mensajes de confirmación via Whatsapp"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={user.send_notifications_email}
                        onChange={() =>
                          update(
                            !user.send_notifications_email,
                            user.send_notifications_whatsapp
                          )
                        }
                      />
                    }
                    label="Enviar mensajes de confirmación por Correo electronico"
                  />
                  <FormControl fullWidth sx={{ mt: '1rem' }}>
                    <InputLabel>Plan de afiliación</InputLabel>
                    <Select
                      value={user.membership_id}
                      label="Selecciona un doctor"
                      onChange={(e) => {
                        updateMembership(e.target.value);
                      }}
                    >
                      {membership.map((key, index) => (
                        <MenuItem value={key.id} key={index}>
                          {key.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormGroup>
              </Collapse>
            </ListItem>
          ))}
      </List>
    </Container>
  );
}
