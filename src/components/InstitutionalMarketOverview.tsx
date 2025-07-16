
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, Zap } from 'lucide-react';
import { useWebSocketPrice } from '@/hooks/useWebSocketPrice';

interface MarketMetrics {
  globalCap: string;
  globalCapChange: number;
  btcDominance: number;
  ethDominance: number;
  volume24h: string;
  volumeChange: number;
}

const InstitutionalMarketOverview = () => {
  const { data: btcData, isConnected: btcConnected, latency } = useWebSocketPrice('BTCUSDT');
  const { data: ethData, isConnected: ethConnected } = useWebSocketPrice('ETHUSDT');
  
  const [marketMetrics] = useState<MarketMetrics>({
    globalCap: '$2.48T',
    globalCapChange: 3.2,
    btcDominance: 42.8,
    ethDominance: 18.3,
    volume24h: '$127.8B',
    volumeChange: 5.7
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPercentage = (percent: number, showSign: boolean = true) => {
    const sign = showSign && percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${btcConnected && ethConnected ? 'bg-success animate-pulse' : 'bg-warning'}`} />
            <span className="text-sm font-medium">
              {btcConnected && ethConnected ? 'Live Feed Active' : 'Connecting...'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Latency: {latency}ms
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last Update: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Market Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global Market Cap */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Global Market Cap</h3>
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{marketMetrics.globalCap}</p>
          <div className={`text-sm flex items-center gap-1 ${marketMetrics.globalCapChange >= 0 ? 'text-success' : 'text-warning'}`}>
            {marketMetrics.globalCapChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercentage(marketMetrics.globalCapChange)} (24h)
          </div>
        </div>

        {/* BTC Live Price */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Bitcoin (BTC)</h3>
            <Zap className={`w-4 h-4 ${btcConnected ? 'text-success' : 'text-muted-foreground'}`} />
          </div>
          <p className="text-2xl font-bold">
            {btcData ? formatPrice(btcData.price) : '$--,---'}
          </p>
          <div className={`text-sm flex items-center gap-1 ${(btcData?.priceChangePercent || 0) >= 0 ? 'text-success' : 'text-warning'}`}>
            {(btcData?.priceChangePercent || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {btcData ? formatPercentage(btcData.priceChangePercent) : '--.--%'} (24h)
          </div>
        </div>

        {/* ETH Live Price */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Ethereum (ETH)</h3>
            <Zap className={`w-4 h-4 ${ethConnected ? 'text-success' : 'text-muted-foreground'}`} />
          </div>
          <p className="text-2xl font-bold">
            {ethData ? formatPrice(ethData.price) : '$--,---'}
          </p>
          <div className={`text-sm flex items-center gap-1 ${(ethData?.priceChangePercent || 0) >= 0 ? 'text-success' : 'text-warning'}`}>
            {(ethData?.priceChangePercent || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {ethData ? formatPercentage(ethData.priceChangePercent) : '--.--%'} (24h)
          </div>
        </div>

        {/* 24h Volume */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{marketMetrics.volume24h}</p>
          <div className={`text-sm flex items-center gap-1 ${marketMetrics.volumeChange >= 0 ? 'text-success' : 'text-warning'}`}>
            {marketMetrics.volumeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercentage(marketMetrics.volumeChange)} (24h)
          </div>
        </div>
      </div>

      {/* Market Dominance */}
      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Market Dominance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Bitcoin (BTC)</span>
              <span className="text-sm font-bold">{marketMetrics.btcDominance}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${marketMetrics.btcDominance}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Ethereum (ETH)</span>
              <span className="text-sm font-bold">{marketMetrics.ethDominance}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${marketMetrics.ethDominance}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalMarketOverview;
