import { Button } from "~/components/ui/button";
import { coffeeService } from "~/lib/services/coffee-service";
import Products from "~/app/_components/products";
import ShipmentTracker from "~/app/_components/shipment-tracker";
import SystemStatus from "~/app/_components/system-status";
import Console from "~/app/_components/console";
import RecentClients from "~/app/_components/recent-clients";
import InvoiceTable from "~/app/_components/invoice-table";

async function getProducts() {
  return coffeeService.getProducts();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-6 font-mono">
      <header className="mb-6">
        <div className="flex justify-between items-center border-b-2 border-accent pb-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              TERMINAL COFFEE SYSTEM
            </h1>
            <p className="text-xs text-muted-foreground">
              ACCESS ID: C0F-F33-2023-05-08:12:45.621Z
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              STATUS
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              EXPORT
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        {/* Coffee Products Section - Tall vertical rectangle */}
        <Products products={products} />

        {/* Terminal Chat - Main focus in the middle */}
        <Console />

        {/* Top right section */}
        <div className="lg:col-span-3 grid grid-cols-1 gap-6">
          {/* Recent Clients */}
          <RecentClients />

          {/* Shipments */}
          <ShipmentTracker />
        </div>

        {/* Bottom section */}
        <div className="lg:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Invoice Table - Smaller */}
          <InvoiceTable />

          {/* Additional Data Card */}
          <SystemStatus />
        </div>
      </div>

      <footer className="mt-6 border-t-2 border-muted pt-3 text-xs text-muted">
        <div className="flex justify-between">
          <span>TERMINAL COFFEE SYSTEM v1.0.5</span>
          <span>AUTHORIZED ACCESS ONLY • MONITORING ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
