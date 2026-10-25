# ElCryptoBoy | CryptoYa Arbitrage Expert

Dashboard de arbitraje en tiempo real alimentado por la API pública de [CryptoYa](https://criptoya.com/api).

Detecta oportunidades de compra/venta entre exchanges LATAM (CEX + P2P) para monedas como USDT, BTC, ETH, etc. contra ARS, USD, BRL y otras fiats.

## Características

- Escaneo automático cada ~45 segundos
- Filtros por coin, fiat, volumen y profit mínimo
- Cálculo de profit % y monto absoluto
- Interfaz dark mode, responsive
- Listo para deploy en Vercel

## Setup local

```bash
npm install
npm run dev
```

## Deploy Vercel

Conecta el repo y deploy. No requiere env vars (API pública).

## Arquitectura

- Next.js 15 App Router + TypeScript
- Tailwind CSS
- Cliente CryptoYa en `lib/criptoya.ts`
- Detección de arbitrage O(n²) optimizada para <50 exchanges

## Disclaimer

Datos de CryptoYa. Verificar siempre spreads, fees de retiro y liquidez antes de operar. No es consejo financiero.
