import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, PageHeader } from "../components/ui";

export function DigitalTwin() {
  const [data, setData] = useState<any>({ racks: [] });
  const [selected, setSelected] = useState<any>(null);
  useEffect(() => { api<any>("/api/digital-twin").then(setData).catch(() => {}); }, []);
  const color = (status: string) => status === "critical" ? "bg-rose-400" : status === "warning" ? "bg-amber-300" : "bg-emerald-300";

  return (
    <>
      <PageHeader title="Digital Twin" subtitle="Interactive live model of rooms, racks, servers, health colors, hover details, and server inspection." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="min-h-[680px]">
          <div className="grid gap-6 md:grid-cols-2">
            {(data.rooms || []).map((room: string) => (
              <div key={room} className="rounded-lg border border-border bg-white/4 p-4">
                <h3 className="mb-4 font-semibold">{room}</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.racks.filter((r: any) => r.room === room).map((rack: any) => (
                    <div key={rack.id} className="rounded-md border border-border bg-[#07101d] p-2">
                      <div className="mb-2 text-xs text-slate-400">{rack.name}</div>
                      <div className="grid grid-cols-3 gap-1">
                        {rack.servers.map((server: any) => (
                          <button
                            key={server.id}
                            title={`${server.hostname} · ${server.status} · ${server.health}%`}
                            onClick={() => setSelected({ ...server, rack: rack.name, zone: rack.zone })}
                            className={`h-5 rounded-sm ${color(server.status)} transition hover:scale-110`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Server Health</h3>
          {selected ? (
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Hostname</span><span>{selected.hostname}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Rack</span><span>{selected.rack}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Zone</span><span>{selected.zone}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status</span><span>{selected.status}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Health</span><span>{selected.health}%</span></div>
            </div>
          ) : <p className="mt-4 text-sm text-slate-400">Select a server in the digital twin.</p>}
        </Card>
      </div>
    </>
  );
}
