import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
});

export async function fetchAccounts() {
  const { data } = await api.get('/accounts');
  return data;
}
export async function fetchAccountView(accountId) {
  const { data } = await api.get(`/accounts/${accountId}`);
  return data;
}
export async function fetchCumulative() {
  const { data } = await api.get('/cumulative');
  return data;
}
export async function fetchPositions() {
  const { data } = await api.get('/positions');
  return data;
}
