/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  listMemberships,
  getUsers,
  updatePlan,
  updateUser,
  listEvents,
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
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAlert } from '../AlertContext';

function formatScheduleDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [membership, setMembership] = useState([]);
  const [detailsIndex, setDetailsIndex] = useState();
  const [filter, setFilter] = useState('');
  const [events, setEvents] = useState([]);
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

  const fetchEvents = () => {
    listEvents()
      .then((response) => {
        if (response) {
          setEvents(response);
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };

  const getData = () => {
    getUsers()
      .then((response) => {
        if (response && response.result) {
          setUsers(response.result);
          fetchEvents();
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };

  useEffect(() => {
    if (users && users.length > 0) {
      const us = users.map((u) => {
        return {
          ...u,
          appointments: events.filter((e) =>
            e.description.includes(`CC: ${u.identification_number}`)
          ),
        };
      });
      setUsers([...us]);
    }
  }, [events]);

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
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar usuarios"
          onChange={(e) => setFilter(e.target.value)}
          inputProps={{ 'aria-label': 'buscar usuarios' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <List sx={{ width: '100%' }}>
        {users
          .filter((u) => u.name.toUpperCase().includes(filter.toUpperCase()))
          .map((user, index) => (
            <ListItem
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
                sx={{ pr: '0px', pl: '0px' }}
              >
                <ListItemIcon>
                  <AccountCircleIcon sx={{ fontSize: '3rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={user.name}
                  secondary={`CC ${user.identification_number}`}
                />
              </ListItemButton>
              <Collapse
                in={detailsIndex === index}
                timeout="auto"
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
                  <FormControl fullWidth sx={{ mt: '2rem' }}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      Citas Programadas
                    </Typography>
                    <List>
                      {user.appointments?.length > 0 ? (
                        user.appointments?.map((a, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              borderBottom: 1,
                              borderColor: '#d3d3d3',
                              paddingY: 1,
                            }}
                          >
                            <ListItemText>
                              {formatScheduleDate(new Date(a.start))}
                            </ListItemText>
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body1">
                          Este usuario no tiene citas.
                        </Typography>
                      )}
                    </List>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: '2rem', mb: '2rem' }}>
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
