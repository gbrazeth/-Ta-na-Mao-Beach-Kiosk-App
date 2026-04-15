import axios from 'axios';

// Em produção usa a URL do Render, em dev usa localhost
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});
