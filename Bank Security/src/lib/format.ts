export type Severity = "low" | "medium" | "high" | "critical";

export function money(value: number | string, currency = "USD"): string {
  const n = typeof value === "string" ? Number(value) : value;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
}

export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function shortTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export function maskAccount(accountNumber: string): string {
  return `****${accountNumber.slice(-4)}`;
}

export const severityLabel: Record<Severity, string> = {
  low: "LOW",
  medium: "MED",
  high: "HIGH",
  critical: "CRIT",
};

export function severityClasses(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "bg-critical/15 ring-critical/30 text-critical";
    case "high":
      return "bg-high/15 ring-high/30 text-high";
    case "medium":
      return "bg-medium/15 ring-medium/30 text-medium";
    default:
      return "bg-low/15 ring-low/30 text-low";
  }
}

export function severityText(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "text-critical";
    case "high":
      return "text-high";
    case "medium":
      return "text-medium";
    default:
      return "text-low";
  }
}

export function severityDot(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "bg-critical";
    case "high":
      return "bg-high";
    case "medium":
      return "bg-medium";
    default:
      return "bg-low";
  }
}
