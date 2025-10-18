import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Scan } from "lucide-react";

const ScanTray = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-accent/10"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Scan className="text-accent-foreground" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Scan Tray in Station</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="h-24 w-24 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
            <Scan className="text-accent" size={56} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Scan Tray Feature</h2>
          <p className="text-muted-foreground">
            Tray scanning functionality will be implemented here.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ScanTray;
