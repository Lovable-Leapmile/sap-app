import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Package, Calendar, Layers, CheckCircle2, Clock } from "lucide-react";
import { orders } from "./Home";
import ItemCard from "@/components/ItemCard";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.orderId === orderId);

  // Calculate stats
  const pendingCount = order?.items.reduce((sum, item) => 
    sum + item.trays.filter(tray => tray.status === "pending").length, 0
  ) || 0;
  const inStationCount = order?.items.reduce((sum, item) => 
    sum + item.trays.filter(tray => tray.status === "in-station").length, 0
  ) || 0;
  const totalPicked = order?.items.reduce((sum, item) => sum + item.pickedQuantity, 0) || 0;
  const totalRequired = order?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
          <Button onClick={() => navigate("/home")} variant="accent">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => navigate("/home")}
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-muted"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
          </div>

          {/* Order Summary */}
          <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Package size={14} />
                  <span className="font-medium">Order ID</span>
                </div>
                <p className="text-base font-bold text-foreground">{order.orderId}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Layers size={14} />
                  <span className="font-medium">Items</span>
                </div>
                <p className="text-base font-bold text-primary">{order.totalItems}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  <span className="font-medium">Date</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{order.date}</p>
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

            {/* Picked Status */}
            <div className="text-sm">
              <span className="text-muted-foreground">Picked: </span>
              <span className="font-bold text-foreground">{totalPicked}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="font-bold text-primary">{totalRequired}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Items to Pick ({order.items.length})
          </h2>

          {order.items.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderDetails;
