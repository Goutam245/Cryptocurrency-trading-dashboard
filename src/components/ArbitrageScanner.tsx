
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRightLeft, RefreshCw, TrendingUp } from 'lucide-react';

interface ArbitrageOpportunity {
  pair: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  volume: number;
}

const ArbitrageScanner = () => {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const scanForOpportunities = async () => {
    setIsScanning(true);
    
    // Simulate scanning multiple exchanges
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock arbitrage opportunities
    const mockOpportunities: ArbitrageOpportunity[] = [
      {
        pair: 'BTC/USDT',
        buyExchange: 'Binance',
        sellExchange: 'Coinbase',
        buyPrice: 65420.50,
        sellPrice: 65489.20,
        spread: 0.105,
        volume: 2.45
      },
      {
        pair: 'ETH/USDT',
        buyExchange: 'Kraken',
        sellExchange: 'Binance',
        buyPrice: 3420.80,
        sellPrice: 3435.60,
        spread: 0.432,
        volume: 15.2
      },
      {
        pair: 'BNB/USDT',
        buyExchange: 'Coinbase',
        sellExchange: 'Binance',
        buyPrice: 542.30,
        sellPrice: 544.85,
        spread: 0.470,
        volume: 8.7
      }
    ].filter(() => Math.random() > 0.3); // Randomly show opportunities

    setOpportunities(mockOpportunities);
    setLastScan(new Date());
    setIsScanning(false);
  };

  useEffect(() => {
    scanForOpportunities();
    const interval = setInterval(scanForOpportunities, 30000); // Scan every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Arbitrage Scanner</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={scanForOpportunities}
            disabled={isScanning}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {lastScan && (
        <div className="text-xs text-muted-foreground mb-4">
          Last scan: {lastScan.toLocaleTimeString()}
        </div>
      )}

      {opportunities.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Buy Exchange</TableHead>
              <TableHead>Sell Exchange</TableHead>
              <TableHead>Spread %</TableHead>
              <TableHead>Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{opp.pair}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{opp.buyExchange}</div>
                    <div className="text-xs text-muted-foreground">${opp.buyPrice.toLocaleString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{opp.sellExchange}</div>
                    <div className="text-xs text-muted-foreground">${opp.sellPrice.toLocaleString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-bold">+{opp.spread.toFixed(3)}%</span>
                  </div>
                </TableCell>
                <TableCell>{opp.volume.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {isScanning ? 'Scanning for opportunities...' : 'No arbitrage opportunities found'}
        </div>
      )}
    </Card>
  );
};

export default ArbitrageScanner;
