/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DiscountIcon from '@mui/icons-material/Discount';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from '@mui/material';
import { getUser, createPaymentOrder } from '../services/api_service';
import { useAlert } from '../AlertContext';

// eslint-disable-next-line react/prop-types
export default function Pay({ pending, failed, success }) {
  const [state, setState] = useState({ user: {}, loading: true });
  const session = localStorage.getItem('session') || '{}';
  const { showAlert } = useAlert();

  useEffect(() => {
    const session_data = JSON.parse(session);

    getUser(session_data.user_id)
      .then((user_response) => {
        if (user_response && user_response.result) {
          setState({
            ...state,
            loading: false,
            user: user_response.result,
          });
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  }, []);

  const createOrder = () => {
    createPaymentOrder({ user_id: state.user.id }).then((response) => {
      if (response.init_point) {
        window.location.href = response.init_point;
      }
    });
  };

  const getCurrecyFormat = () => {
    let COP = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
    });

    return COP.format(100000);
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
        gap: 4,
      }}
    >
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2, borderRadius: 2 }}>
        <Card variant="outlined">
          <CardHeader
            title="PLAN DE AFILIADOS CLODAN"
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          />
          <CardContent>
            {success && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  APROBADO
                </Typography>
                <Typography variant="h5">
                  Hemos recibido tu pago con exito.
                </Typography>
              </Box>
            )}
            {failed && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  RECHAZADO
                </Typography>
                <Typography variant="h5">
                  No hemos podido procesar tu pago correctamente.
                </Typography>
              </Box>
            )}
            {pending && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  PENDIENTE
                </Typography>
                <Typography variant="h5">
                  En este momento estamos procesando tu pago.
                </Typography>
              </Box>
            )}
            {!pending && !failed && !success && (
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <DiscountIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="20% descuento en tratamientos dentales." />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EmojiEmotionsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Profilaxis totalmente gratis cada 6 meses." />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MedicalServicesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Atención de emergencia en menos de 24 horas." />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <GroupAddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="3 beneficiarios de su plan para disfutar de los mismos beneficios." />
                </ListItem>
              </List>
            )}

            {!pending && !failed && !success && (
              <>
                <Typography variant="body1" textAlign="center" gutterBottom>
                  Al renovar tu plan conservaras los meses restantes de tu
                  membresía actual
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={'bold'}
                  textAlign="center"
                  sx={{ mt: '2rem', mb: '2rem' }}
                >
                  {`Precio anual ${getCurrecyFormat()}`}
                </Typography>
              </>
            )}
          </CardContent>
          {!pending && !failed && !success && (
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                onClick={() => createOrder()}
              >
                Pagar
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
    </Container>
  );
}
