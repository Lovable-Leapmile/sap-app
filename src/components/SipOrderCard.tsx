import { Card } from "@/components/ui/card";
import { Package, Tag, Clock, CheckCircle2, Layers } from "lucide-react";

interface SipOrder {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_ref: string;
  material: string;
  quantity: number;
  quantity_consumed: number;
  activity: string;
}

interface SipOrderCardProps {
  order: SipOrder;
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const SipOrderCard = ({ order }: SipOrderCardProps) => {
  const remainingQuantity = order.quantity - order.quantity_consumed;

  return (
    <Card className="p-5 bg-card hover:shadow-lg transition-all duration-300 border-2 border-border animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="text-primary" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground font-medium">Order Ref</p>
            </div>
            <p className="text-xl font-bold text-foreground">{order.order_ref}</p>
          </div>
        </div>

        {/* Item and Time */}
        <div className="grid grid-cols-2 gap-4 pl-15">
          <div className="flex items-center gap-2">
            <Tag className="text-muted-foreground" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Item</p>
              <p className="text-sm font-semibold text-foreground">{order.material}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Updated</p>
              <p className="text-sm font-semibold text-foreground">
                {formatTime(order.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Quantities */}
        <div className="grid grid-cols-3 gap-3 pl-15">
          <div className="flex items-center gap-2">
            <Layers className="text-primary" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-base font-bold text-primary">{order.quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Picked</p>
              <p className="text-base font-bold text-success">{order.quantity_consumed}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Package className="text-accent" size={16} />
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-base font-bold text-accent">{remainingQuantity}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SipOrderCard;
