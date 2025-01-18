/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { getUser, updateUser, updateUserPwd } from '../services/api_service';

export default function Profile() {
  const [user, setUser] = useState({});
  const [state, setState] = useState({ loading: true });
  const session = localStorage.getItem('session') || '';
  const session_data = JSON.parse(session);
  const [editable, setEditable] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    getUser(session_data?.user_id)
      .then((response) => {
        if (response && response.result) {
          setUser(response.result);
          setState({ ...state, loading: false });
        }
      })
      .catch(() => {
        console.log('Tuvimos un error procesando esta acción', 'ERROR');
      });
  };

  const onChange = (key, value) => {
    setUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const update = () => {
    setState({ ...state, loading: true });
    updateUser(user.id, user)
      .then((response) => {
        if (response && response.result) {
          setState({ ...state, loading: false });
          setEditable(false);
        }
      })
      .catch(() => {
        console.log('Tuvimos un error procesando esta acción', 'ERROR');
      });
  };

  const updatePwd = () => {
    if (state.password?.length >= 6) {
      if (state.password === state.password_confirmation) {
        setState({ ...state, loading: true });
        updateUserPwd(user.id, { password: state.password })
          .then((response) => {
            if (response && response.result) {
              setState({ loading: false });
              setPasswordEditable(false);
            }
            console.log('Contraseña actualizada!', 'SUCCESS');
          })
          .catch(() => {
            console.log('Tuvimos un error procesando esta acción', 'ERROR');
          });
      }
    }
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {state.loading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            maxWidth: 500,
            mx: 'auto',
            mt: 4,
            p: 2,
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
              mb: 5,
            }}
          >
            <Avatar
              {...stringAvatar(user.name?.toUpperCase())}
              sx={{ width: '55px', height: '55px' }}
            />
            <Box>
              <Typography variant="h6">{user.name?.toUpperCase()}</Typography>
              <Typography variant="h6">
                {`${user.identification_type} ${user.identification_number}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!passwordEditable && (
              <>
                <TextField
                  label="Nombre Completo"
                  value={user.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  disabled={!editable}
                  helperText="Recuerda que este campo debe contener tu nombre completo tal
                  como aparece en tu documento"
                />

                <TextField
                  label="Correo Electronico"
                  value={user.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  fullWidth
                  disabled={!editable}
                />

                <TextField
                  label="Dirección"
                  value={user.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  fullWidth
                  disabled={!editable}
                />

                <TextField
                  label="Telefono"
                  value={user.phone}
                  fullWidth
                  onChange={(e) => onChange('phone', e.target.value)}
                  disabled={!editable}
                />
              </>
            )}

            {passwordEditable && (
              <>
                <TextField
                  label="Nueva Contraseña"
                  value={state.password}
                  fullWidth
                  type="password"
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                />
                <TextField
                  label="Confirmar Contraseña"
                  value={state.password_confirmation}
                  fullWidth
                  type="password"
                  onChange={(e) =>
                    setState({
                      ...state,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </>
            )}
          </Box>

          {editable || passwordEditable ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => (editable ? update() : updatePwd())}
              >
                Guardar
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setEditable(false);
                  setPasswordEditable(false);
                  setState({ loading: true });
                  getUserData();
                }}
              >
                Cancelar
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setEditable(true)}
              >
                Actualizar Datos
              </Button>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setPasswordEditable(true)}
              >
                Actualizar Contraseña
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}
