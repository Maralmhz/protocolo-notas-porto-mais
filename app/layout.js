import './globals.css';

export const metadata = {
  title: 'Protocolo de Notas - Porto Mais',
  description: 'Controle de notas fiscais entre Eventos e Financeiro',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
