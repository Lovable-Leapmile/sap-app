import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Tag, Clock, CheckCircle2, Layers } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface SapOrder {
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

interface SapOrderCardProps {
  order: SapOrder;
}

interface Tray {
  id: number;
  tray_id: string;
  tray_status: string;
  available_quantity: number;
  inbound_date: string;
  item_id: string;
  item_description: string;
  tray_height: number;
  tray_weight: number;
}

const fetchTrays = async (itemId: string): Promise<Tray[]> => {
  const response = await fetch(
    `https://robotmanagerv1test.qikpod.com/nanostore/trays_for_order?item_id=${itemId}&order_type=outbound&like=false&num_records=10&offset=0&order_flow=fifo`,
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trays");
  }

  const data = await response.json();
  return data.records || [];
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const SapOrderCard = ({ order }: SapOrderCardProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const remainingQuantity = order.quantity - order.quantity_consumed;

  const { data: trays, isLoading } = useQuery({
    queryKey: ["trays", order.material],
    queryFn: () => fetchTrays(order.material),
    enabled: isDrawerOpen,
  });

  const handleRetrieve = async (tray: Tray) => {
    try {
      // First, check if tray is already requested
      const checkResponse = await fetch(
        `https://robotmanagerv1test.qikpod.com/nanostore/orders?tray_id=${tray.tray_id}&status=active&user_id=1&order_by_field=updated_at&order_by_type=ASC`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
          },
        }
      );

      const checkData = await checkResponse.json();

      // If tray is already requested (has active orders)
      if (checkResponse.ok && checkData.records && checkData.records.length > 0) {
        toast({
          title: "Tray Already Requested",
          description: `Tray ${tray.tray_id} is already in an active order`,
          variant: "destructive",
        });
        return;
      }

      // If not requested, create a new order
      const requestResponse = await fetch(
        `https://robotmanagerv1test.qikpod.com/nanostore/orders?tray_id=${tray.tray_id}&user_id=1&auto_complete_time=10`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
          },
          body: "",
        }
      );

      if (!requestResponse.ok) {
        throw new Error("Failed to request tray");
      }

      toast({
        title: "Tray Requested Successfully",
        description: `Tray ${tray.tray_id} with ${tray.available_quantity} items has been requested`,
      });
      setIsDrawerOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process tray request",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card 
        className="p-5 bg-card hover:shadow-lg transition-all duration-300 border-2 border-border animate-fade-in cursor-pointer active:scale-[0.98]"
        onClick={() => setIsDrawerOpen(true)}
      >
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Available Trays for {order.material}</DrawerTitle>
            <DrawerDescription>
              Order Ref: {order.order_ref} - Select a tray to retrieve
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto space-y-3">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading trays...
              </div>
            )}

            {!isLoading && trays && trays.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No trays available for this item
              </div>
            )}

            {!isLoading &&
              trays &&
              trays.map((tray) => (
                <Card key={tray.id} className="p-4 border-2 border-border">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="text-primary" size={20} />
                        <span className="font-bold text-foreground text-lg">
                          {tray.tray_id}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          tray.tray_status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {tray.tray_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Available: </span>
                        <span className="font-bold text-foreground">
                          {tray.available_quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Inbound: </span>
                        <span className="font-medium text-foreground">
                          {tray.inbound_date}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Description: </span>
                      <span className="font-medium text-foreground">
                        {tray.item_description}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleRetrieve(tray)}
                      className="w-full mt-2"
                      variant="default"
                    >
                      Retrieve
                    </Button>
                  </div>
                </Card>
              ))}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SapOrderCard;
