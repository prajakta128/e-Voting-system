import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Election, VoteRequest } from "@shared/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Cast() {
  const [election, setElection] = useState<Election | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const q = useQuery();

  useEffect(() => {
    const fetchElection = async () => {
      const res = await fetch("/api/election");
      const data = await res.json();
      setElection(data.election || null);
    };
    fetchElection();
  }, []);

  const voterHash = q.get("voterHash") || sessionStorage.getItem("voterHash") || null;
  useEffect(() => {
    if (!voterHash) navigate("/vote");
  }, [voterHash, navigate]);

  const cast = async () => {
    if (!voterHash || !selected) return;
    setLoading(true);
    const payload: VoteRequest = { voterHash, candidateId: selected };
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      sessionStorage.setItem("voted", "1");
      setTimeout(() => {
        navigate("/results");
      }, 1500);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to vote");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50">
      <Header />
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>Select one candidate and confirm to cast your encrypted vote.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!election && <div className="text-muted-foreground">No election configured</div>}
            {election && (
              <div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {election.candidates.map((c) => (
                    <button key={c.id} onClick={() => setSelected(c.id)} className={"flex flex-col items-center gap-2 rounded border p-3 transition hover:shadow " + (selected === c.id ? "border-primary ring-2 ring-primary/30" : "")}>
                      {c.logoDataUrl ? <img src={c.logoDataUrl} alt={c.name} className="h-20 w-20 rounded object-cover" /> : <div className="h-20 w-20 rounded bg-muted flex items-center justify-center text-xl font-bold">{c.name.slice(0,1)}</div>}
                      <div className="font-semibold">{c.name}</div>
                      {c.description && <div className="text-sm text-muted-foreground">{c.description}</div>}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={cast} disabled={!selected || success}>
                    {loading ? "Casting..." : success ? "Vote Cast" : "Confirm Vote"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
