import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Package, Layers } from "lucide-react";
import TrayCard from "./TrayCard";
import { useToast } from "@/hooks/use-toast";

interface Tray {
  trayId: string;
  quantity: number;
  status: "in-station" | "processing" | "pending";
  station?: string;
}

interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
  pickedQuantity: number;
  trays: Tray[];
}

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const remainingQuantity = item.quantity - item.pickedQuantity;
  const { toast } = useToast();

  const handleTrayRequest = (trayId: string) => {
    toast({
      title: "Tray Requested Successfully",
      description: "Tray will be processed and will reach the station soon.",
      duration: 4000,
    });
  };

  return (
    <Card className="overflow-hidden border-2 border-border animate-fade-in">
      {/* Item Header */}
      <div
        className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{item.itemName}</p>
                <p className="text-xs text-muted-foreground">{item.itemId}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 pl-11">
              <div className="flex items-center gap-2">
                <Layers className="text-muted-foreground" size={14} />
                <div>
                  <p className="text-xs text-muted-foreground">Required</p>
                  <p className="text-sm font-bold text-foreground">{item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-sm font-bold text-primary">{item.pickedQuantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Picked</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-accent/10 rounded-md border border-accent/20">
                  <p className="text-sm font-bold text-accent">{remainingQuantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </Button>
        </div>
      </div>

      {/* Expanded Trays Section */}
      {isExpanded && (
        <div className="border-t-2 border-border bg-muted/30 p-5 space-y-3 animate-accordion-down">
          <h3 className="text-sm font-bold text-foreground mb-3">
            Available Trays ({item.trays.length})
          </h3>

          <div className="space-y-3">
            {item.trays.map((tray) => (
              <TrayCard
                key={tray.trayId}
                trayId={tray.trayId}
                quantity={tray.quantity}
                status={tray.status}
                station={tray.station}
                onRequest={handleTrayRequest}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ItemCard;
