/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DiscountIcon from '@mui/icons-material/Discount';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaymentIcon from '@mui/icons-material/Payment';
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
  Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getUser, createPaymentOrder } from '../services/api_service';
import { useAlert } from '../AlertContext';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  color: 'white',
  textAlign: 'center',
  '& .MuiCardHeader-title': {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
}));

const BenefitListItem = styled(ListItem)(({ theme }) => ({
  padding: '16px 24px',
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

const BenefitAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 48,
  height: 48,
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  borderRadius: 16,
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center',
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const StatusContainer = styled(Box)(({ theme, status }) => {
  const colors = {
    success: {
      bg: alpha(theme.palette.success.main, 0.1),
      border: theme.palette.success.main,
      text: theme.palette.success.main,
    },
    error: {
      bg: alpha(theme.palette.error.main, 0.1),
      border: theme.palette.error.main,
      text: theme.palette.error.main,
    },
    pending: {
      bg: alpha(theme.palette.warning.main, 0.1),
      border: theme.palette.warning.main,
      text: theme.palette.warning.main,
    },
  };

  const color = colors[status] || colors.pending;

  return {
    background: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: 16,
    padding: '32px 24px',
    textAlign: 'center',
    color: color.text,
  };
});

const PaymentButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  borderRadius: 12,
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${theme.palette.primary.main} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

// eslint-disable-next-line react/prop-types
export default function Pay({ pending, failed, success }) {
  const [state, setState] = useState({ user: {}, loading: true });
  const session = localStorage.getItem('session') || '{}';
  const { showAlert } = useAlert();
  const theme = useTheme();

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

  const getCurrencyFormat = () => {
    let COP = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
    });

    return COP.format(100000);
  };

  const getStatusContent = () => {
    if (success) {
      return {
        icon: <CheckCircleIcon sx={{ fontSize: 64, mb: 2 }} />,
        title: 'PAGO APROBADO',
        message:
          'Hemos recibido tu pago con éxito. ¡Bienvenido a tu nuevo plan!',
        status: 'success',
      };
    }
    if (failed) {
      return {
        icon: <ErrorIcon sx={{ fontSize: 64, mb: 2 }} />,
        title: 'PAGO RECHAZADO',
        message:
          'No hemos podido procesar tu pago correctamente. Intenta nuevamente.',
        status: 'error',
      };
    }
    if (pending) {
      return {
        icon: <HourglassEmptyIcon sx={{ fontSize: 64, mb: 2 }} />,
        title: 'PAGO PENDIENTE',
        message:
          'En este momento estamos procesando tu pago. Te notificaremos cuando esté listo.',
        status: 'pending',
      };
    }
    return null;
  };

  const statusContent = getStatusContent();

  const benefits = [
    {
      icon: <DiscountIcon />,
      primary: '20% descuento en tratamientos dentales',
      secondary: 'Aplicable a todos los procedimientos odontológicos',
    },
    {
      icon: <EmojiEmotionsIcon />,
      primary: 'Profilaxis totalmente gratis cada 6 meses',
      secondary: 'Limpieza dental profesional incluida',
    },
    {
      icon: <MedicalServicesIcon />,
      primary: 'Atención de emergencia en menos de 24 horas',
      secondary: 'Servicio prioritario las 24 horas',
    },
    {
      icon: <GroupAddIcon />,
      primary: '3 beneficiarios adicionales',
      secondary: 'Comparte los beneficios con tu familia',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Plan de Afiliados
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Clodan - Clínica Dental
        </Typography>
      </Box>

      <StyledCard>
        <StyledCardHeader
          title="PLAN DE AFILIADOS CLODAN"
          avatar={<PaymentIcon sx={{ fontSize: 32 }} />}
        />

        <CardContent sx={{ p: 0 }}>
          {statusContent ? (
            <Box sx={StatusContainer({ theme, status: statusContent.status })}>
              {statusContent.icon}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {statusContent.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {statusContent.message}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Beneficios Incluidos
              </Typography>

              <List sx={{ p: 0 }}>
                {benefits.map((benefit, index) => (
                  <BenefitListItem key={index}>
                    <ListItemAvatar>
                      <BenefitAvatar>{benefit.icon}</BenefitAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="600">
                          {benefit.primary}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {benefit.secondary}
                        </Typography>
                      }
                    />
                  </BenefitListItem>
                ))}
              </List>

              <Box sx={{ p: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    textAlign="center"
                    color="text.secondary"
                  >
                    💡 Al renovar tu plan conservarás los meses restantes de tu
                    membresía actual
                  </Typography>
                </Paper>
              </Box>

              <PriceContainer>
                <Chip
                  label="Precio Anual"
                  sx={{
                    mb: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  {getCurrencyFormat()}
                </Typography>
                {/*<Typography variant="body2" color="text.secondary">
                  Equivale a {getCurrencyFormat().replace('.000', '.333')} por
                  mes
                </Typography>*/}
              </PriceContainer>
            </Box>
          )}
        </CardContent>

        {!pending && !failed && !success && (
          <CardActions sx={{ p: 3, pt: 0 }}>
            <PaymentButton
              variant="contained"
              fullWidth
              onClick={() => createOrder()}
              startIcon={<PaymentIcon />}
            >
              Proceder al Pago
            </PaymentButton>
          </CardActions>
        )}
      </StyledCard>
    </Container>
  );
}
