
import InstitutionalMarketOverview from "@/components/InstitutionalMarketOverview";
import InstitutionalChart from "@/components/InstitutionalChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import PortfolioBacktester from "@/components/PortfolioBacktester";
import ArbitrageScanner from "@/components/ArbitrageScanner";
import AuditLog from "@/components/AuditLog";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CryptoDash Pro</h1>
          <p className="text-muted-foreground">
            Institutional-Grade Real-Time Analytics Platform | July 2025 Data
          </p>
        </header>
        
        <InstitutionalMarketOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <InstitutionalChart />
          </div>
          <div>
            <PortfolioCard />
          </div>
        </div>
        
        {/* New Institutional Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PortfolioBacktester />
          <ArbitrageScanner />
        </div>
        
        <div className="mb-8">
          <AuditLog />
        </div>
        
        <CryptoList />
      </div>
    </div>
  );
};

export default Index;
