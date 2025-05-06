import { Button } from "~/components/ui/button";
import { coffeeService } from "~/lib/services/coffee-service";
import { ProductRotator } from "~/components/terminal/ProductRotator";
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
    <div className="min-h-screen flex flex-col bg-black text-[#f5f5dc] p-6 font-mono">
      <header className="mb-6">
        <div className="flex justify-between items-center border-b-2 border-orange-500/50 pb-3">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">
              TERMINAL COFFEE SYSTEM
            </h1>
            <p className="text-xs text-[#f5f5dc]/80">
              ACCESS ID: C0F-F33-2023-05-08:12:45.621Z
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
            >
              STATUS
            </Button>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
            >
              EXPORT
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        {/* Coffee Products Section - Tall vertical rectangle */}
        <ProductRotator products={products} />

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

      <footer className="mt-6 border-t-2 border-gray-700 pt-3 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>TERMINAL COFFEE SYSTEM v1.0.5</span>
          <span>AUTHORIZED ACCESS ONLY • MONITORING ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
