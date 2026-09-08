'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LoginPin from './components/LoginPin';

const MODULOS = [
  { nome: 'Protocolo', href: '/protocolo', desc: 'Controle de notas fiscais', cor: '#0B3D91' },
  { nome: 'Financeiro', href: '/financeiro', desc: 'Urgencias e lancamentos', cor: '#C8102E' },
  { nome: 'Eventos', href: '/eventos', desc: 'Painel mensal de eventos', cor: '#0B3D91' },
  { nome: 'Salvados', href: '/salvados', desc: 'Controle de salvados', cor: '#C8102E' },
];

export default function Home() {
  const [logado, setLogado] = useState(false);

  if (!logado) return <LoginPin onLogin={() => setLogado(true)} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, paddingTop: 24 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/pmais.jpeg"
              alt="Porto Mais"
              width={140}
              height={70}
              style={{ objectFit: 'contain', width: 'auto', height: 56 }}
            />
          </div>
          <div>
            <h1 style={{ color: '#0B3D91', margin: 0, fontSize: 30 }}>Sistema Porto Mais</h1>
            <span style={{ color: '#666', fontSize: 15 }}>Selecione um modulo para continuar</span>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {MODULOS.map((m) => (
            <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 28,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  borderTop: `4px solid ${m.cor}`,
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                  height: '100%',
                }}
              >
                <h2 style={{ color: m.cor, margin: '0 0 8px 0', fontSize: 22 }}>{m.nome}</h2>
                <p style={{ color: '#666', margin: 0, fontSize: 14 }}>{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
