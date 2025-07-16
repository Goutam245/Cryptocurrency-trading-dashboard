
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Download, Filter } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  user: string;
  compliance: 'MiCA' | 'SOC2' | 'GDPR';
  status: 'success' | 'warning' | 'error';
}

const AuditLog = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Mock audit entries for demonstration
    const mockEntries: AuditEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000),
        action: 'Price Data Access',
        details: 'Retrieved BTC/USDT real-time data via WebSocket',
        user: 'system',
        compliance: 'MiCA',
        status: 'success'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000),
        action: 'Chart Export',
        details: 'PDF compliance report generated for ETH analysis',
        user: 'trader_001',
        compliance: 'SOC2',
        status: 'success'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 900000),
        action: 'Arbitrage Alert',
        details: 'Cross-exchange opportunity detected: BTC spread 0.15%',
        user: 'system',
        compliance: 'MiCA',
        status: 'warning'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1200000),
        action: 'Portfolio Backtest',
        details: 'DCA strategy backtest executed for 12-month period',
        user: 'analyst_002',
        compliance: 'MiCA',
        status: 'success'
      }
    ];

    setAuditEntries(mockEntries);
  }, []);

  const exportAuditLog = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Details', 'User', 'Compliance', 'Status'].join(','),
      ...auditEntries.map(entry => [
        entry.timestamp.toISOString(),
        entry.action,
        `"${entry.details}"`,
        entry.user,
        entry.compliance,
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = filter === 'all' 
    ? auditEntries 
    : auditEntries.filter(entry => entry.compliance === filter);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">MiCA Compliance Audit Log</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportAuditLog}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex space-x-1">
          {['all', 'MiCA', 'SOC2', 'GDPR'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="text-xs"
            >
              {filterOption === 'all' ? 'All' : filterOption}
            </Button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-xs">
                {entry.timestamp.toLocaleString()}
              </TableCell>
              <TableCell className="font-medium">{entry.action}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {entry.details}
              </TableCell>
              <TableCell className="text-sm">{entry.user}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                  {entry.compliance}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  entry.status === 'success' ? 'bg-success/10 text-success' :
                  entry.status === 'warning' ? 'bg-warning/10 text-warning' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {entry.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default AuditLog;
