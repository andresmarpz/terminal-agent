import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { coffeeService } from "~/lib/services/coffee-service";
import Image from "next/image";

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
        <Card className="border-2 border-gray-600 bg-black shadow-[0_0_10px_rgba(255,165,0,0.1)] lg:col-span-3 lg:row-span-2">
          <CardHeader>
            <CardTitle className="text-orange-500">COFFEE INVENTORY</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-700/70 p-3 rounded-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  {product.image ? (
                    <div className="h-14 w-14 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-4xl text-orange-400">☕</div>
                  )}
                  <div>
                    <h3 className="text-[#f5f5dc] font-bold uppercase">
                      {product.name}
                    </h3>
                    <p className="text-orange-400 text-lg">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  <span>{product.description}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Terminal Chat - Main focus in the middle */}
        <Card className="border-2 border-gray-600 bg-black shadow-[0_0_10px_rgba(255,165,0,0.1)] lg:col-span-6 flex flex-col">
          <CardHeader>
            <CardTitle className="text-orange-500">TERMINAL CHAT</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="flex-grow overflow-y-auto mb-3 p-3 border border-gray-700/70 bg-black/50 rounded-sm">
              <div className="space-y-4">
                <div className="text-[#f5f5dc]">
                  <span className="text-xs text-orange-500">
                    SYSTEM [08:45:21]:
                  </span>
                  <p className="ml-5 mt-1">
                    Welcome to Terminal Coffee Management System.
                  </p>
                </div>
                <div className="text-[#f5f5dc]">
                  <span className="text-xs text-orange-500">
                    SYSTEM [08:45:25]:
                  </span>
                  <p className="ml-5 mt-1">
                    New shipment alert: SH-2024-0452 dispatched to Seattle.
                  </p>
                </div>
                <div className="text-gray-300">
                  <span className="text-xs text-[#f5f5dc]">
                    USER [08:46:10]:
                  </span>
                  <p className="ml-5 mt-1">Show inventory status</p>
                </div>
                <div className="text-[#f5f5dc]">
                  <span className="text-xs text-orange-500">
                    SYSTEM [08:46:12]:
                  </span>
                  <p className="ml-5 mt-1">
                    Inventory status displayed in COFFEE INVENTORY panel.
                  </p>
                </div>
                <div className="text-gray-300">
                  <span className="text-xs text-[#f5f5dc]">
                    USER [08:47:30]:
                  </span>
                  <p className="ml-5 mt-1">Display recent shipments</p>
                </div>
                <div className="text-[#f5f5dc]">
                  <span className="text-xs text-orange-500">
                    SYSTEM [08:47:32]:
                  </span>
                  <p className="ml-5 mt-1">
                    Displaying recent shipments in SHIPMENT TRACKER panel.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Textarea
                className="resize-none bg-black border-gray-700/70 text-[#f5f5dc] placeholder:text-gray-500"
                placeholder="Enter command..."
                rows={2}
              />
              <Button className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 self-end">
                SEND
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top right section */}
        <div className="lg:col-span-3 grid grid-cols-1 gap-6">
          {/* Recent Clients */}
          <Card className="border-2 border-gray-600 bg-black shadow-[0_0_10px_rgba(255,165,0,0.1)]">
            <CardHeader>
              <CardTitle className="text-orange-500">RECENT CLIENTS</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  {
                    name: "CAFETERIA NOVA",
                    location: "PORTLAND",
                    status: "ACTIVE",
                  },
                  {
                    name: "MORNING BREW CO",
                    location: "SEATTLE",
                    status: "ACTIVE",
                  },
                  {
                    name: "BEAN SCENE",
                    location: "SAN FRANCISCO",
                    status: "PENDING",
                  },
                ].map((client, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-dashed border-gray-700/70 pb-1"
                  >
                    <span className="text-[#f5f5dc]">{client.name}</span>
                    <span
                      className={
                        client.status === "ACTIVE"
                          ? "text-orange-400"
                          : "text-gray-300"
                      }
                    >
                      {client.status}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Shipments */}
          <Card className="border-2 border-gray-600 bg-black shadow-[0_0_10px_rgba(255,165,0,0.1)]">
            <CardHeader>
              <CardTitle className="text-orange-500">
                SHIPMENT TRACKER
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: "SH-2024-0452",
                    destination: "SEATTLE, WA",
                    status: "IN TRANSIT",
                    eta: "2024-05-11",
                  },
                  {
                    id: "SH-2024-0451",
                    destination: "BOSTON, MA",
                    status: "DELIVERED",
                    eta: "2024-05-08",
                  },
                ].map((shipment, i) => (
                  <div
                    key={i}
                    className="border border-gray-700/70 p-2 rounded-sm bg-black/50"
                  >
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>ID: {shipment.id}</span>
                      <span>ETA: {shipment.eta}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[#f5f5dc]">
                        {shipment.destination}
                      </span>
                      <span
                        className={
                          shipment.status === "DELIVERED"
                            ? "text-orange-400"
                            : shipment.status === "IN TRANSIT"
                            ? "text-[#f5f5dc]"
                            : "text-gray-400"
                        }
                      >
                        {shipment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom section */}
        <div className="lg:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Invoice Table - Smaller */}
          <Card className="border-2 border-gray-600 bg-black shadow-[0_0_10px_rgba(255,165,0,0.1)] lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-orange-500">INVOICES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-2 pr-4 text-[#f5f5dc]">INVOICE</th>
                      <th className="pb-2 pr-4 text-[#f5f5dc]">CLIENT</th>
                      <th className="pb-2 text-[#f5f5dc]">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "INV-2024-089",
                        client: "CAFETERIA NOVA",
                        amount: 2450.0,
                        status: "PAID",
                      },
                      {
                        id: "INV-2024-088",
                        client: "BEAN SCENE",
                        amount: 1872.5,
                        status: "PENDING",
                      },
                      {
                        id: "INV-2024-087",
                        client: "DARK MATTER",
                        amount: 3645.75,
                        status: "PAID",
                      },
                    ].map((invoice, i) => (
                      <tr key={i} className="border-b border-gray-800">
                        <td className="py-2 pr-4 text-[#f5f5dc]">
                          {invoice.id}
                        </td>
                        <td className="py-2 pr-4 text-gray-400">
                          {invoice.client}
                        </td>
                        <td
                          className={`py-2 ${
                            invoice.status === "PAID"
                              ? "text-orange-400"
                              : "text-[#f5f5dc]"
                          }`}
                        >
                          ${invoice.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Additional Data Card */}
          <Card className="border-2 border-gray-600 bg-black shadow-[0_0_10px_rgba(255,165,0,0.1)] lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-orange-500">SYSTEM STATUS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-700/70 p-2 rounded-sm">
                    <div className="text-gray-400 text-xs">UPTIME</div>
                    <div className="text-[#f5f5dc] font-mono">
                      34d:12h:45m:21s
                    </div>
                  </div>
                  <div className="border border-gray-700/70 p-2 rounded-sm">
                    <div className="text-gray-400 text-xs">CPU USAGE</div>
                    <div className="text-orange-400 font-mono">24%</div>
                  </div>
                  <div className="border border-gray-700/70 p-2 rounded-sm">
                    <div className="text-gray-400 text-xs">MEMORY</div>
                    <div className="text-orange-400 font-mono">1.2GB/4GB</div>
                  </div>
                  <div className="border border-gray-700/70 p-2 rounded-sm">
                    <div className="text-gray-400 text-xs">API STATUS</div>
                    <div className="text-[#f5f5dc] font-mono">OPERATIONAL</div>
                  </div>
                </div>
                <div className="border border-gray-700/70 p-2 rounded-sm">
                  <div className="text-gray-400 text-xs">LAST BACKUP</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#f5f5dc] font-mono">
                      2024-05-08 03:00 AM
                    </span>
                    <span className="text-xs text-orange-400">SUCCESS</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
