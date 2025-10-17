import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Package, CheckCircle2, Loader2 } from "lucide-react";

interface TrayCardProps {
  trayId: string;
  quantity: number;
  status: "in-station" | "processing" | "pending";
  onRequest: (trayId: string) => void;
}

const TrayCard = ({ trayId, quantity, status, onRequest }: TrayCardProps) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      onRequest(trayId);
      setIsRequesting(false);
    }, 500);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "in-station":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2 size={14} className="mr-1" />
            In Station
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-processing text-processing-foreground">
            <Loader2 size={14} className="mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Pending
          </Badge>
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "in-station":
        return "Tray is in Station";
      case "processing":
        return "Tray is Processing";
      case "pending":
        return "Tray awaiting request";
    }
  };

  return (
    <Card className="p-4 space-y-3 bg-secondary/30 border-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Box className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Tray ID</p>
            <p className="text-lg font-bold text-foreground">{trayId}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center gap-2 py-2 px-3 bg-card rounded-lg">
        <Package className="text-muted-foreground" size={18} />
        <span className="text-sm text-muted-foreground">Quantity:</span>
        <span className="text-base font-bold text-foreground">{quantity}</span>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{getStatusText()}</p>
        {status === "pending" && (
          <Button
            onClick={handleRequest}
            variant="accent"
            className="w-full"
            disabled={isRequesting}
          >
            {isRequesting ? (
              <>
                <Loader2 className="animate-spin" />
                Requesting...
              </>
            ) : (
              "Request Tray"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TrayCard;
