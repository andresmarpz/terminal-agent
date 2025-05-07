import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ShipmentTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">SHIPMENT TRACKER</CardTitle>
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
              className="border border-muted/50 border-dashed p-2 rounded-sm bg-background/50"
            >
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>ID: {shipment.id}</span>
                <span>ETA: {shipment.eta}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-foreground">{shipment.destination}</span>
                <span
                  className={
                    shipment.status === "DELIVERED"
                      ? "text-primary"
                      : shipment.status === "IN TRANSIT"
                      ? "text-foreground"
                      : "text-muted-foreground"
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
