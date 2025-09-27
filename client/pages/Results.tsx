import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import type { ResultsResponse } from "@shared/api";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as ReTooltip, XAxis, YAxis, Cell } from "recharts";

export default function Results() {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [lang, setLang] = useState<"en" | "hi">(() => (localStorage.getItem("lang") as any) || "en");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/results");
      const j = (await res.json()) as ResultsResponse;
      setData(j);
    };
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: any) => setLang(e.detail);
    window.addEventListener("lang-change", handler as any);
    return () => window.removeEventListener("lang-change", handler as any);
  }, []);

  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50">
      <Header />
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Election Results" : "चुनाव परिणाम"}</CardTitle>
            <CardDescription>
              {lang === "en" ? "Automatically available after the voting timeline ends." : "मतदान समयरेखा समाप्त होने के बाद स्वचालित रूप से उपलब्ध।"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!data || !data.available ? (
              <div className="text-muted-foreground">{lang === "en" ? "Results not available yet." : "परिणाम अभी उपलब्ध नहीं हैं।"}</div>
            ) : (
              <div className="space-y-8">
                <div className="text-sm text-muted-foreground">
                  {lang === "en" ? "Turnout:" : "मतदान प्रतिशत:"} {data.turnoutPercent?.toFixed(1)}% ({data.totalVotes}/{data.election?.totalVoters})
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.byCandidate?.map((d) => ({ name: d.name, votes: d.votes }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <ReTooltip />
                        <Legend />
                        <Bar dataKey="votes" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          dataKey="votes"
                          data={data.byCandidate}
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {data.byCandidate?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ReTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-medium">{lang === "en" ? "Per-person votes" : "व्यक्ति-वार वोट"}</div>
                  <div className="max-h-60 overflow-auto rounded border text-sm">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">Voter Hash</th>
                          <th className="px-3 py-2 text-left">{lang === "en" ? "Candidate" : "उम्मीदवार"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.perPerson?.map((p) => (
                          <tr key={p.voterHash} className="border-t">
                            <td className="px-3 py-2 font-mono text-xs">{p.voterHash.slice(0, 10)}…</td>
                            <td className="px-3 py-2">{p.candidateName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-lg font-semibold">
                    {lang === "en" ? "Winner:" : "विजेता:"} {data.winner?.name} ({data.winner ? data.winner.percent.toFixed(1) : 0}%)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
