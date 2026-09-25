import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const RESET_TOKEN_LIFETIME_MS = 30 * 60 * 1000;

export const hashPasswordResetToken = (token) =>
  createHash("sha256").update(token).digest("hex");

export const createPasswordResetToken = (now = Date.now()) => {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashPasswordResetToken(token),
    expiresAt: new Date(now + RESET_TOKEN_LIFETIME_MS),
  };
};

export const isValidPasswordResetToken = (storedHash, storedExpiry, token, now = Date.now()) => {
  if (
    typeof storedHash !== "string" ||
    typeof token !== "string" ||
    !storedExpiry ||
    new Date(storedExpiry).getTime() <= now
  ) {
    return false;
  }

  const expected = Buffer.from(storedHash, "hex");
  const actual = Buffer.from(hashPasswordResetToken(token), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

export const isValidNewPassword = (password) =>
  typeof password === "string" && password.length >= 8 && password.length <= 128;