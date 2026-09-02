import { severityClasses, severityLabel, type Severity } from "@/lib/format";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`fade-in-soft inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider ring-1 transition-transform duration-200 hover:scale-105 ${severityClasses(severity)}`}
    >
      {severityLabel[severity]}
    </span>
  );
}
