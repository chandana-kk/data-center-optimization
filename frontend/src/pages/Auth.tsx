import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card } from "../components/ui";

export function Auth() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("admin@neurodc.ai");
  const [password, setPassword] = useState("NeuroDC2026!");
  const [name, setName] = useState("NeuroDC Operator");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      if (mode === "forgot") {
        await api("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
        setMessage("Reset instructions queued.");
        return;
      }
      const body = mode === "login" ? { email, password } : { email, password, name };
      const result = await api<{ access_token: string }>(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("neurodc_token", result.access_token);
      navigate("/dashboard");
    } catch {
      setMessage("Authentication failed. Check the API and credentials.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Secure Access</h1>
        <p className="mt-2 text-sm text-slate-400">JWT-protected NeuroDC command console</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "register" && <Field icon={<User size={18} />} value={name} setValue={setName} placeholder="Full name" />}
          <Field icon={<Mail size={18} />} value={email} setValue={setEmail} placeholder="Email" />
          {mode !== "forgot" && <Field icon={<Lock size={18} />} value={password} setValue={setPassword} placeholder="Password" type="password" />}
          <Button className="w-full">{mode === "login" ? "Login" : mode === "register" ? "Register" : "Send Reset Link"}</Button>
        </form>
        <div className="mt-5 flex justify-between text-sm text-slate-400">
          <button onClick={() => setMode("login")}>Login</button>
          <button onClick={() => setMode("register")}>Register</button>
          <button onClick={() => setMode("forgot")}>Forgot Password</button>
        </div>
        {message && <p className="mt-4 text-sm text-cyan-200">{message}</p>}
      </Card>
    </div>
  );
}

function Field({ icon, value, setValue, placeholder, type = "text" }: { icon: React.ReactNode; value: string; setValue: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border bg-white/5 px-3 py-2">
      <span className="text-slate-400">{icon}</span>
      <input className="w-full bg-transparent text-sm outline-none" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} type={type} />
    </label>
  );
}
