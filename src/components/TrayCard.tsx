import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Box, Package, CheckCircle2, Loader2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrayCardProps {
  trayId: string;
  quantity: number;
  status: "in-station" | "processing" | "pending";
  station?: string;
  onRequest: (trayId: string) => void;
}

const TrayCard = ({ trayId, quantity, status, station, onRequest }: TrayCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const { toast } = useToast();

  const handleSelectTray = () => {
    setIsDialogOpen(true);
    setSelectedQuantity(1);
    setShowConfirmButtons(false);
  };

  const handleQuantityConfirm = () => {
    setShowConfirmButtons(true);
  };

  const handleConfirmPick = () => {
    toast({
      title: "Pick Confirmed",
      description: `Picked ${selectedQuantity} items from ${trayId}`,
      duration: 3000,
    });
    setIsDialogOpen(false);
    setShowConfirmButtons(false);
  };

  const handleReleaseTray = () => {
    toast({
      title: "Tray Released",
      description: `${trayId} has been released`,
      duration: 3000,
    });
    setIsDialogOpen(false);
    setShowConfirmButtons(false);
  };

  const incrementQuantity = () => {
    if (selectedQuantity < quantity) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
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

      <div className="flex items-center justify-between py-2 px-3 bg-card rounded-lg">
        <div className="flex items-center gap-2">
          <Package className="text-muted-foreground" size={18} />
          <span className="text-sm text-muted-foreground">Quantity:</span>
          <span className="text-base font-bold text-foreground">{quantity}</span>
        </div>
        {status === "in-station" && station && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Station:</span>
            <Badge variant="outline" className="font-bold">{station}</Badge>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{getStatusText()}</p>
        {status === "in-station" && (
          <div className="flex gap-2">
            <Button
              onClick={handleReleaseTray}
              variant="destructive"
              className="flex-1"
            >
              Release Tray
            </Button>
            <Button
              onClick={handleSelectTray}
              className="flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              Select Tray
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[80%] max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Quantity - {trayId}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={decrementQuantity}
                disabled={selectedQuantity <= 1}
                className="h-12 w-12"
              >
                <Minus size={20} />
              </Button>
              
              <div className="text-center min-w-[80px]">
                <p className="text-4xl font-bold text-foreground">{selectedQuantity}</p>
                <p className="text-xs text-muted-foreground mt-1">of {quantity}</p>
              </div>
              
              <Button
                size="icon"
                variant="outline"
                onClick={incrementQuantity}
                disabled={selectedQuantity >= quantity}
                className="h-12 w-12"
              >
                <Plus size={20} />
              </Button>
            </div>

            {!showConfirmButtons ? (
              <Button
                onClick={handleQuantityConfirm}
                className="w-full bg-primary"
              >
                Confirm Quantity
              </Button>
            ) : (
              <div className="flex gap-3 w-full">
                <Button
                  onClick={handleConfirmPick}
                  className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                >
                  ✓ Confirm Pick
                </Button>
                <Button
                  onClick={handleReleaseTray}
                  variant="destructive"
                  className="flex-1"
                >
                  ↻ Release Tray
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TrayCard;
