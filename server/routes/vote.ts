import { RequestHandler } from "express";
import { VoteRequest, VoteResponse } from "@shared/api";
import path from "node:path";
import { Blockchain } from "../utils/blockchain";
import { encryptAESGCM, sha256 } from "../utils/crypto";
import { loadElection } from "../utils/electionStore";

const chain = new Blockchain(path.join(process.cwd(), "server", "data", "blockchain.json"));

export const castVote: RequestHandler = (req, res) => {
  const { voterHash, candidateId } = req.body as VoteRequest;
  if (!voterHash || !candidateId) return res.status(400).json({ error: "Invalid payload" });

  // Validate election timeline
  const elect = loadElection();
  if (!elect) return res.status(400).json({ error: "Election not configured" });
  const now = Date.now();
  if (now < elect.startAt || now > elect.endAt) {
    return res.status(400).json({ error: "Voting not active" });
  }

  // Prevent double voting by same voterHash
  const existing = chain.getAll().find((b) => (b.data as any)?.voterHash === voterHash);
  if (existing) return res.status(409).json({ error: "Voter has already cast a vote" });

  const key = Buffer.from(elect.encryptionKeyBase64, "base64");
  const encryptedVote = encryptAESGCM(candidateId, key);
  chain.append({ voterHash, encryptedVote });

  const response: VoteResponse = { success: true };
  res.status(200).json(response);
};
