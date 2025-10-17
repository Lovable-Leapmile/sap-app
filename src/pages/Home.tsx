import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "@/components/OrderCard";
import OrderBottomSheet from "@/components/OrderBottomSheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Package } from "lucide-react";

// Dummy order data
const orders = [
  {
    orderId: "ORD-2024-001",
    itemId: "ITEM-5432",
    quantity: 150,
    date: "2024-10-15",
    trays: [
      { trayId: "TRY-A-001", quantity: 50, status: "in-station" as const },
      { trayId: "TRY-A-002", quantity: 50, status: "processing" as const },
      { trayId: "TRY-A-003", quantity: 50, status: "pending" as const },
    ],
  },
  {
    orderId: "ORD-2024-002",
    itemId: "ITEM-6789",
    quantity: 200,
    date: "2024-10-15",
    trays: [
      { trayId: "TRY-B-001", quantity: 100, status: "in-station" as const },
      { trayId: "TRY-B-002", quantity: 100, status: "pending" as const },
    ],
  },
  {
    orderId: "ORD-2024-003",
    itemId: "ITEM-9012",
    quantity: 75,
    date: "2024-10-16",
    trays: [
      { trayId: "TRY-C-001", quantity: 75, status: "processing" as const },
    ],
  },
  {
    orderId: "ORD-2024-004",
    itemId: "ITEM-3456",
    quantity: 300,
    date: "2024-10-16",
    trays: [
      { trayId: "TRY-D-001", quantity: 100, status: "in-station" as const },
      { trayId: "TRY-D-002", quantity: 100, status: "in-station" as const },
      { trayId: "TRY-D-003", quantity: 100, status: "pending" as const },
    ],
  },
  {
    orderId: "ORD-2024-005",
    itemId: "ITEM-7890",
    quantity: 125,
    date: "2024-10-17",
    trays: [
      { trayId: "TRY-E-001", quantity: 125, status: "pending" as const },
    ],
  },
];

const Home = () => {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setIsBottomSheetOpen(true);
  };

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
            <h1 className="text-2xl font-bold text-foreground">SAP Orders</h1>
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

      {/* Orders List */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">
              {orders.length} orders available
            </p>
          </div>
          
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              orderId={order.orderId}
              itemId={order.itemId}
              quantity={order.quantity}
              date={order.date}
              onSelect={() => handleSelectOrder(order)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Sheet */}
      <OrderBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default Home;
