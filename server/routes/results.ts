import { RequestHandler } from "express";
import path from "node:path";
import { Blockchain } from "../utils/blockchain";
import { decryptAESGCM } from "../utils/crypto";
import { loadElection } from "../utils/electionStore";
import { ResultsResponse } from "@shared/api";

const chain = new Blockchain(path.join(process.cwd(), "server", "data", "blockchain.json"));

export const getResults: RequestHandler = (_req, res) => {
  const elect = loadElection();
  if (!elect) return res.json({ available: false } as ResultsResponse);

  const now = Date.now();
  const available = now > elect.endAt;
  if (!available) return res.json({ available: false } as ResultsResponse);

  const blocks = chain.getAll();
  const key = Buffer.from(elect.encryptionKeyBase64, "base64");

  const decrypted: { voterHash: string; candidateId: string; failed?: boolean }[] = [];
  for (const b of blocks) {
    try {
      const candidateId = decryptAESGCM(b.data.encryptedVote, key);
      decrypted.push({ voterHash: b.data.voterHash as string, candidateId });
    } catch (err) {
      // If decrypt fails (e.g., wrong key or malformed block), don't crash — mark as failed and continue
      // eslint-disable-next-line no-console
      console.warn("Failed to decrypt vote block", { index: (b as any).index, err: (err as any)?.message });
      decrypted.push({ voterHash: b.data.voterHash as string, candidateId: "__DECRYPT_FAILED__", failed: true });
    }
  }

  const byCandidateMap = new Map<string, { votes: number; name: string; logoDataUrl?: string }>();
  for (const c of elect.candidates) {
    byCandidateMap.set(c.id, { votes: 0, name: c.name, logoDataUrl: c.logoDataUrl });
  }
  for (const v of decrypted) {
    const entry = byCandidateMap.get(v.candidateId);
    if (entry) entry.votes += 1;
  }
  const byCandidate = Array.from(byCandidateMap.entries()).map(([candidateId, v]) => ({
    candidateId,
    name: v.name,
    logoDataUrl: v.logoDataUrl,
    votes: v.votes,
  }));

  const totalVotes = decrypted.length;
  const turnoutPercent = elect.totalVoters > 0 ? (totalVotes / elect.totalVoters) * 100 : 0;
  const winner = byCandidate.reduce<{ candidateId: string; name: string; percent: number; votes: number } | null>((acc, cur) => {
    if (!acc || cur.votes > acc.votes) return { candidateId: cur.candidateId, name: cur.name, votes: cur.votes, percent: totalVotes ? (cur.votes / totalVotes) * 100 : 0 };
    return acc;
  }, null);

  const perPerson = decrypted.map((d) => ({
    voterHash: d.voterHash,
    candidateId: d.candidateId,
    candidateName: byCandidateMap.get(d.candidateId)?.name || "Unknown",
  }));

  const response: ResultsResponse = {
    available: true,
    election: {
      id: elect.id,
      title: elect.title,
      startAt: elect.startAt,
      endAt: elect.endAt,
      totalVoters: elect.totalVoters,
      candidates: elect.candidates,
    },
    totalVotes,
    turnoutPercent,
    byCandidate,
    perPerson,
    winner,
  };

  res.json(response);
};
