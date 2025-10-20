import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Package, RefreshCw, Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface TrayOrder {
  id: number;
  station_friendly_name: string;
  tray_id: string;
}

const fetchTrays = async (itemId: string, inStation: boolean): Promise<Tray[]> => {
  const response = await fetch(
    `https://robotmanagerv1test.qikpod.com/nanostore/trays_for_order?in_station=${inStation}&item_id=${itemId}&order_type=outbound&like=false&num_records=10&offset=0&order_flow=fifo`,
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

const fetchTrayOrder = async (trayId: string): Promise<TrayOrder | null> => {
  const response = await fetch(
    `https://robotmanagerv1test.qikpod.com/nanostore/orders?tray_id=${trayId}&tray_status=tray_ready_to_use&user_id=1&order_by_field=updated_at&order_by_type=ASC`,
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.records && data.records.length > 0 ? data.records[0] : null;
};

const TraysForItem = () => {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedTray, setSelectedTray] = useState<Tray | null>(null);
  const [orderId_internal, setOrderIdInternal] = useState<number | null>(null);
  const [quantityToPick, setQuantityToPick] = useState(1);
  const [isPickingDialogOpen, setIsPickingDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trayOrders, setTrayOrders] = useState<Map<string, TrayOrder>>(new Map());

  // Fetch in-storage trays
  const { data: storageTrays, refetch: refetchStorage } = useQuery({
    queryKey: ["storage-trays", itemId],
    queryFn: () => fetchTrays(itemId || "", false),
    enabled: !!itemId,
    refetchInterval: 5000,
    gcTime: 0,
    staleTime: 0,
  });

  // Fetch in-station trays
  const { data: stationTrays, refetch: refetchStation } = useQuery({
    queryKey: ["station-trays", itemId],
    queryFn: async () => {
      const trays = await fetchTrays(itemId || "", true);
      // Fetch order details for each in-station tray
      const orderPromises = trays.map(tray => fetchTrayOrder(tray.tray_id));
      const orders = await Promise.all(orderPromises);
      
      const ordersMap = new Map<string, TrayOrder>();
      orders.forEach((order, index) => {
        if (order) {
          ordersMap.set(trays[index].tray_id, order);
        }
      });
      setTrayOrders(ordersMap);
      
      return trays;
    },
    enabled: !!itemId,
    refetchInterval: 5000,
    gcTime: 0,
    staleTime: 0,
  });

  const handleRefresh = async () => {
    toast({
      title: "Refreshing trays...",
    });
    await Promise.all([refetchStorage(), refetchStation()]);
    toast({
      title: "Trays updated",
      description: "Latest data loaded successfully",
    });
  };

  const handleRetrieveTray = async (tray: Tray) => {
    try {
      // Check for existing order
      const checkResponse = await fetch(
        `https://robotmanagerv1test.qikpod.com/nanostore/orders?tray_id=${tray.tray_id}&tray_status=tray_ready_to_use&order_by_field=updated_at&order_by_type=ASC`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
          },
        }
      );

      const checkData = await checkResponse.json();

      let order_id: number;

      // If order exists, use it
      if (checkResponse.ok && checkData.records && checkData.records.length > 0) {
        order_id = checkData.records[0].id;
        toast({
          title: "Using Existing Order",
          description: `Order ID: ${order_id}`,
        });
      } else {
        // Create new order
        const createResponse = await fetch(
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

        if (!createResponse.ok) {
          throw new Error("Failed to create order");
        }

        const createData = await createResponse.json();
        order_id = createData.records[0].id;

        toast({
          title: "Tray Requested",
          description: `Waiting for tray ${tray.tray_id} to arrive...`,
        });
      }

      // Open picking dialog
      setSelectedTray(tray);
      setOrderIdInternal(order_id);
      setQuantityToPick(1);
      setIsPickingDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process tray request",
        variant: "destructive",
      });
    }
  };

  const handlePickItem = async (tray: Tray) => {
    const existingOrder = trayOrders.get(tray.tray_id);
    
    if (existingOrder) {
      // Order exists, open picking dialog
      setSelectedTray(tray);
      setOrderIdInternal(existingOrder.id);
      setQuantityToPick(1);
      setIsPickingDialogOpen(true);
    } else {
      // No order, need to create one first
      try {
        const createResponse = await fetch(
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

        if (!createResponse.ok) {
          throw new Error("Failed to create order");
        }

        const createData = await createResponse.json();
        const order_id = createData.records[0].id;

        toast({
          title: "Order Created",
          description: `Order ID: ${order_id}`,
        });

        setSelectedTray(tray);
        setOrderIdInternal(order_id);
        setQuantityToPick(1);
        setIsPickingDialogOpen(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create order",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedTray || !orderId_internal || !orderId || !itemId) return;

    setIsSubmitting(true);
    try {
      // Submit picking transaction
      const response = await fetch(
        `https://robotmanagerv1test.qikpod.com/nanostore/transaction?order_id=${orderId_internal}&item_id=${itemId}&transaction_item_quantity=-${quantityToPick}&transaction_type=outbound&transaction_date=${selectedTray.inbound_date}&sap_order_reference=${orderId}`,
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

      if (!response.ok) {
        throw new Error("Failed to submit transaction");
      }

      toast({
        title: "Success",
        description: `Picked ${quantityToPick} items from tray ${selectedTray.tray_id}`,
      });

      // Reset state and refresh
      setIsPickingDialogOpen(false);
      setSelectedTray(null);
      setOrderIdInternal(null);
      setQuantityToPick(1);
      
      queryClient.invalidateQueries({ queryKey: ["storage-trays"] });
      queryClient.invalidateQueries({ queryKey: ["station-trays"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit picking transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRelease = async (tray: Tray) => {
    const existingOrder = trayOrders.get(tray.tray_id);
    if (!existingOrder) {
      toast({
        title: "Error",
        description: "No order found for this tray",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://robotmanagerv1test.qikpod.com/nanostore/orders/complete?record_id=${existingOrder.id}`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
          },
          body: "",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to release tray");
      }

      toast({
        title: "Tray Released Successfully",
        description: `Tray ${tray.tray_id} has been released`,
      });

      queryClient.invalidateQueries({ queryKey: ["storage-trays"] });
      queryClient.invalidateQueries({ queryKey: ["station-trays"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to release tray",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseFromDialog = async () => {
    if (!orderId_internal) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://robotmanagerv1test.qikpod.com/nanostore/orders/complete?record_id=${orderId_internal}`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
          },
          body: "",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to release tray");
      }

      toast({
        title: "Tray Released Successfully",
        description: `Tray ${selectedTray?.tray_id} has been released`,
      });

      // Reset state and refresh
      setIsPickingDialogOpen(false);
      setSelectedTray(null);
      setOrderIdInternal(null);
      setQuantityToPick(1);
      
      queryClient.invalidateQueries({ queryKey: ["storage-trays"] });
      queryClient.invalidateQueries({ queryKey: ["station-trays"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to release tray",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(`/order/${orderId}`)}
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent/10"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trays</h1>
              <p className="text-xs text-muted-foreground">Item: {itemId}</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="icon"
            className="text-accent hover:bg-accent/10"
          >
            <RefreshCw size={24} />
          </Button>
        </div>
      </header>

      {/* Trays List */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* In Storage Trays */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              🏗 In Storage Trays
              <span className="text-sm text-muted-foreground font-normal">
                ({storageTrays?.length || 0})
              </span>
            </h2>
            <div className="space-y-3">
              {storageTrays && storageTrays.length === 0 && (
                <p className="text-center py-6 text-muted-foreground">No trays in storage</p>
              )}
              {storageTrays?.map((tray) => (
                <Card key={tray.id} className="p-4 border-2 border-border">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="text-primary" size={20} />
                        <span className="font-bold text-foreground text-lg">{tray.tray_id}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {tray.tray_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Available: </span>
                        <span className="font-bold text-foreground">{tray.available_quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Inbound: </span>
                        <span className="font-medium text-foreground">{tray.inbound_date}</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Description: </span>
                      <span className="font-medium text-foreground">{tray.item_description}</span>
                    </div>

                    <Button onClick={() => handleRetrieveTray(tray)} className="w-full">
                      Retrieve Tray
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* In Station Trays */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              🏭 In Station Trays
              <span className="text-sm text-muted-foreground font-normal">
                ({stationTrays?.length || 0})
              </span>
            </h2>
            <div className="space-y-3">
              {stationTrays && stationTrays.length === 0 && (
                <p className="text-center py-6 text-muted-foreground">No trays in station</p>
              )}
              {stationTrays?.map((tray) => {
                const trayOrder = trayOrders.get(tray.tray_id);
                return (
                  <Card key={tray.id} className="p-4 border-2 border-primary/50 bg-primary/5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="text-primary" size={20} />
                          <span className="font-bold text-foreground text-lg">{tray.tray_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {trayOrder && (
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              Station: {trayOrder.station_friendly_name}
                            </span>
                          )}
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            In Station
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Available: </span>
                          <span className="font-bold text-foreground">{tray.available_quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Inbound: </span>
                          <span className="font-medium text-foreground">{tray.inbound_date}</span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Description: </span>
                        <span className="font-medium text-foreground">{tray.item_description}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => handleRelease(tray)} 
                          disabled={isSubmitting || !trayOrder}
                          variant="outline"
                          className="w-full"
                        >
                          🔁 Release
                        </Button>
                        <Button 
                          onClick={() => handlePickItem(tray)} 
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          📦 Pick Item
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Picking Dialog */}
      <Dialog open={isPickingDialogOpen} onOpenChange={setIsPickingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pick Items from Tray</DialogTitle>
            <DialogDescription>
              Tray: {selectedTray?.tray_id} | Available: {selectedTray?.available_quantity}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 py-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantityToPick(Math.max(1, quantityToPick - 1))}
              disabled={quantityToPick <= 1}
            >
              <Minus size={20} />
            </Button>
            <div className="text-4xl font-bold text-primary w-20 text-center">
              {quantityToPick}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantityToPick(Math.min(selectedTray?.available_quantity || 1, quantityToPick + 1))}
              disabled={quantityToPick >= (selectedTray?.available_quantity || 1)}
            >
              <Plus size={20} />
            </Button>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "✅ Submit"}
            </Button>
            <Button onClick={handleReleaseFromDialog} disabled={isSubmitting} variant="outline" className="w-full">
              {isSubmitting ? "Releasing..." : "🔁 Release"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TraysForItem;
