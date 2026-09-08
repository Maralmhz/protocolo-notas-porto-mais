'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ABAS = [
  { nome: 'Protocolo', href: '/' },
  { nome: 'Financeiro', href: '/financeiro' },
  { nome: 'Eventos', href: '/eventos' },
  { nome: 'Salvados', href: '/salvados' },
];

export default function MenuPrincipal() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'flex',
        gap: 4,
        background: '#0B3D91',
        padding: '0 24px',
        borderBottom: '3px solid #C8102E',
      }}
    >
      {ABAS.map((aba) => {
        const ativo =
          aba.href === '/' ? pathname === '/' : pathname.startsWith(aba.href);
        return (
          <Link
            key={aba.href}
            href={aba.href}
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: ativo ? 'bold' : 'normal',
              background: ativo ? '#C8102E' : 'transparent',
              borderRadius: '8px 8px 0 0',
              fontSize: 14,
            }}
          >
            {aba.nome}
          </Link>
        );
      })}
    </nav>
  );
}
