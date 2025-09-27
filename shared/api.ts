/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface Candidate {
  id: string; // uuid string
  name: string;
  description?: string;
  logoDataUrl?: string; // base64 image data url or svg data url
}

export interface Election {
  id: string;
  title: string;
  startAt: number; // epoch ms
  endAt: number; // epoch ms
  totalVoters: number;
  candidates: Candidate[];
  // encryptionKey is server-only and never sent to clients
}

export interface EncryptedVotePayload {
  iv: string;
  ciphertext: string;
  authTag: string;
}

export interface VoteBlockData {
  voterHash: string; // sha256 of voter id
  encryptedVote: EncryptedVotePayload; // AES-256-GCM of candidateId
}

export interface CreateElectionRequest {
  title: string;
  startAt: number;
  endAt: number;
  totalVoters: number;
  candidates: { name: string; description?: string; logoDataUrl?: string }[];
}

export interface CreateElectionResponse {
  election: Election;
}

export interface GetElectionResponse {
  election: Election | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface VoteRequest {
  voterHash: string;
  candidateId: string;
}

export interface VoteResponse {
  success: boolean;
}

export interface ResultsResponse {
  available: boolean;
  election?: Election;
  totalVotes?: number;
  turnoutPercent?: number; // 0-100
  byCandidate?: { candidateId: string; name: string; logoDataUrl?: string; votes: number }[];
  perPerson?: { voterHash: string; candidateId: string; candidateName: string }[];
  winner?: { candidateId: string; name: string; percent: number; votes: number } | null;
}
