import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Container,
  Grid2,
  FormControl,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  listEvents,
  createEvent,
  putEvent,
  getDoctorsAvailability,
} from '../services/api_service';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Constants and helpers
//const now = new Date();
//const durationMinutes = 30;
const calendarList = [
  {
    name: 'UNIDAD 1',
    id: '7183ea91bf7feb75f0b32335f03c48d26fe5058e45f07f68054fdb404654effc@group.calendar.google.com',
    unit: 1,
  },
  {
    name: 'UNIDAD 2',
    id: '8404467ced8ceca6e28ad9bee8272950f835c87adde4ace5dff80f8e89127369@group.calendar.google.com',
    unit: 2,
  },
  {
    name: 'UNIDAD 3',
    id: '722e3e854bbbf29725c30e12b200984ce7279b6b20658335af9faa2d80b1fc7e@group.calendar.google.com',
    unit: 3,
  },
  {
    name: 'UNIDAD 4',
    id: '4b0a9d1185d847bc38e2870fecebfec2104997a7b885028dc1dbf60dd376546e@group.calendar.google.com',
    unit: 4,
  },
];

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [slots, setSlots] = useState([]);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [state, setState] = useState({
    loading: false,
    doctors: {},
    doctor: [],
    startTime: '08:00',
    endTime: '19:00',
    calendar: null,
  });
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState({ state: false, id: null });
  const session = localStorage.getItem('session');
  const user = JSON.parse(session);
  const [date, setDate] = useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setAppointments(
      events.filter((e) => e.description.includes(user.identification_number))
    );
  }, [events]);

  useEffect(() => {
    if (state.doctor.length > 0 && date) {
      const doctorSchedule = state.doctor.find((d) => d.day === date.day());
      const slots = getFreeSlots(
        events.filter((e) => e.calendar == state.calendar?.name),
        date,
        doctorSchedule?.hstart,
        doctorSchedule?.hend,
        doctorSchedule?.time
      );
      setSlots(slots);
    }
  }, [date]);

  useEffect(() => {
    getDoctorsAvailability()
      .then((response) => {
        if (response && response.result) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            doctors: response.result,
          }));
        }
      })
      .catch(() => {
        console.log('Error fetching doctor availability', 'ERROR');
      });
  }, []);

  const fetchEvents = () => {
    listEvents()
      .then((response) => {
        if (response) {
          setEvents(response);

          getDoctorsAvailability()
            .then((response) => {
              if (response && response.result) {
                setState({
                  ...state,
                  loading: false,
                  doctors: Object.groupBy(response.result, ({ name }) => name),
                });
              }
            })
            .catch(() => {
              console.log('Tuvimos un error procesando esta acción', 'ERROR');
            });
        }
      })
      .catch(() => {
        console.log('Tuvimos un error procesando esta acción', 'ERROR');
      });
  };

  /*useEffect(() => {
    setSlots(
      getFreeSlots(
        events.filter((e) => e.calendar_id == state.calendar?.id),
        date,
        state.startTime,
        state.endTime,
        durationMinutes
      )
    );
  }, [state.doctor]);*/

  const getFreeSlots = (events, date, startTime, endTime, duration) => {
    if (date) {
      const slots = generateTimeSlots(
        date
          .set('hour', parseInt(startTime.split(':')[0]))
          .set('minute', parseInt(startTime.split(':')[1])),
        date
          .set('hour', parseInt(endTime.split(':')[0]))
          .set('minute', parseInt(endTime.split(':')[1])),
        duration
      );

      return slots.filter((slot) => isSlotFree(slot, events));
    }
    return [];
  };

  const generateTimeSlots = (startTime, endTime, durationMinutes) => {
    const slots = [];
    let currentTime = new Date(startTime);
    const end = new Date(endTime);

    while (currentTime < end) {
      const nextTime = new Date(
        currentTime.getTime() + durationMinutes * 60000
      );
      if (nextTime <= end) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(nextTime),
        });
      }
      currentTime = nextTime;
    }
    return slots;
  };

  const isSlotFree = (slot, events) => {
    const eventConflicts = events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return slot.start < eventEnd && slot.end > eventStart;
    });
    return !eventConflicts;
  };

  const addEvent = () => {
    if (!currentSlot) return;
    const newEvent = {
      calendar_id: state.calendar?.id,
      event_id: editMode.state ? editMode.id : null,
      summary: user?.user_name?.toUpperCase(),
      description: `Tel: ${user?.phone}, Email: ${user?.email}, CC: ${user?.identification_number}`,
      start: { dateTime: currentSlot.start, timeZone: 'America/Bogota' },
      end: { dateTime: currentSlot.end, timeZone: 'America/Bogota' },
    };

    setState((prevState) => ({ ...prevState, loading: true }));
    const eventPromise = editMode.state
      ? putEvent(newEvent)
      : createEvent(newEvent);
    eventPromise
      .then(() => {
        console.log(
          editMode.state
            ? 'Cita reagendada exitosamente'
            : 'Cita agendada exitosamente',
          'SUCCESS'
        );
        setState((prevState) => ({ ...prevState, loading: false }));
        setEditMode({ state: false, id: null });
        setAppointments(
          events.filter((e) =>
            e.description.includes(user.identification_number)
          )
        );
      })
      .catch(() => {
        console.log('Tuvimos un error procesando esta acción', 'ERROR');
      });
  };

  const openWhatsApp = () => {
    const phoneNumber = '573192746973';
    const message =
      'Hola, quiero agendar mi próxima cita, no he podido encontrar la disponibilidad que necesito en la aplicación';
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
        gap: 2,
      }}
    >
      {state.loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <Typography variant="h6" color="#3B535E" fontWeight={'bold'}>
              MIS CITAS
            </Typography>
            {appointments.length > 0 ? (
              appointments.map((a, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    paddingY: 2,
                  }}
                >
                  <Typography>{new Date(a.start).toLocaleString()}</Typography>
                  <Button
                    variant="text"
                    onClick={() => setEditMode({ state: true, id: a.id })}
                  >
                    Cambiar fecha
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="#3B535E">
                No tienes citas agendadas en este momento.
              </Typography>
            )}

            <Typography
              variant="h6"
              color="#3B535E"
              fontWeight={'bold'}
              gutterBottom
            >
              {editMode.state ? 'MODIFICAR CITA' : 'AGENDAR CITA'}
            </Typography>

            <Grid2
              container
              sx={{
                gap: '2rem',
              }}
            >
              <Grid2 sx={{ paddingTop: '8px' }} size={{ xs: 12, md: 5 }}>
                <FormControl fullWidth>
                  <InputLabel>Selecciona un doctor</InputLabel>
                  <Select
                    value={state.doctor[0]?.name || 'none'}
                    label="Selecciona un doctor"
                    onChange={(e) => {
                      const c = calendarList.find((c) =>
                        state.doctors[e.target.value].some(
                          (av) => av.unit == c.unit
                        )
                      );

                      setState({
                        ...state,
                        doctor: state.doctors[e.target.value],
                        calendar: c,
                      });
                      setDate(null);
                    }}
                  >
                    {Object.keys(state.doctors).map((key, index) => (
                      <MenuItem value={key} key={index}>
                        {key} ({state.doctors[key][0]?.speciality})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Selecciona una fecha"
                      value={date}
                      shouldDisableDate={(date) =>
                        date < dayjs() ||
                        !state.doctor.some((d) => d.day == date.day())
                      }
                      onChange={handleDateChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid2>
            </Grid2>

            <Grid2 container>
              <Grid2
                size={{ xs: 5 }}
                sx={{ flexDirection: 'column', gap: '1rem' }}
              >
                {slots.slice(0, (slots.length + 1) / 2).map((slot, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Checkbox
                      checked={currentSlot?.start === slot.start}
                      onChange={() => setCurrentSlot(slot)}
                    />
                    <Typography>
                      {new Date(slot.start).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </Grid2>

              <Grid2
                size={{ xs: 5 }}
                sx={{ flexDirection: 'column', gap: '1rem' }}
              >
                {slots.slice((slots.length + 1) / 2).map((slot, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Checkbox
                      checked={currentSlot?.start === slot.start}
                      onChange={() => setCurrentSlot(slot)}
                    />
                    <Typography>
                      {new Date(slot.start).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </Grid2>
            </Grid2>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: '1rem',
              }}
              gutterBottom
            >
              {currentSlot && (
                <Button
                  variant="contained"
                  sx={{
                    height: 'fit-content',
                    backgroundColor: '#94B754',
                    width: '200px',
                  }}
                  onClick={addEvent}
                >
                  <Typography variant="body1" fontWeight={'bold'}>
                    {' '}
                    {editMode.state ? 'Modificar fecha' : 'Agendar'}{' '}
                  </Typography>
                </Button>
              )}
              {editMode.state && (
                <Button
                  variant="outlined"
                  onClick={() => setEditMode({ state: false, id: null })}
                >
                  Cancelar
                </Button>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingY: 3,
              }}
            >
              <Typography
                align="center"
                variant="body1"
                color="#3B535E"
                gutterBottom
              >
                ¿No encuentras la disponibilidad que necesitas? Contáctanos para
                ayudarte a agendar tu cita.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#94B754',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onClick={openWhatsApp}
              >
                <WhatsAppIcon />
                <Typography variant="body2">Contactar</Typography>
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
