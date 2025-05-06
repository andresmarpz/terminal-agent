import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ShipmentTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-500">SHIPMENT TRACKER</CardTitle>
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
              className="border border-neutral-700/50 border-dashed p-2 rounded-sm bg-black/50"
            >
              <div className="flex justify-between text-xs text-neutral-400">
                <span>ID: {shipment.id}</span>
                <span>ETA: {shipment.eta}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[#f5f5dc]">{shipment.destination}</span>
                <span
                  className={
                    shipment.status === "DELIVERED"
                      ? "text-orange-400"
                      : shipment.status === "IN TRANSIT"
                      ? "text-[#f5f5dc]"
                      : "text-neutral-400"
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
  );
}
