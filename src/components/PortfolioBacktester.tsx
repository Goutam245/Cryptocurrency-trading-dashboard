
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Calculator, Play, Download } from 'lucide-react';

interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

const PortfolioBacktester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState('dca');

  const strategies = [
    { id: 'dca', name: 'Dollar Cost Average', description: 'Regular purchases over time' },
    { id: 'momentum', name: 'Momentum Strategy', description: 'Buy on uptrends, sell on downtrends' },
    { id: 'mean_reversion', name: 'Mean Reversion', description: 'Buy low, sell high based on moving averages' }
  ];

  const runBacktest = useCallback(async () => {
    setIsRunning(true);
    
    // Simulate backtesting calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - in real implementation, this would be calculated
    const mockResults: BacktestResult = {
      totalReturn: Math.random() * 200 - 50, // -50% to +150%
      sharpeRatio: Math.random() * 3,
      maxDrawdown: Math.random() * -40,
      winRate: 40 + Math.random() * 40 // 40-80%
    };
    
    setResults(mockResults);
    setIsRunning(false);
  }, [selectedStrategy]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Portfolio Backtester</h3>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Strategy Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Strategy:</label>
        <div className="grid grid-cols-1 gap-2">
          {strategies.map((strategy) => (
            <Button
              key={strategy.id}
              variant={selectedStrategy === strategy.id ? "default" : "outline"}
              className="justify-start text-left h-auto p-3"
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <div>
                <div className="font-medium">{strategy.name}</div>
                <div className="text-xs text-muted-foreground">{strategy.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Run Backtest */}
      <Button 
        onClick={runBacktest} 
        disabled={isRunning}
        className="w-full mb-6"
      >
        <Play className="w-4 h-4 mr-2" />
        {isRunning ? 'Running Backtest...' : 'Run Backtest'}
      </Button>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h4 className="font-medium">Backtest Results (Last 12 Months)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className={`text-lg font-bold ${results.totalReturn >= 0 ? 'text-success' : 'text-warning'}`}>
                {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn.toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              <div className="text-lg font-bold">{results.sharpeRatio.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
              <div className="text-lg font-bold text-warning">{results.maxDrawdown.toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-lg font-bold">{results.winRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PortfolioBacktester;
