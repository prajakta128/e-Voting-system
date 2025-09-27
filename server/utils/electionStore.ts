import fs from "node:fs";
import path from "node:path";
import { generateAesKey } from "./crypto";
import { type Election, type Candidate } from "@shared/api";
import crypto from "node:crypto";

const FILE_PATH = path.join(process.cwd(), "server", "data", "election.json");

export type InternalElection = Election & { encryptionKeyBase64: string };

function ensureFile() {
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, "null", "utf8");
}

export function saveElection(e: Omit<InternalElection, "id"> & { id?: string }): InternalElection {
  ensureFile();
  const withId: InternalElection = {
    id: e.id ?? crypto.randomUUID(),
    title: e.title,
    startAt: e.startAt,
    endAt: e.endAt,
    totalVoters: e.totalVoters,
    candidates: e.candidates as Candidate[],
    encryptionKeyBase64: e.encryptionKeyBase64 ?? generateAesKey().toString("base64"),
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(withId, null, 2), "utf8");
  return withId;
}

export function loadElection(): InternalElection | null {
  ensureFile();
  const raw = fs.readFileSync(FILE_PATH, "utf8");
  if (!raw || raw === "null") return null;
  return JSON.parse(raw) as InternalElection;
}

export function clearElection() {
  ensureFile();
  fs.writeFileSync(FILE_PATH, "null", "utf8");
}
