import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";

export default function Console() {
  return (
    <Card className="lg:col-span-6 flex flex-col">
      <CardHeader>
        <CardTitle className="text-primary">CONSOLE</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto mb-3 p-3 border border-muted/70 bg-background/50 rounded-sm">
          <div className="space-y-4">
            <div className="text-foreground">
              <span className="text-xs text-primary">SYSTEM [08:45:21]:</span>
              <p className="ml-5 mt-1">
                Welcome to Terminal Coffee Management System.
              </p>
            </div>
            <div className="text-foreground">
              <span className="text-xs text-primary">SYSTEM [08:45:25]:</span>
              <p className="ml-5 mt-1">
                New shipment alert: SH-2024-0452 dispatched to Seattle.
              </p>
            </div>
            <div className="text-foreground">
              <span className="text-xs text-foreground">USER [08:46:10]:</span>
              <p className="ml-5 mt-1">Show inventory status</p>
            </div>
            <div className="text-foreground">
              <span className="text-xs text-primary">SYSTEM [08:46:12]:</span>
              <p className="ml-5 mt-1">
                Inventory status displayed in COFFEE INVENTORY panel.
              </p>
            </div>
            <div className="text-foreground">
              <span className="text-xs text-foreground">USER [08:47:30]:</span>
              <p className="ml-5 mt-1">Display recent shipments</p>
            </div>
            <div className="text-foreground">
              <span className="text-xs text-primary">SYSTEM [08:47:32]:</span>
              <p className="ml-5 mt-1">
                Displaying recent shipments in SHIPMENT TRACKER panel.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Textarea
            className="resize-none bg-input border-muted/70 text-foreground placeholder:text-muted"
            placeholder="Enter command..."
            rows={2}
          />
          <Button className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 self-end">
            SEND
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
