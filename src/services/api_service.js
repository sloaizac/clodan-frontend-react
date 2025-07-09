// eslint-disable-next-line no-undef
const API_URL = process.env.REACT_APP_API_URL;

const getHeaders = async () => {
  let token = '';
  const session = localStorage.getItem('session');
  token = JSON.parse(session)?.token;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const getUser = async (id) => {
  const response = await fetch(API_URL.concat(`/users/${id}`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const getUserPlan = async (id) => {
  const response = await fetch(API_URL.concat(`/user/plan/${id}`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const getBeneficiaries = async (owner_id) => {
  const response = await fetch(API_URL.concat(`/beneficiaries/${owner_id}`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const getTasks = async () => {
  const response = await fetch(API_URL.concat(`/tasks`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const login = async (body) => {
  const response = await fetch(API_URL.concat(`/login`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const register = async (body) => {
  const response = await fetch(API_URL.concat(`/register`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const scheduleCall = async (body) => {
  const response = await fetch(API_URL.concat(`/schedule/call`), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const registerPQRS = async (body) => {
  const response = await fetch(API_URL.concat(`/pqrs`), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const addBeneficiary = async (body) => {
  const response = await fetch(API_URL.concat(`/beneficiaries`), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw error;
  }
};

export const sendNotification = async (body) => {
  const response = await fetch(API_URL.concat(`/notifications`), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export async function listEvents() {
  const response = await fetch(API_URL.concat(`/events`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
}

export async function listMemberships() {
  const response = await fetch(API_URL.concat(`/memberships`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
}

export async function createEvent(event) {
  const response = await fetch(`${API_URL}/event`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(event),
  });
  return await handleResponse(response);
}

export async function createEventSync(event) {
  const response = await fetch(`${API_URL}/event-sync`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(event),
  });
  return await handleResponse(response);
}

export async function putEvent(event) {
  const response = await fetch(`${API_URL}/event`, {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(event),
  });
  return await handleResponse(response);
}

export const updateTaskStatus = async (task_id, body) => {
  const response = await fetch(API_URL.concat(`/tasks/${task_id}`), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const updateUser = async (user_id, body) => {
  const response = await fetch(API_URL.concat(`/users/${user_id}`), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const updateUserPwd = async (user_id, body) => {
  const response = await fetch(API_URL.concat(`/update_user_pwd/${user_id}`), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const updatePayment = async (body) => {
  const response = await fetch(API_URL.concat(`/payment`), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const getUsers = async () => {
  const response = await fetch(API_URL.concat(`/users`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const getDoctors = async () => {
  const response = await fetch(API_URL.concat(`/doctors`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const getDoctorsAvailability = async () => {
  const response = await fetch(API_URL.concat(`/doctors/availability`), {
    method: 'GET',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const addDoctorsAvailability = async (body) => {
  const response = await fetch(API_URL.concat(`/doctors/availability`), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const updateDoctorsAvailability = async (id, body) => {
  const response = await fetch(API_URL.concat(`/doctors/availability/${id}`), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const updatePlan = async (id, body) => {
  const response = await fetch(API_URL.concat(`/plan/${id}`), {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

export const deleteDoctorsAvailability = async (id) => {
  const response = await fetch(API_URL.concat(`/doctors/availability/${id}`), {
    method: 'DELETE',
    headers: await getHeaders(),
  });
  return await handleResponse(response);
};

export const createPaymentOrder = async (body) => {
  const response = await fetch(API_URL.concat(`/create_order`), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(response);
};

const handleResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  } else if (response.status == 403 || response.status == 401) {
    window.location.pathname = '/login';
  } else {
    const error = await response.text();
    throw error;
  }
};
