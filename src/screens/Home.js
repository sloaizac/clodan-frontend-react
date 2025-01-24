import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  //IconButton,
  Grid,
  Container,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GroupsIcon from '@mui/icons-material/Groups';
import { getUserPlan } from '../services/api_service';
import { CircularProgress } from '@mui/material';

export default function Home() {
  const [state, setState] = useState({ loading: true });
  const [plan, setPlan] = useState({});
  const session = JSON.parse(localStorage.getItem('session'));
  const sections = [
    {
      title: '20% descuento en tratamientos dentales',
      description:
        'Los miembros del plan disfrutarán de descuentos significativos en una amplia gama de tratamientos dentales.',
      icon: <LocalOfferIcon fontSize="large" htmlColor="black" />,
      action: () => openWhatsApp('tratamientos'),
      buttonText: 'Quiero más información',
      imgsrc: `${window.location.origin}/20desc.jpg`,
    },
    {
      title: 'Profilaxis totalmente gratis',
      description:
        'Los miembros del plan disfrutarán de una profilaxis totalmente gratis.',
      icon: <CardGiftcardIcon fontSize="large" htmlColor="black" />,
      action: () => (window.location.pathname = '/schedule'),
      buttonText: 'Agenda tu cita',
      imgsrc: `${window.location.origin}/profree.jpg`,
    },
    {
      title: 'Atención de emergencia en menos de 24 horas',
      description:
        'Los miembros del plan tienen derecho a acceder a atención de emergencia en menos de 24 horas.',
      icon: <MedicalServicesIcon fontSize="large" htmlColor="black" />,
      action: () => openWhatsApp('agenda'),
      buttonText: 'Solicita tu cita',
      imgsrc: `${window.location.origin}/emergency.jpg`,
    },
    {
      title:
        '3 beneficiarios de su plan para disfrutar de los mismos beneficios',
      description:
        'Los miembros del plan podrán agregar beneficiarios a su plan para disfrutar de los mismos beneficios.',
      icon: <GroupsIcon fontSize="large" htmlColor="black" />,
      action: () => (window.location.pathname = '/beneficiaries'),
      buttonText: 'Añadir beneficiarios',
      imgsrc: `${window.location.origin}/beneficiaries.jpg`,
    },
  ];

  useEffect(() => {
    getUserPlan(session.user_id)
      .then((response) => {
        if (response && response.result) {
          setPlan(response.result[0]);
          setState({ ...state, loading: false });
        }
      })
      .catch(() => {
        alert('Error al procesar la acción.');
      });
  }, []);

  const openWhatsApp = (type) => {
    const phoneNumber = '573192746973';
    const messages = {
      tratamientos:
        'Hola, quiero mas información sobre los descuentos para tratamientos incluidos en mi plan de afiliación',
      agenda: 'Hola, necesito solicitar una cita, tengo una emergencia',
      default: 'Hola, necesito ayuda.',
    };
    const message = messages[type] || messages.default;
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  const getFinalDate = (date) => {
    const now = new Date(date);
    now.setFullYear(now.getFullYear() + 1);
    return now.toLocaleDateString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
        gap: 4,
      }}
    >
      {state.loading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: 4,
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box>
              <Typography variant="h6" color="#3B535E">
                Tu estado actual es:
              </Typography>
              <Typography
                variant="h4"
                fontWeight={'bold'}
                color="#3B535E"
                gutterBottom
              >
                {plan.description?.toUpperCase()}
              </Typography>
              {plan.description?.toUpperCase() != 'NO AFILIADO' && (
                <Typography variant="h6" color="#3B535E">
                  Termina el {getFinalDate(plan.create_at)}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => (window.location.pathname = '/pay')}
              sx={{ fontWeight: 'bold' }}
            >
              Renovar Plan
            </Button>
          </Box>
          {/*<Typography variant="h4" gutterBottom>
            Beneficios
          </Typography>}*/}
          <Grid container spacing={1}>
            {sections.map((benefit, index) => (
              <Grid
                item
                xs={12}
                md={3}
                key={index}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <Box
                  sx={{
                    borderRadius: '10px',
                    borderWidth: '1px',
                    borderColor: '#94B754',
                    borderStyle: 'solid',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <img
                    // eslint-disable-next-line no-undef
                    src={benefit.imgsrc}
                    alt="CLODAN"
                    style={{
                      width: '100%',
                      height: '200px',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                    }}
                  />
                  <Box
                    sx={{
                      padding: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/*<IconButton>{benefit.icon}</IconButton>*/}
                      <Typography
                        variant="body1"
                        textAlign={'center'}
                        fontWeight={'bold'}
                        color="#3B535E"
                      >
                        {benefit.title.toLocaleUpperCase()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="#3B535E"
                      textAlign={'center'}
                    >
                      {benefit.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#94B754' }}
                      onClick={benefit.action}
                    >
                      <Typography variant="body2" fontWeight={'bold'}>
                        {benefit.buttonText}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
