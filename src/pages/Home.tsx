import { useNavigate } from "react-router-dom";
import OrderCard from "@/components/OrderCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Package } from "lucide-react";

// Dummy order data
export const orders = [
  {
    orderId: "ORD-2024-001",
    totalItems: 3,
    date: "2024-10-15",
    items: [
      {
        itemId: "ITEM-5432",
        itemName: "Hydraulic Pump",
        quantity: 150,
        pickedQuantity: 50,
        trays: [
          { trayId: "TRY-A-001", quantity: 50, status: "in-station" as const, station: "A" },
          { trayId: "TRY-A-002", quantity: 50, status: "processing" as const },
          { trayId: "TRY-A-003", quantity: 50, status: "pending" as const },
        ],
      },
      {
        itemId: "ITEM-6543",
        itemName: "Pressure Valve",
        quantity: 80,
        pickedQuantity: 30,
        trays: [
          { trayId: "TRY-A-004", quantity: 80, status: "in-station" as const, station: "B" },
        ],
      },
      {
        itemId: "ITEM-7654",
        itemName: "Filter Kit",
        quantity: 200,
        pickedQuantity: 100,
        trays: [
          { trayId: "TRY-A-005", quantity: 100, status: "pending" as const },
          { trayId: "TRY-A-006", quantity: 100, status: "pending" as const },
        ],
      },
    ],
  },
  {
    orderId: "ORD-2024-002",
    totalItems: 2,
    date: "2024-10-15",
    items: [
      {
        itemId: "ITEM-6789",
        itemName: "Sealing Ring",
        quantity: 200,
        pickedQuantity: 150,
        trays: [
          { trayId: "TRY-B-001", quantity: 100, status: "in-station" as const, station: "A" },
          { trayId: "TRY-B-002", quantity: 100, status: "pending" as const },
        ],
      },
      {
        itemId: "ITEM-7890",
        itemName: "Bearing Assembly",
        quantity: 50,
        pickedQuantity: 25,
        trays: [
          { trayId: "TRY-B-003", quantity: 50, status: "processing" as const },
        ],
      },
    ],
  },
  {
    orderId: "ORD-2024-003",
    totalItems: 1,
    date: "2024-10-16",
    items: [
      {
        itemId: "ITEM-9012",
        itemName: "Control Module",
        quantity: 75,
        pickedQuantity: 0,
        trays: [
          { trayId: "TRY-C-001", quantity: 75, status: "processing" as const },
        ],
      },
    ],
  },
  {
    orderId: "ORD-2024-004",
    totalItems: 4,
    date: "2024-10-16",
    items: [
      {
        itemId: "ITEM-3456",
        itemName: "Connector Set",
        quantity: 300,
        pickedQuantity: 200,
        trays: [
          { trayId: "TRY-D-001", quantity: 100, status: "in-station" as const, station: "A" },
          { trayId: "TRY-D-002", quantity: 100, status: "in-station" as const, station: "B" },
          { trayId: "TRY-D-003", quantity: 100, status: "pending" as const },
        ],
      },
      {
        itemId: "ITEM-4567",
        itemName: "Gasket Pack",
        quantity: 120,
        pickedQuantity: 60,
        trays: [
          { trayId: "TRY-D-004", quantity: 120, status: "in-station" as const, station: "A" },
        ],
      },
      {
        itemId: "ITEM-5678",
        itemName: "Mounting Bracket",
        quantity: 60,
        pickedQuantity: 10,
        trays: [
          { trayId: "TRY-D-005", quantity: 60, status: "pending" as const },
        ],
      },
      {
        itemId: "ITEM-6789",
        itemName: "Fastener Kit",
        quantity: 500,
        pickedQuantity: 250,
        trays: [
          { trayId: "TRY-D-006", quantity: 250, status: "in-station" as const, station: "B" },
          { trayId: "TRY-D-007", quantity: 250, status: "pending" as const },
        ],
      },
    ],
  },
  {
    orderId: "ORD-2024-005",
    totalItems: 2,
    date: "2024-10-17",
    items: [
      {
        itemId: "ITEM-7890",
        itemName: "Cable Assembly",
        quantity: 125,
        pickedQuantity: 0,
        trays: [
          { trayId: "TRY-E-001", quantity: 125, status: "pending" as const },
        ],
      },
      {
        itemId: "ITEM-8901",
        itemName: "Junction Box",
        quantity: 40,
        pickedQuantity: 0,
        trays: [
          { trayId: "TRY-E-002", quantity: 40, status: "pending" as const },
        ],
      },
    ],
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleSelectOrder = (orderId: string) => {
    navigate(`/home/${orderId}`);
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
          
          {orders.map((order) => {
            // Calculate stats for each order
            const pendingCount = order.items.reduce((sum, item) => 
              sum + item.trays.filter(tray => tray.status === "pending").length, 0
            );
            const inStationCount = order.items.reduce((sum, item) => 
              sum + item.trays.filter(tray => tray.status === "in-station").length, 0
            );
            const totalPicked = order.items.reduce((sum, item) => sum + item.pickedQuantity, 0);
            const totalRequired = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <OrderCard
                key={order.orderId}
                orderId={order.orderId}
                totalItems={order.totalItems}
                date={order.date}
                pendingCount={pendingCount}
                inStationCount={inStationCount}
                totalPicked={totalPicked}
                totalRequired={totalRequired}
                onSelect={() => handleSelectOrder(order.orderId)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Home;
