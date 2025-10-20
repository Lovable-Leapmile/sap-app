import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";
import SapOrderCard from "@/components/SapOrderCard";
import { toast } from "@/hooks/use-toast";

interface SapOrder {
  order_ref: string;
  total_items: number;
  pending_items: number;
  completed_items: number;
  order_status: string;
}

const fetchSapOrders = async (): Promise<SapOrder[]> => {
  const response = await fetch(
    "https://robotmanagerv1test.qikpod.com/nanostore/sap_orders/get_unique_sap_orders?order_status=active",
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await response.json();
  return data.records || [];
};

const SapOrdersList = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ["sap-orders"],
    queryFn: fetchSapOrders,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const handleRefresh = async () => {
    toast({
      title: "Refreshing orders...",
    });
    await refetch();
    toast({
      title: "Orders updated",
      description: "Latest data loaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent/10"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SAP Orders</h1>
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

      {/* Orders List */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive font-semibold">Failed to load orders</p>
              <Button onClick={handleRefresh} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {orders && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active orders found</p>
            </div>
          )}

          {orders && orders.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {orders.length} active orders
                </p>
              </div>

              {orders.map((order) => (
                <SapOrderCard key={order.order_ref} order={order} />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SapOrdersList;
