import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Scan } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Home</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="icon"
            className="text-accent hover:bg-accent/10"
          >
            <LogOut size={24} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="container max-w-2xl mx-auto space-y-6">
          {/* SIP Orders Button */}
          <Card 
            className="p-8 bg-card hover:shadow-xl transition-all duration-300 border-2 border-border hover:border-primary/50 cursor-pointer animate-fade-in"
            onClick={() => navigate("/sip-orders")}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Package className="text-primary" size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">SIP Orders</h2>
                <p className="text-muted-foreground">View and manage active orders</p>
              </div>
            </div>
          </Card>

          {/* Scan Tray in Station Button */}
          <Card 
            className="p-8 bg-card hover:shadow-xl transition-all duration-300 border-2 border-border hover:border-accent/50 cursor-pointer animate-fade-in"
            onClick={() => navigate("/scan-tray")}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-20 w-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Scan className="text-accent" size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Scan Tray in Station</h2>
                <p className="text-muted-foreground">Scan and process trays</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
