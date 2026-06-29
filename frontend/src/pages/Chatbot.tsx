import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card, PageHeader } from "../components/ui";

export function Chatbot() {
  const [question, setQuestion] = useState("Why is Rack 3 overheating?");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ask me about energy, cooling, failures, costs, or any NeuroDC graph." }]);

  async function ask() {
    const q = question.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    const response = await api<{ answer: string }>("/api/chat", { method: "POST", body: JSON.stringify({ question: q }) });
    setMessages((m) => [...m, { role: "assistant", text: response.answer }]);
  }

  return (
    <>
      <PageHeader title="AI Copilot" subtitle="Natural language analytics for root cause, cost reduction, graph explanation, and future power predictions." />
      <Card className="mx-auto max-w-4xl">
        <div className="h-[520px] overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-lg px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-white" : "bg-white/7 text-slate-200"}`}>
                {message.role === "assistant" && <Bot size={16} className="mb-2 text-cyan-200" />}
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <input className="min-w-0 flex-1 rounded-md border border-border bg-white/5 px-4 outline-none focus:ring-2 focus:ring-accent" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} />
          <Button onClick={ask}><Send size={17} /> Ask</Button>
        </div>
      </Card>
    </>
  );
}
