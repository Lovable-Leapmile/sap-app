import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TrayCard from "@/components/TrayCard";
import { useToast } from "@/hooks/use-toast";
import { Package, Calendar, Hash, Layers } from "lucide-react";

interface Order {
  orderId: string;
  itemId: string;
  quantity: number;
  date: string;
  trays: Tray[];
}

interface Tray {
  trayId: string;
  quantity: number;
  status: "in-station" | "processing" | "pending";
}

interface OrderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderBottomSheet = ({ isOpen, onClose, order }: OrderBottomSheetProps) => {
  const { toast } = useToast();

  const handleTrayRequest = (trayId: string) => {
    toast({
      title: "Tray Requested Successfully",
      description: "Tray will be processed and will reach the station soon.",
      duration: 4000,
    });
  };

  if (!order) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl font-bold">Selected Order</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-80px)] px-6">
          <div className="space-y-6 pb-6">
            {/* Order Details */}
            <div className="bg-primary/5 rounded-xl p-5 space-y-4 border-2 border-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-3">Order Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash size={16} />
                    <span className="font-medium">Order ID</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{order.orderId}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package size={16} />
                    <span className="font-medium">Item ID</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{order.itemId}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers size={16} />
                    <span className="font-medium">Quantity</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{order.quantity}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span className="font-medium">Date</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">{order.date}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Trays Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">
                Associated Trays ({order.trays.length})
              </h3>
              
              <div className="space-y-3">
                {order.trays.map((tray) => (
                  <TrayCard
                    key={tray.trayId}
                    trayId={tray.trayId}
                    quantity={tray.quantity}
                    status={tray.status}
                    onRequest={handleTrayRequest}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default OrderBottomSheet;
