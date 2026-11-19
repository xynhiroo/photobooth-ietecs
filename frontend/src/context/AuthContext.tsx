import axios from 'axios';
import type { ReactNode } from 'react';

// Central API Client for Photobooth
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Lightweight stub for seamless compatibility
export const useAuth = () => ({
  user: { id: '1', name: 'HMTI Fair Booth', email: 'booth@hmti.fair' },
  loading: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
