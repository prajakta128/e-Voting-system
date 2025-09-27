import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, validateSession } from "./routes/admin";
import { createElection, getElection } from "./routes/election";
import { castVote } from "./routes/vote";
import { getResults } from "./routes/results";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/admin/login", login);
  app.get("/api/admin/session", validateSession);

  // Election
  app.post("/api/election", createElection);
  app.get("/api/election", getElection);

  // Voting
  app.post("/api/vote", castVote);

  // Results
  app.get("/api/results", getResults);

  // Dev admin utilities
  app.post("/api/admin/clear", require("./routes/admin").clearData);

  return app;
}
