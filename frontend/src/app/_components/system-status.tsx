import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function SystemStatus() {
  return (
    <Card className="lg:col-span-6">
      <CardHeader>
        <CardTitle className="text-primary">SYSTEM STATUS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-muted/70 border-dashed p-2 rounded-sm">
              <div className="text-muted-foreground text-xs">UPTIME</div>
              <div className="text-foreground font-mono">34d:12h:45m:21s</div>
            </div>
            <div className="border border-muted/70 border-dashed p-2 rounded-sm">
              <div className="text-muted-foreground text-xs">CPU USAGE</div>
              <div className="text-primary font-mono">24%</div>
            </div>
            <div className="border border-muted/70 border-dashed p-2 rounded-sm">
              <div className="text-muted-foreground text-xs">MEMORY</div>
              <div className="text-primary font-mono">1.2GB/4GB</div>
            </div>
            <div className="border border-muted/70 border-dashed p-2 rounded-sm">
              <div className="text-muted-foreground text-xs">API STATUS</div>
              <div className="text-foreground font-mono">OPERATIONAL</div>
            </div>
          </div>
          <div className="border border-muted/70 border-dashed p-2 rounded-sm">
            <div className="text-muted-foreground text-xs">LAST BACKUP</div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-mono">
                2024-05-08 03:00 AM
              </span>
              <span className="text-xs text-primary">SUCCESS</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
