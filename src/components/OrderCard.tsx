import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Layers, ChevronRight, CheckCircle2, Clock } from "lucide-react";

interface OrderCardProps {
  orderId: string;
  totalItems: number;
  date: string;
  pendingCount: number;
  inStationCount: number;
  onSelect: () => void;
}

const OrderCard = ({ orderId, totalItems, date, pendingCount, inStationCount, onSelect }: OrderCardProps) => {
  return (
    <Card className="p-5 bg-card hover:shadow-lg transition-all duration-300 border-2 border-border hover:border-primary/30 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Order ID */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Order ID</p>
              <p className="text-lg font-bold text-foreground">{orderId}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3 pl-12">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Layers className="text-muted-foreground" size={16} />
                <div>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                  <p className="text-base font-bold text-primary">{totalItems}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground" size={16} />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-foreground">{date}</p>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2 size={14} className="mr-1" />
                {inStationCount} In Station
              </Badge>
              <Badge className="bg-warning text-warning-foreground">
                <Clock size={14} className="mr-1" />
                {pendingCount} Pending
              </Badge>
            </div>
          </div>
        </div>

        {/* Select Button */}
        <Button
          onClick={onSelect}
          variant="accent"
          size="lg"
          className="h-full min-h-[100px] px-6 flex-col gap-2"
        >
          <span className="text-base font-bold">View</span>
          <ChevronRight size={24} />
        </Button>
      </div>
    </Card>
  );
};

export default OrderCard;
