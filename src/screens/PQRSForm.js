import {
  MenuItem,
  TextField,
  Box,
  Typography,
  Select,
  FormControl,
  Container,
  Button,
  InputLabel,
} from '@mui/material';
import React, { useState } from 'react';
import { registerPQRS } from '../services/api_service';
import { useAlert } from '../AlertContext';

export default function PQRSForm() {
  const [state, setState] = useState({ type: 'PETICION' });
  const session = localStorage.getItem('session');
  const { showAlert } = useAlert();

  const onChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleRegistration = () => {
    const user_data = JSON.parse(session);
    const body = {
      type: state.type,
      description: state.description,
      user_name: user_data?.user_name,
      user_document: user_data?.identification_number,
      user_id: user_data.user_id,
    };
    registerPQRS(body)
      .then(() => {
        showAlert(
          'PQRSDF registrado exitosamente, nos pondremos en contacto para darle seguimiento a su caso',
          'success'
        );
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };
  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      <img
        // eslint-disable-next-line no-undef
        src={window.location.origin + '/R2.png'}
        alt="Logo"
        style={{ width: 200 }}
      />
      <Box sx={{ width: '100%', mx: 'auto', mt: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          fontWeight={'bold'}
          textAlign="center"
          gutterBottom
        >
          Crear nueva PQRSDF
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo</InputLabel>
          <Select
            label="tipo"
            value={state.type}
            onChange={(e) => onChange('type', e.target.value)}
          >
            <MenuItem value="PETICION">PETICIÓN</MenuItem>
            <MenuItem value="QUEJA">QUEJA</MenuItem>
            <MenuItem value="RECLAMO">RECLAMO</MenuItem>
            <MenuItem value="SUGERENCIA">SUGERENCIA</MenuItem>
            <MenuItem value="DENUNCIA">DENUNCIA</MenuItem>
            <MenuItem value="FELICITACION">FELICITACIÓN</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Describe tu caso"
          fullWidth
          value={state.description}
          onChange={(e) => onChange('description', e.target.value)}
          multiline
          rows={5}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegistration}
        >
          Enviar
        </Button>
      </Box>
    </Container>
  );
}
