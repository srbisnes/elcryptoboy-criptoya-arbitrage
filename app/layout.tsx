import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ElCryptoBoy | CryptoYa Arbitrage Expert',
  description: 'Omnichaín arbitrage scanner powered by CryptoYa API - LATAM CEX/P2P opportunities in real-time',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
