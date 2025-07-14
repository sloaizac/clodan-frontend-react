/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Paper,
  Stack,
  Fade,
  Slide,
  CardActions,
} from '@mui/material';
import { getUserPlan } from '../services/api_service';
import { CircularProgress } from '@mui/material';
import { useAlert } from '../AlertContext';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ScheduleIcon from '@mui/icons-material/Schedule';

export default function Home() {
  const [state, setState] = useState({ loading: true });
  const [plan, setPlan] = useState({});
  const session = JSON.parse(localStorage.getItem('session'));
  const { showAlert } = useAlert();

  const sections = [
    {
      title: '20% descuento en tratamientos dentales',
      description:
        'Los miembros del plan disfrutarán de descuentos significativos en una amplia gama de tratamientos dentales.',
      icon: <LocalOfferIcon fontSize="large" />,
      action: () => openWhatsApp('tratamientos'),
      buttonText: 'Más información',
      imgsrc: `${window.location.origin}/tratamiento.png`,
      color: '#FFE4B5',
      gradient: 'linear-gradient(135deg, #FFE4B5 0%, #FFF8DC 100%)',
    },
    {
      title: 'Higiene oral totalmente gratis',
      description:
        'Los miembros del plan disfrutarán de una higiene oral completa totalmente gratis.',
      icon: <CardGiftcardIcon fontSize="large" />,
      action: () => (window.location.pathname = '/calendar'),
      buttonText: 'Agenda tu cita',
      imgsrc: `${window.location.origin}/descuento.png`,
      color: '#E8F5E8',
      gradient: 'linear-gradient(135deg, #E8F5E8 0%, #F0FFF0 100%)',
    },
    {
      title: 'Atención de emergencia',
      description:
        'Los miembros del plan tienen derecho a acceder a atención de emergencia en menos de 24 horas.',
      icon: <MedicalServicesIcon fontSize="large" />,
      action: () => openWhatsApp('agenda'),
      buttonText: 'Solicita tu cita',
      imgsrc: `${window.location.origin}/emergencia.png`,
      color: '#FFE4E4',
      gradient: 'linear-gradient(135deg, #FFE4E4 0%, #FFF0F0 100%)',
    },
    {
      title: '3 beneficiarios de su plan',
      description:
        'Los miembros del plan podrán agregar beneficiarios a su plan para disfrutar de los mismos beneficios.',
      icon: <GroupsIcon fontSize="large" />,
      action: () => (window.location.pathname = '/beneficiaries'),
      buttonText: 'Añadir beneficiarios',
      imgsrc: `${window.location.origin}/beneficiarios.png`,
      color: '#E4F3FF',
      gradient: 'linear-gradient(135deg, #E4F3FF 0%, #F0F8FF 100%)',
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
        showAlert('Error al procesar la acción.', 'error');
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

  /*const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVO':
        return '#4CAF50';
      case 'INACTIVO':
        return '#FF9800';
      case 'NO AFILIADO':
        return '#F44336';
      default:
        return '#94B754';
    }
  };*/

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVO':
        return <PersonIcon />;
      case 'INACTIVO':
        return <AccessTimeIcon />;
      case 'NO AFILIADO':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {state.loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#94B754' }} />
        </Box>
      ) : (
        <Stack spacing={4}>
          {/* Header Section */}
          <Fade in={true} timeout={800}>
            <Box>
              <Typography
                variant="h4"
                fontWeight="300"
                color="#666"
                sx={{ mb: 1 }}
              >
                Bienvenido de vuelta,
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="#2C5530"
                sx={{ mb: 3 }}
              >
                {session?.user_name || 'Usuario'}
              </Typography>
            </Box>
          </Fade>

          {/* Status Card */}
          <Slide direction="up" in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #94B754 0%, #7DA647 100%)',
                borderRadius: 3,
                p: 3,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  transform: 'translate(25%, -25%)',
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {getStatusIcon(plan.description)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Tu estado actual
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {plan.description?.toUpperCase() || 'CARGANDO...'}
                        </Typography>
                      </Box>
                    </Box>

                    {plan.description?.toUpperCase() !== 'NO AFILIADO' && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
                      >
                        <CalendarMonthIcon sx={{ mr: 1, opacity: 0.8 }} />
                        <Typography variant="body1">
                          Válido hasta: {getFinalDate(plan.create_at)}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => (window.location.pathname = '/pay')}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                      startIcon={<AutorenewIcon />}
                    >
                      Renovar Plan
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Slide>

          {/* Benefits Section */}
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#2C5530"
              sx={{ mb: 1 }}
            >
              Tus beneficios
            </Typography>
            <Typography variant="body1" color="#666" sx={{ mb: 3 }}>
              Descubre todo lo que tu plan incluye para ti y tu familia
            </Typography>

            <Grid container spacing={3}>
              {sections.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Fade in={true} timeout={1200 + index * 200}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        border: '1px solid #E0E0E0',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                          border: '1px solid #94B754',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={benefit.imgsrc}
                          alt={benefit.title}
                          sx={{
                            //objectFit: 'contain',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box sx={{ color: '#94B754' }}>{benefit.icon}</Box>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="#2C5530"
                            sx={{
                              lineHeight: 1.2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {benefit.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="#666"
                            sx={{
                              flex: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {benefit.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={benefit.action}
                          sx={{
                            bgcolor: '#94B754',
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: '#7DA647',
                            },
                          }}
                          startIcon={
                            benefit.buttonText.includes('información') ? (
                              <WhatsAppIcon />
                            ) : benefit.buttonText.includes('cita') ? (
                              <ScheduleIcon />
                            ) : benefit.buttonText.includes('beneficiarios') ? (
                              <PeopleIcon />
                            ) : null
                          }
                        >
                          {benefit.buttonText}
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Quick Actions */}
          <Fade in={true} timeout={1600}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E0E0E0',
                background: 'linear-gradient(135deg, #F8FFF8 0%, #FFFFFF 100%)',
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#2C5530"
                sx={{ mb: 2 }}
              >
                Acciones rápidas
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#94B754',
                      color: '#94B754',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#7DA647',
                        bgcolor: 'rgba(148, 183, 84, 0.1)',
                      },
                    }}
                    startIcon={<WhatsAppIcon />}
                    onClick={() => openWhatsApp('default')}
                  >
                    Contactar WhatsApp
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#94B754',
                      color: '#94B754',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#7DA647',
                        bgcolor: 'rgba(148, 183, 84, 0.1)',
                      },
                    }}
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => (window.location.pathname = '/calendar')}
                  >
                    Ver calendario
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#94B754',
                      color: '#94B754',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#7DA647',
                        bgcolor: 'rgba(148, 183, 84, 0.1)',
                      },
                    }}
                    startIcon={<PeopleIcon />}
                    onClick={() =>
                      (window.location.pathname = '/beneficiaries')
                    }
                  >
                    Mis beneficiarios
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Stack>
      )}
    </Container>
  );
}
