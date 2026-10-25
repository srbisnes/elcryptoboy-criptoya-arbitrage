export interface Quote {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

export interface ExchangeQuotes {
  [exchange: string]: Quote;
}

export interface ArbitrageOpportunity {
  coin: string;
  fiat: string;
  volume: number;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  buyTotal: number;
  sellTotal: number;
  profitPercent: number;
  profitAmount: number;
  timestamp: number;
}

const BASE = 'https://criptoya.com/api';

export async function fetchQuotes(coin: string, fiat: string, volume: number): Promise<ExchangeQuotes> {
  const res = await fetch(`${BASE}/${coin}/${fiat}/${volume}`);
  if (!res.ok) throw new Error(`CryptoYa error: ${res.status}`);
  const data = await res.json();
  if (typeof data === 'string') throw new Error(data);
  return data as ExchangeQuotes;
}

export async function fetchFees() {
  const res = await fetch(`${BASE}/fees`);
  if (!res.ok) return {};
  return res.json();
}

export function detectArbitrages(
  quotes: ExchangeQuotes,
  coin: string,
  fiat: string,
  volume: number,
  minProfit = 0.3
): ArbitrageOpportunity[] {
  const exchanges = Object.keys(quotes).filter(e => quotes[e]?.ask > 0 && quotes[e]?.bid > 0);
  const opportunities: ArbitrageOpportunity[] = [];

  for (let i = 0; i < exchanges.length; i++) {
    for (let j = 0; j < exchanges.length; j++) {
      if (i === j) continue;
      const buyEx = exchanges[i];
      const sellEx = exchanges[j];
      const buy = quotes[buyEx];
      const sell = quotes[sellEx];

      const buyPrice = buy.ask;
      const sellPrice = sell.bid;
      const profitAmount = (sellPrice - buyPrice) * volume;
      const profitPercent = ((sellPrice - buyPrice) / buyPrice) * 100;

      if (profitPercent >= minProfit && profitAmount > 0) {
        opportunities.push({
          coin,
          fiat,
          volume,
          buyExchange: buyEx,
          sellExchange: sellEx,
          buyPrice,
          sellPrice,
          buyTotal: buy.totalAsk * volume,
          sellTotal: sell.totalBid * volume,
          profitPercent: Number(profitPercent.toFixed(2)),
          profitAmount: Number(profitAmount.toFixed(2)),
          timestamp: Math.max(buy.time, sell.time)
        });
      }
    }
  }

  return opportunities.sort((a, b) => b.profitPercent - a.profitPercent);
}
