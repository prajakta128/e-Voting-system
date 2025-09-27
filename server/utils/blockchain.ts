import fs from "node:fs";
import path from "node:path";
import { sha256 } from "./crypto";

export type Block<T = any> = {
  index: number;
  timestamp: number;
  prevHash: string;
  data: T;
  hash: string;
};

export class Blockchain<T = any> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureInit();
  }

  private ensureInit() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      const genesis: Block<T>[] = [];
      fs.writeFileSync(this.filePath, JSON.stringify(genesis, null, 2), "utf8");
    }
  }

  private readChain(): Block<T>[] {
    const raw = fs.readFileSync(this.filePath, "utf8");
    return JSON.parse(raw);
  }

  private writeChain(chain: Block<T>[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(chain, null, 2), "utf8");
  }

  getAll(): Block<T>[] {
    return this.readChain();
  }

  getLast(): Block<T> | null {
    const chain = this.readChain();
    if (chain.length === 0) return null;
    return chain[chain.length - 1];
  }

  append(data: T): Block<T> {
    const chain = this.readChain();
    const last = chain[chain.length - 1] ?? null;
    const index = last ? last.index + 1 : 0;
    const timestamp = Date.now();
    const prevHash = last ? last.hash : "";
    const payload = JSON.stringify(data);
    const hash = sha256(index + prevHash + timestamp + payload);
    const block: Block<T> = { index, timestamp, prevHash, data, hash };
    chain.push(block);
    this.writeChain(chain);
    return block;
  }
}
