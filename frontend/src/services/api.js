const BASE_URL = "/api";

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const getToken  = ()         => localStorage.getItem('scholars_token');
export const setToken  = (token)    => localStorage.setItem('scholars_token', token);
export const removeToken = ()       => localStorage.removeItem('scholars_token');
export const getUser   = ()         => JSON.parse(localStorage.getItem('scholars_user') || 'null');
export const setUser   = (user)     => localStorage.setItem('scholars_user', JSON.stringify(user));
export const removeUser = ()        => localStorage.removeItem('scholars_user');

const authHeader = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (body) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST', headers: authHeader(), body: JSON.stringify(body),
  }).then(handleResponse);

export const loginUser = (body) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: authHeader(), body: JSON.stringify(body),
  }).then(handleResponse);

export const fetchMe = () =>
  fetch(`${BASE_URL}/auth/me`, { headers: authHeader() }).then(handleResponse);

// ─── Students ──────────────────────────────────────────────────────────────────
export const fetchStudents = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/students${qs ? '?' + qs : ''}`, {
    headers: authHeader(),
  }).then(handleResponse);
};

export const fetchStudentById = (id) =>
  fetch(`${BASE_URL}/students/${id}`, { headers: authHeader() }).then(handleResponse);

export const createStudent = (body) =>
  fetch(`${BASE_URL}/students`, {
    method: 'POST', headers: authHeader(), body: JSON.stringify(body),
  }).then(handleResponse);

export const updateStudent = (id, body) =>
  fetch(`${BASE_URL}/students/${id}`, {
    method: 'PUT', headers: authHeader(), body: JSON.stringify(body),
  }).then(handleResponse);

export const deleteStudent = (id) =>
  fetch(`${BASE_URL}/students/${id}`, {
    method: 'DELETE', headers: authHeader(),
  }).then(handleResponse);

// ─── Keep mock data for fallback/initial load ──────────────────────────────────
export const initialStudents = [];

export const getStudentById = (students, id) =>
  students.find((s) => s.id === parseInt(id));