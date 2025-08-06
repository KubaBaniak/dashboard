import { ClientCard } from "../clients/ClientCard";

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const latestClients = [
  {
    id: 1,
    name: "Anna Kowalska",
    email: "anna@example.com",
    createdAt: "2025-08-05T10:00:00Z",
  },
  {
    id: 2,
    name: "Piotr Nowak",
    email: "piotr@example.com",
    createdAt: "2025-08-04T12:30:00Z",
  },
  {
    id: 3,
    name: "Ewa Zielińska",
    email: "ewa@example.com",
    createdAt: "2025-08-03T15:45:00Z",
  },
];

const topClients = [
  {
    id: 4,
    name: "Tomasz Wiśniewski",
    email: "tomasz@example.com",
    totalSpent: 1520.75,
  },
  {
    id: 5,
    name: "Katarzyna Lewandowska",
    email: "katarzyna@example.com",
    totalSpent: 1340.0,
  },
  {
    id: 6,
    name: "Marcin Wójcik",
    email: "marcin@example.com",
    totalSpent: 980.5,
  },
];

export function ClientSummaryCards() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">🆕 Latest Clients</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestClients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              email={client.email}
              footer={`Registered on ${formatDate(client.createdAt)}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">🏆 Top Clients</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topClients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              email={client.email}
              footer={
                <>
                  Total spent:{" "}
                  <span className="text-foreground font-medium">
                    {formatCurrency(client.totalSpent)}
                  </span>
                </>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
