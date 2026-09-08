'use client';
import { useState } from 'react';

export default function LoginPin({ onLogin }) {
  const [pin, setPin] = useState('');

  function entrar() {
    if (pin === '1010') onLogin('Geral');
    else alert('PIN invalido');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9' }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,.1)', textAlign: 'center' }}>
        <h2 style={{ color: '#0B3D91', marginBottom: 16 }}>Protocolo de Notas - Porto Mais</h2>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && entrar()}
          placeholder="PIN"
          style={{ padding: 10, fontSize: 18, textAlign: 'center', border: '1px solid #ccc', borderRadius: 8, width: 120 }}
        />
        <br />
        <button
          onClick={entrar}
          style={{ marginTop: 16, background: '#C8102E', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
