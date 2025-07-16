
import { useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, Settings, Maximize2 } from 'lucide-react';
import { useWebSocketPrice } from '@/hooks/useWebSocketPrice';

// Lazy load TradingView for optimal bundle size and performance
const TradingViewWidget = lazy(() => 
  import('react-tradingview-widget')
);

const InstitutionalChart = () => {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('D');
  const { data, isConnected, latency } = useWebSocketPrice(selectedPair);

  const tradingPairs = [
    { symbol: 'BTCUSDT', name: 'BTC/USDT' },
    { symbol: 'ETHUSDT', name: 'ETH/USDT' },
    { symbol: 'BNBUSDT', name: 'BNB/USDT' },
    { symbol: 'ADAUSDT', name: 'ADA/USDT' },
  ];

  const timeframes = ['1', '5', '15', '60', '240', 'D', 'W'];

  const handleExportPDF = () => {
    console.log('Exporting compliance report...');
    // Implementation for PDF export would go here
  };

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Professional Charts</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-warning'}`} />
            <span className="text-xs text-muted-foreground">
              {latency}ms latency
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Trading Pair Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">Pair:</span>
          <div className="flex space-x-1">
            {tradingPairs.map((pair) => (
              <Button
                key={pair.symbol}
                variant={selectedPair === pair.symbol ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPair(pair.symbol)}
                className="text-xs"
              >
                {pair.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">Timeframe:</span>
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="text-xs px-2"
              >
                {tf === 'D' ? '1D' : tf === 'W' ? '1W' : `${tf}m`}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Price Display */}
      {data && (
        <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current:</span>
              <p className="font-bold text-lg">${data.price.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">24h High:</span>
              <p className="font-semibold">${data.high.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">24h Low:</span>
              <p className="font-semibold">${data.low.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Volume:</span>
              <p className="font-semibold">{(data.volume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      )}

      {/* TradingView Chart with Enhanced Indicators and Performance Optimization */}
      <div className="h-[500px] w-full border border-border/50 rounded-lg overflow-hidden">
        <Suspense fallback={
          <div className="h-full w-full bg-secondary/20 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading Professional Chart...</p>
            </div>
          </div>
        }>
          <TradingViewWidget
            symbol={`BINANCE:${selectedPair}`}
            theme="dark"
            locale="en"
            autosize={true}
            hide_side_toolbar={false}
            allow_symbol_change={true}
            interval={timeframe}
            toolbar_bg="#141413"
            enable_publishing={false}
            hide_top_toolbar={false}
            save_image={false}
            studies={[
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies", 
              "MACD@tv-basicstudies",
              "BB@tv-basicstudies",
              "Volume@tv-basicstudies"
            ]}
            overrides={{
              "paneProperties.background": "#141413",
              "paneProperties.vertGridProperties.color": "#363c4e",
              "paneProperties.horzGridProperties.color": "#363c4e",
              "symbolWatermarkProperties.transparency": 90,
              "scalesProperties.textColor": "#AAA",
              "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
              "mainSeriesProperties.candleStyle.wickDownColor": "#843c39"
            }}
            container_id="institutional_chart"
            style={1}
            width={800}
            height={500}
          />
        </Suspense>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>SOC 2 Type II Compliant</span>
          <span>•</span>
          <span>MiCA Regulation Ready</span>
          <span>•</span>
          <span>Real-time WebSocket Feed</span>
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default InstitutionalChart;
