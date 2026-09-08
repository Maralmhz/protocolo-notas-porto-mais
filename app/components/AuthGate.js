'use client';
import { useEffect, useState } from 'react';
import LoginPin from './LoginPin';

export default function AuthGate({ children }) {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const ok = typeof window !== 'undefined' && sessionStorage.getItem('pm_auth') === '1';
    setAutenticado(ok);
  }, []);

  function handleLogin() {
    sessionStorage.setItem('pm_auth', '1');
    setAutenticado(true);
  }

  if (autenticado === null) return null;
  if (!autenticado) return <LoginPin onLogin={handleLogin} />;
  return children;
}
