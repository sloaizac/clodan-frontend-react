import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Card,
  Modal,
  CardContent,
  TextField,
  Button,
  CardHeader,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
  getBeneficiaries,
  sendNotification,
  scheduleCall,
} from '../services/api_service';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CallIcon from '@mui/icons-material/Call';

export default function Beneficiaries() {
  const [state, setState] = useState({ loading: true, contact: '', name: '' });
  const [users, setUsers] = useState([]);
  const session = localStorage.getItem('session') || '{}';
  const [visible, setVisible] = useState(false);
  const [contentId, setContentId] = useState(0);

  useEffect(() => {
    setState({ ...state, contact: '', name: '' });
  }, [contentId]);

  useEffect(() => {
    if (contentId == 0) {
      const owner_id = JSON.parse(session)?.user_id;
      getBeneficiaries(owner_id)
        .then((response) => {
          if (response && response.result) {
            setUsers(response.result);
            setState({ ...state, loading: false });
          }
        })
        .catch(() => {
          console.log('Tuvimos un error procesando esta acción', 'ERROR');
        });
    }
  }, [contentId]);

  const send = async (config) => {
    setState({ ...state, loading: true });
    setContentId(0);
    setVisible(false);
    sendNotification(config)
      .then(() => {
        setState({ ...state, loading: false });
        console.log('Notificación enviada exitosamente', 'SUCCESS');
      })
      .catch(() => {
        console.log('Tuvimos un error procesando esta acción', 'ERROR');
      });
  };

  const sendWhatsappNotification = () => {
    const session_data = JSON.parse(session);
    const config = {
      channel: 'WPP',
      contact: state.contact,
      type: 'invitacion_beneficiario',
      username: session_data.user_name,
      // eslint-disable-next-line no-undef
      link: `${process.env.EXPO_PUBLIC_HOST}/registration/${session_data.user_id}`,
    };
    send(config);
  };

  const sendEmailNotification = () => {
    const session_data = JSON.parse(session);
    const config = {
      channel: 'EMAIL',
      contact: state.contact,
      type: 'invitacion_beneficiario',
      username: session_data.user_name,
      // eslint-disable-next-line no-undef
      link: `${process.env.EXPO_PUBLIC_HOST}/registration/${session_data.user_id}`,
    };
    send(config);
  };

  const call = () => {
    const user_data = JSON.parse(session);
    const body = {
      name: state.name,
      phone: state.contact,
      user_name: user_data?.user_name,
      user_document: user_data?.identification_number,
      user_id: user_data.user_id,
    };
    scheduleCall(body)
      .then(() => {
        console.log('Tarea creada exitosamente', 'SUCCESS');
      })
      .catch(() => {
        console.log('Tuvimos un error procesando esta acción', 'ERROR');
      });
  };

  const getContent = () => {
    switch (contentId) {
      case 1:
        return (
          <CardContent>
            <TextField
              label="Numero de Whatsapp"
              fullWidth
              value={state.contact}
              onChange={(e) => setState({ ...state, contact: e.target.value })}
            />
            <Button
              variant="contained"
              onClick={sendWhatsappNotification}
              sx={{ mt: 2 }}
              fullWidth
            >
              Enviar
            </Button>
          </CardContent>
        );
      case 2:
        return (
          <CardContent>
            <TextField
              label="Correo Electronico"
              fullWidth
              value={state.contact}
              onChange={(e) => setState({ ...state, contact: e.target.value })}
            />
            <Button
              variant="contained"
              onClick={sendEmailNotification}
              sx={{ mt: 2 }}
              fullWidth
            >
              Enviar
            </Button>
          </CardContent>
        );
      case 4:
        return (
          <CardContent>
            <TextField
              label="Nombre Completo"
              fullWidth
              value={state.contact}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Numero de Telefono"
              fullWidth
              value={state.contact}
              onChange={(e) => setState({ ...state, contact: e.target.value })}
            />
            <Button variant="contained" onClick={call} sx={{ mt: 2 }} fullWidth>
              Enviar
            </Button>
          </CardContent>
        );
      default:
        return (
          <CardContent>
            <ListItemButton
              onClick={() => setContentId(1)}
              sx={cardButtonStyle}
            >
              <WhatsAppIcon fontSize="large" />
              <Typography variant="body1">
                Enviar invitacion al Whatsapp
              </Typography>
            </ListItemButton>
            <ListItemButton
              onClick={() => setContentId(2)}
              sx={cardButtonStyle}
            >
              <EmailIcon fontSize="large" />
              <Typography variant="body1">
                Enviar invitacion al correo electronico
              </Typography>
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                const user = JSON.parse(session);
                const url = new URL(window.location.origin + '/register');
                url.searchParams.set('dni', user.identification_number);
                url.searchParams.set('redirect_to', 'beneficiaries');
                window.location.href = url;
              }}
              sx={cardButtonStyle}
            >
              <ListAltIcon fontSize="large" />
              <Typography variant="body1">
                Llenar formulario de inscripcion ahora
              </Typography>
            </ListItemButton>
            <ListItemButton
              onClick={() => setContentId(4)}
              sx={cardButtonStyle}
            >
              <CallIcon fontSize="large" />
              <Typography variant="body1">
                Quiero que CLODAN contacte mi beneficiario para completar el
                registro
              </Typography>
            </ListItemButton>
          </CardContent>
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
      <List sx={{ width: '100%' }}>
        {users.map((user, index) => (
          <ListItem
            disablePadding
            key={index}
            sx={{
              display: 'contents',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={user.name}
                secondary={`CC ${user.identification_number}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {users.length < 3 && (
          <ListItem
            disablePadding
            sx={{
              display: 'contents',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <ListItemButton onClick={() => setVisible(true)}>
              <ListItemIcon>
                <PersonAddAltIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Añadir Beneficiario"
                sx={{ fontWeight: 'bold' }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Modal
        open={visible}
        onClose={() => {
          setVisible(false);
          setContentId(0);
        }}
      >
        <Card variant="outlined" sx={style}>
          <CardHeader title="Añadir Beneficiario" />
          {getContent()}
        </Card>
      </Modal>
    </Container>
  );
}

const cardButtonStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  gap: 1,
  mb: 2,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'black',
  borderRadius: '5px',
  minHeight: '5rem !important',
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 350,
  maxWidth: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};
