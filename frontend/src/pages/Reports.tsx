import { Download } from "lucide-react";
import { API_URL } from "../lib/api";
import { Button, Card, PageHeader } from "../components/ui";

const formats = ["pdf", "xlsx", "csv", "pptx"];

export function Reports() {
  return (
    <>
      <PageHeader title="Reports" subtitle="Generate board-ready reports for PDF, Excel, CSV, and PowerPoint exports." />
      <div className="grid gap-4 md:grid-cols-4">
        {formats.map((format) => (
          <Card key={format}>
            <h3 className="text-lg font-semibold uppercase">{format}</h3>
            <p className="mt-3 min-h-12 text-sm text-slate-400">Executive metrics, optimization findings, carbon impact, and savings estimates.</p>
            <a href={`${API_URL}/api/reports/export/${format}?token=${localStorage.getItem("neurodc_token") || ""}`}>
              <Button className="mt-5 w-full"><Download size={17} /> Download</Button>
            </a>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h3 className="font-semibold">AI Generated Daily Report</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Today’s optimization focus is idle compute retirement, Rack A workload migration, Zone 5 cooling response, and renewable-aware scheduling. Estimated monthly savings are above target, with the strongest carbon reduction from workload shifting after midnight.
        </p>
      </Card>
    </>
  );
}
