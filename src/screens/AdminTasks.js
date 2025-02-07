/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus } from '../services/api_service';
import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAlert } from '../AlertContext';

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    get_tasks();
  }, []);

  const get_tasks = async () => {
    getTasks()
      .then((response) => {
        if (response && response.result) {
          setTasks(response.result);
        }
      })
      .catch(() => {
        showAlert('Tuvimos un error procesando esta acción', 'error');
      });
  };

  const updateTask = async (id) => {
    const task = tasks.find((t) => t.id == id);
    if (task) {
      updateTaskStatus(task.id, { completed: !task.completed })
        .then(() => {
          showAlert('Tarea actualizada exitosamente', 'success');
          get_tasks();
        })
        .catch(() => {
          showAlert('Tuvimos un error procesando esta acción', 'error');
        });
    }
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
      <Typography variant="h5" fontWeight={'bold'} sx={{ textAlign: 'center' }}>
        Tareas
      </Typography>
      {tasks.map((t, index) => (
        <Accordion
          variant="outlined"
          key={'tasks'.concat(index)}
          sx={{ width: '100%' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={t.completed}
                  onChange={() => updateTask(t.id)}
                />
              }
              label={
                (t.description.type == 'call' &&
                  'Llamar beneficiario para inscripción') ||
                (t.description.type == 'PQRS' && 'Solucionar PQRSDF')
              }
            />
          </AccordionSummary>
          <AccordionDetails>
            {t.description.type == 'call' && (
              <>
                <Typography variant="body1" fontWeight={'bold'}>
                  Nombre del beneficiario
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.beneficiary_name}
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                  Telefono del beneficiario
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.beneficiary_phone}
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                  Documento del titular
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.user_document}
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                  Nombre del titular
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.user_name}
                </Typography>
              </>
            )}
            {t.description.type == 'PQRS' && (
              <>
                <Typography variant="body1" fontWeight={'bold'}>
                  Nombre del usuario
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.user_document}
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                  Telefono del usuario
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.user_name}
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                  Tipo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.pqrs_type}
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                  Descripción
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {t.description.description}
                </Typography>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
