import { RequestHandler } from "express";
import { LoginRequest, LoginResponse } from "@shared/api";
import crypto from "node:crypto";
import { createSession, hasSession } from "../utils/session";

const DEMO_EMAIL = "admin@evote.com";
const DEMO_PASSWORD = "Admin@123";

export const login: RequestHandler = (req, res) => {
  const body = req.body as LoginRequest;
  if (body.email === DEMO_EMAIL && body.password === DEMO_PASSWORD) {
    const token = crypto.randomUUID();
    createSession(token);
    const response: LoginResponse = { token };
    res.status(200).json(response);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const validateSession: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace(/^Bearer\s+/i, "");
  res.json({ valid: hasSession(token) });
};

import fs from "node:fs";
import path from "node:path";
import { clearElection } from "../utils/electionStore";

export const clearData: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace(/^Bearer\s+/i, "");
  if (!hasSession(token)) return res.status(401).json({ error: "Unauthorized" });
  // remove blockchain and election
  const dataDir = path.join(process.cwd(), "server", "data");
  try {
    const chainFile = path.join(dataDir, "blockchain.json");
    if (fs.existsSync(chainFile)) fs.unlinkSync(chainFile);
    clearElection();
    res.json({ cleared: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear data" });
  }
};
