import { RequestHandler } from "express";
import { CreateElectionRequest, CreateElectionResponse, GetElectionResponse, Election } from "@shared/api";
import { hasSession } from "../utils/session";
import { loadElection, saveElection } from "../utils/electionStore";

export const createElection: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace(/^Bearer\s+/i, "");
  if (!hasSession(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const body = req.body as CreateElectionRequest;
  if (!body.title || !body.startAt || !body.endAt || !body.totalVoters || !Array.isArray(body.candidates) || body.candidates.length < 1) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  if (body.endAt <= body.startAt) return res.status(400).json({ error: "Invalid timeline" });

  const saved = saveElection({
    title: body.title,
    startAt: body.startAt,
    endAt: body.endAt,
    totalVoters: body.totalVoters,
    candidates: body.candidates.map((c, idx) => ({ id: `${idx}-${Date.now()}`, name: c.name, description: (c as any).description, logoDataUrl: c.logoDataUrl })),
    encryptionKeyBase64: undefined as any,
  });

  const publicElection: Election = {
    id: saved.id,
    title: saved.title,
    startAt: saved.startAt,
    endAt: saved.endAt,
    totalVoters: saved.totalVoters,
    candidates: saved.candidates,
  };

  const response: CreateElectionResponse = { election: publicElection };
  res.status(200).json(response);
};

export const getElection: RequestHandler = (_req, res) => {
  const saved = loadElection();
  const response: GetElectionResponse = {
    election: saved
      ? {
          id: saved.id,
          title: saved.title,
          startAt: saved.startAt,
          endAt: saved.endAt,
          totalVoters: saved.totalVoters,
          candidates: saved.candidates,
        }
      : null,
  };
  res.json(response);
};
