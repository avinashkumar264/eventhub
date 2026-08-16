interface ServiceItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  basePrice: unknown;
}

export function ServiceList({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink/55">
        No services added yet — add at least one to start receiving leads.
      </p>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {services.map((service) => (
        <li
          key={service.id}
          className="rounded-lg border border-ink/10 bg-white px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {service.title}{" "}
              <span className="font-normal text-ink/45">
                &middot; {service.category}
              </span>
            </p>
            {service.basePrice != null && (
              <span className="text-sm text-ink/60">
                from ${Number(service.basePrice).toLocaleString()}
              </span>
            )}
          </div>
          {service.description && (
            <p className="mt-1 text-sm text-ink/55">{service.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
