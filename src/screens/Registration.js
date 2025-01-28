/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Container,
} from '@mui/material';
import { register, addBeneficiary } from '../services/api_service';
import { useSearchParams } from 'react-router-dom';

const Registration = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({
    identification_type: 'CC',
    privacy_policy: true,
    send_notifications_email: true,
    send_notifications_whatsapp: true,
    membership: 'NO AFILIADO',
    identification_number_titular: searchParams.get('dni'),
  });
  const session = localStorage.getItem('session') || '{}';
  const session_data = JSON.parse(session);
  const [type, setType] = useState(1); // 1.TITULAR; 2.BENEFICIARIO

  const onChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleRegistration = async () => {
    try {
      if (!state.identification_number_titular) {
        await register(state);
        alert('Registro exitoso');
        window.location.pathname = '/login';
      } else {
        const response = await register({ ...state, beneficiary_user: true });
        if (response) {
          const user_id = response.id;
          await addBeneficiary({
            user_id,
            identification_number_titular: state.identification_number_titular,
          });
          alert('Beneficiario añadido correctamente');
          if (searchParams.get('redirect_to')) {
            window.location.pathname = '/' + searchParams.get('redirect_to');
          }
        }
      }
    } catch (error) {
      console.error('Error in registration:', error);
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
          {searchParams.get('dni')
            ? 'Añadir beneficiario'
            : 'Crear una nueva cuenta'}
        </Typography>
        {session_data.is_admin && (
          <FormControl fullWidth margin="normal">
            <Typography>Tipo de usuario</Typography>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value={1}>TITULAR</MenuItem>
              <MenuItem value={2}>BENEFICIARIO</MenuItem>
            </Select>
          </FormControl>
        )}
        {session_data.is_admin && type == 2 && (
          <TextField
            label="Número de Identificación del Titular"
            fullWidth
            margin="normal"
            value={state.identification_number_titular}
            onChange={(e) =>
              onChange('identification_number_titular', e.target.value)
            }
          />
        )}
        <TextField
          label="Nombre Completo"
          fullWidth
          margin="normal"
          value={state.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <Typography>Tipo de Identificación</Typography>
          <Select
            value={state.identification_type}
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
          margin="normal"
          value={state.identification_number}
          onChange={(e) => onChange('identification_number', e.target.value)}
        />
        <TextField
          label="Correo Electrónico"
          fullWidth
          margin="normal"
          value={state.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <TextField
          label="Celular"
          fullWidth
          margin="normal"
          value={state.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={state.password}
          onChange={(e) => onChange('password', e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.privacy_policy}
              onChange={(e) => onChange('privacy_policy', e.target.checked)}
            />
          }
          label="Acepto las políticas de privacidad"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.send_notifications_email}
              onChange={(e) =>
                onChange('send_notifications_email', e.target.checked)
              }
            />
          }
          label="Recibir notificaciones por correo"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.send_notifications_whatsapp}
              onChange={(e) =>
                onChange('send_notifications_whatsapp', e.target.checked)
              }
            />
          }
          label="Recibir notificaciones por WhatsApp"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegistration}
        >
          Registrar
        </Button>
      </Box>
    </Container>
  );
};

export default Registration;
