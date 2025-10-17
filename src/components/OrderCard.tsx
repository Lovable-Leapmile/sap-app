import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, Hash, Layers } from "lucide-react";

interface OrderCardProps {
  orderId: string;
  itemId: string;
  quantity: number;
  date: string;
  onSelect: () => void;
}

const OrderCard = ({ orderId, itemId, quantity, date, onSelect }: OrderCardProps) => {
  return (
    <Card className="p-5 space-y-4 shadow-card hover:shadow-elevated transition-all">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash size={16} />
            <span className="font-medium">Order ID</span>
          </div>
          <p className="text-lg font-bold text-foreground">{orderId}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package size={16} />
            <span className="font-medium">Item ID</span>
          </div>
          <p className="text-lg font-bold text-foreground">{itemId}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers size={16} />
            <span className="font-medium">Quantity</span>
          </div>
          <p className="text-lg font-bold text-primary">{quantity}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span className="font-medium">Date</span>
          </div>
          <p className="text-base font-semibold text-foreground">{date}</p>
        </div>
      </div>
      
      <Button 
        onClick={onSelect} 
        variant="accent" 
        className="w-full"
        size="lg"
      >
        Select Order
      </Button>
    </Card>
  );
};

export default OrderCard;
