import { Bell, KeyRound, Moon, Users } from "lucide-react";
import { Button, Card, PageHeader } from "../components/ui";

export function Settings() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Theme, notifications, user management, API keys, email alerts, SMS alerts, and critical alert policies." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-5 flex items-center gap-2 font-semibold"><Moon size={18} /> Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {["Dark", "Darker", "Console"].map((theme) => <button key={theme} className="rounded-md border border-border bg-white/5 p-3 text-sm">{theme}</button>)}
          </div>
        </Card>
        <Card>
          <h3 className="mb-5 flex items-center gap-2 font-semibold"><Bell size={18} /> Notifications</h3>
          {["Email Alerts", "SMS Alerts", "Critical Alerts", "Server Failure", "Power Spike", "Temperature Spike"].map((item) => (
            <label key={item} className="mb-3 flex items-center justify-between rounded-md border border-border bg-white/5 p-3 text-sm">
              {item}<input type="checkbox" className="h-4 w-4 accent-cyan-300" defaultChecked />
            </label>
          ))}
        </Card>
        <Card>
          <h3 className="mb-5 flex items-center gap-2 font-semibold"><Users size={18} /> User Management</h3>
          {["Admin", "Operator", "Sustainability Lead", "Executive Viewer"].map((role) => <div key={role} className="mb-2 rounded-md bg-white/5 p-3 text-sm">{role}</div>)}
        </Card>
        <Card>
          <h3 className="mb-5 flex items-center gap-2 font-semibold"><KeyRound size={18} /> API Keys</h3>
          <div className="rounded-md border border-border bg-black/25 p-3 font-mono text-sm text-cyan-200">ndc_live_••••••••••••••••</div>
          <Button className="mt-4">Rotate Key</Button>
        </Card>
      </div>
    </>
  );
}
