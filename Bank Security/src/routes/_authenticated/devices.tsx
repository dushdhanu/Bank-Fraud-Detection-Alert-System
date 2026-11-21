import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, Panel } from "@/components/AppShell";
import { getDeviceLogs } from "@/lib/fraud.functions";
import { ago, maskAccount } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/devices")({
  head: () => ({
    meta: [
      { title: "Device & IP Log — BankGuard" },
      {
        name: "description",
        content:
          "Device, browser, IP address, ASN and fingerprint metadata captured at login and transaction time.",
      },
      { property: "og:title", content: "Device & IP Log — BankGuard" },
      {
        property: "og:description",
        content: "The metadata trail investigators legally work from: IP, ASN, device, fingerprint.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DevicesPage,
});

function DevicesPage() {
  const logsFn = useServerFn(getDeviceLogs);
  const { data } = useQuery({ queryKey: ["device-logs"], queryFn: () => logsFn({}) });
  const logs = data ?? [];

  return (
    <AppShell
      title="Device & IP fingerprint log"
      subtitle="Metadata recorded at login and transaction time. Attribution of an actor is a matter for law enforcement, not this system."
    >
      <Panel title={`Events · ${logs.length}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Account", "Event", "IP", "ASN", "Device", "Browser", "Fingerprint", "Geo", "First seen", "Age"].map(
                  (h) => (
                    <th key={h} className="label-xs whitespace-nowrap px-3 py-2">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {l.accounts ? maskAccount(l.accounts.account_number) : "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] uppercase text-foreground">
                    {l.event}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-foreground">
                    {l.ip_address ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {l.asn ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{l.device ?? "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{l.browser ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {l.fingerprint ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {l.city ?? "—"}, {l.country ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-foreground">
                    {l.first_seen ? "yes" : "no"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {ago(l.created_at)}
                  </td>
                </tr>
              ))}
              {logs.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-sm text-muted-foreground" colSpan={10}>
                    No device events recorded.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
