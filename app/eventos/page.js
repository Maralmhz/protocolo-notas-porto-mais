'use client';
import MenuPrincipal from '../components/MenuPrincipal';

export default function EventosPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <MenuPrincipal />
      <iframe
        src="https://painel-eventos.vercel.app/"
        title="Painel de Eventos"
        style={{ flex: 1, border: 'none', width: '100%' }}
      />
    </div>
  );
}
