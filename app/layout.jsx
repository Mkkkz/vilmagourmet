import './globals.css';

export const metadata = {
  title: 'Painel Vilma Gourmet',
  description: 'Painel administrativo da VilmaGourmet.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
