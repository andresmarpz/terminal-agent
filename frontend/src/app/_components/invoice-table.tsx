import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function InvoiceTable() {
  return (
    <Card className="lg:col-span-6">
      <CardHeader>
        <CardTitle className="text-primary">INVOICES</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-muted">
                <th className="pb-2 pr-4 text-foreground">INVOICE</th>
                <th className="pb-2 pr-4 text-foreground">CLIENT</th>
                <th className="pb-2 text-foreground">AMOUNT</th>
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
                <tr key={i} className="border-b border-secondary">
                  <td className="py-2 pr-4 text-foreground">{invoice.id}</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {invoice.client}
                  </td>
                  <td
                    className={`py-2 ${
                      invoice.status === "PAID"
                        ? "text-primary"
                        : "text-foreground"
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
  );
}
