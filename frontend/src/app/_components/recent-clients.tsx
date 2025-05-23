import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function RecentClients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">RECENT CLIENTS</CardTitle>
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
              className="flex justify-between border-b border-dashed border-muted/70 pb-1"
            >
              <span className="text-foreground">{client.name}</span>
              <span
                className={
                  client.status === "ACTIVE"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {client.status}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
