const BASE_URL = "/api";

// ─── Token helpers ─────────────────────────────────────────────
export const getToken = () =>
  localStorage.getItem("scholars_token");

export const setToken = (token) =>
  localStorage.setItem("scholars_token", token);

export const removeToken = () =>
  localStorage.removeItem("scholars_token");

export const getUser = () =>
  JSON.parse(localStorage.getItem("scholars_user") || "null");

export const setUser = (user) =>
  localStorage.setItem("scholars_user", JSON.stringify(user));

export const removeUser = () =>
  localStorage.removeItem("scholars_user");

// ─── Auth header helper ────────────────────────────────────────
const authHeader = () => {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
};

// ─── Response handler ──────────────────────────────────────────
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

// ─── Auth API ──────────────────────────────────────────────────
export const registerUser = (body) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const loginUser = (body) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const fetchMe = () =>
  fetch(`${BASE_URL}/auth/me`, {
    headers: authHeader(),
  }).then(handleResponse);

// ─── Students API ──────────────────────────────────────────────
export const fetchStudents = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/students${qs ? `?${qs}` : ""}`, {
    headers: authHeader(),
  }).then(handleResponse);
};

export const createStudent = (body) =>
  fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(body),
  }).then(handleResponse);

// ─── Utilities ─────────────────────────────────────────────────
export const initialStudents = [];

export const getStudentById = (students, id) =>
  students.find((s) => s.id === Number(id));
