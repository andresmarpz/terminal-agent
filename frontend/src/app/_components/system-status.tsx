import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function SystemStatus() {
  return (
    <Card className="lg:col-span-6">
      <CardHeader>
        <CardTitle className="text-orange-500">SYSTEM STATUS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-neutral-700/70 border-dashed p-2 rounded-sm">
              <div className="text-neutral-400 text-xs">UPTIME</div>
              <div className="text-[#f5f5dc] font-mono">34d:12h:45m:21s</div>
            </div>
            <div className="border border-neutral-700/70 border-dashed p-2 rounded-sm">
              <div className="text-neutral-400 text-xs">CPU USAGE</div>
              <div className="text-orange-400 font-mono">24%</div>
            </div>
            <div className="border border-neutral-700/70 border-dashed p-2 rounded-sm">
              <div className="text-neutral-400 text-xs">MEMORY</div>
              <div className="text-orange-400 font-mono">1.2GB/4GB</div>
            </div>
            <div className="border border-neutral-700/70 border-dashed p-2 rounded-sm">
              <div className="text-neutral-400 text-xs">API STATUS</div>
              <div className="text-[#f5f5dc] font-mono">OPERATIONAL</div>
            </div>
          </div>
          <div className="border border-neutral-700/70 border-dashed p-2 rounded-sm">
            <div className="text-neutral-400 text-xs">LAST BACKUP</div>
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
  );
}
