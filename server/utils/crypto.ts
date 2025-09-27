import crypto from "node:crypto";

export function sha256(input: string | Buffer): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateAesKey(): Buffer {
  return crypto.randomBytes(32); // 256-bit key
}

export function encryptAESGCM(plainText: string, key: Buffer): { iv: string; ciphertext: string; authTag: string } {
  const iv = crypto.randomBytes(12); // recommended 96-bit IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    ciphertext: encrypted.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptAESGCM(
  payload: { iv: string; ciphertext: string; authTag: string },
  key: Buffer,
): string {
  const iv = Buffer.from(payload.iv, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
