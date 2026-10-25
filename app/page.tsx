'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchQuotes, detectArbitrages, type ArbitrageOpportunity } from '@/lib/criptoya';
import { TrendingUp, RefreshCw, AlertCircle, Zap } from 'lucide-react';

const COINS = ['USDT', 'BTC', 'ETH', 'USDC', 'DAI', 'SOL', 'XRP'];
const FIATS = ['ARS', 'USD', 'BRL', 'CLP', 'MXN', 'COP'];

export default function Home() {
  const [coin, setCoin] = useState('USDT');
  const [fiat, setFiat] = useState('ARS');
  const [volume, setVolume] = useState(100);
  const [minProfit, setMinProfit] = useState(0.5);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const scan = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const quotes = await fetchQuotes(coin, fiat, volume);
      const arbs = detectArbitrages(quotes, coin, fiat, volume, minProfit);
      setOpportunities(arbs);
      setLastUpdate(new Date());
    } catch (e: any) {
      setError(e.message || 'Error fetching CryptoYa data');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [coin, fiat, volume, minProfit]);

  useEffect(() => {
    scan();
    const id = setInterval(scan, 45000);
    return () => clearInterval(id);
  }, [scan]);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="text-cyan-400" /> ElCryptoBoy Arbitrage
          </h1>
          <p className="text-gray-400 mt-1">Expert scanner alimentado por CryptoYa API • Omnichaín LATAM</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          {lastUpdate && <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>}
          <button
            onClick={scan}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            Escanear
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <select value={coin} onChange={e => setCoin(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2">
          {COINS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={fiat} onChange={e => setFiat(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2">
          {FIATS.map(f => <option key={f}>{f}</option>)}
        </select>
        <input
          type="number"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
          placeholder="Volumen"
        />
        <input
          type="number"
          step="0.1"
          value={minProfit}
          onChange={e => setMinProfit(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
          placeholder="Min % profit"
        />
        <div className="flex items-center justify-center text-emerald-400 font-medium">
          {opportunities.length} oportunidades
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-lg flex items-center gap-2 text-red-300">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading && opportunities.length === 0 && (
        <div className="text-center py-20 text-gray-500">Escaneando exchanges CryptoYa...</div>
      )}

      <div className="space-y-3">
        {opportunities.map((opp, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-5 hover:border-cyan-800 transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="font-semibold text-lg">{opp.coin}/{opp.fiat}</div>
                  <div className="text-sm text-gray-400">Volumen: {opp.volume}</div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Comprar en</div>
                  <div className="font-medium text-cyan-300">{opp.buyExchange}</div>
                  <div className="text-xs">{opp.buyPrice.toLocaleString()} {opp.fiat}</div>
                </div>
                <div>
                  <div className="text-gray-500">Vender en</div>
                  <div className="font-medium text-emerald-300">{opp.sellExchange}</div>
                  <div className="text-xs">{opp.sellPrice.toLocaleString()} {opp.fiat}</div>
                </div>
                <div>
                  <div className="text-gray-500">Profit</div>
                  <div className="font-bold text-emerald-400 text-lg">{opp.profitPercent}%</div>
                  <div className="text-xs">+{opp.profitAmount.toLocaleString()} {opp.fiat}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500">Totales</div>
                  <div className="text-xs">Buy: {opp.buyTotal.toLocaleString()}</div>
                  <div className="text-xs">Sell: {opp.sellTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && !loading && !error && (
        <div className="text-center py-20 text-gray-500">
          No hay oportunidades por encima del {minProfit}%. Ajusta filtros o espera la próxima actualización.
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-gray-600">
        Powered by CryptoYa API • ElCryptoBoy Omnichaín Solutions • Datos en tiempo real (actualización ~1 min)
      </footer>
    </div>
  );
}
