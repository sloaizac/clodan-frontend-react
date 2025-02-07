import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Link,
} from '@mui/material';
import { login } from '../services/api_service';
import { useAlert } from '../AlertContext';

const Login = () => {
  const [state, setState] = useState({});
  const { showAlert, setSession } = useAlert();
  const onChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await login(state);
      if (response) {
        localStorage.setItem(
          'session',
          JSON.stringify({
            token: response.token,
            user_id: response.data.id,
            user_name: response.data.name,
            plan_id: response.data.plan_id,
            identification_number: response.data.identification_number,
            phone: response.data.phone,
            email: response.data.email,
            is_admin: response.data.is_admin,
          })
        );
        setSession({
          token: response.token,
          user_id: response.data.id,
          user_name: response.data.name,
          plan_id: response.data.plan_id,
          identification_number: response.data.identification_number,
          phone: response.data.phone,
          email: response.data.email,
          is_admin: response.data.is_admin,
        });
        if (response.data.is_admin) {
          window.location.pathname = '/admin-tasks';
        } else {
          window.location.pathname = '/';
        }
      }
    } catch (error) {
      showAlert(
        'Error durante la autenticación, revise sus credenciales',
        'error'
      );
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <img
        // eslint-disable-next-line no-undef
        src={window.location.origin + '/R2.png'}
        alt="Logo"
        style={{ width: 200 }}
      />
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2, borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Iniciar sesión
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tipo de Identificación</InputLabel>
          <Select
            value={state.identification_type || ''}
            label="Tipo de Identificación"
            onChange={(e) => onChange('identification_type', e.target.value)}
          >
            <MenuItem value="CC">Cédula de ciudadanía</MenuItem>
            <MenuItem value="CE">Cédula de extranjería</MenuItem>
            <MenuItem value="TI">Tarjeta de identidad</MenuItem>
            <MenuItem value="NIT">NIT</MenuItem>
            <MenuItem value="PB">Pasaporte</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Número de Identificación"
          fullWidth
          variant="outlined"
          value={state.identification_number || ''}
          onChange={(e) => onChange('identification_number', e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contraseña"
          fullWidth
          variant="outlined"
          type="password"
          value={state.password || ''}
          onChange={(e) => onChange('password', e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Iniciar Sesión
        </Button>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          ¿No tienes una cuenta?{' '}
          <Link href="/register" underline="hover">
            Registrarme
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
