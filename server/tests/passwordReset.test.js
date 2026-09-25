import { describe, expect, it } from "vitest";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
  isValidNewPassword,
  isValidPasswordResetToken,
} from "../utils/passwordReset.js";

describe("password reset tokens", () => {
  it("generates a random token and stores only its hash with a 30-minute expiry", () => {
    const now = 1_700_000_000_000;
    const reset = createPasswordResetToken(now);

    expect(reset.token).toMatch(/^[a-f0-9]{64}$/);
    expect(reset.tokenHash).toBe(hashPasswordResetToken(reset.token));
    expect(reset.tokenHash).not.toBe(reset.token);
    expect(reset.expiresAt.getTime()).toBe(now + 30 * 60 * 1000);
  });

  it("accepts only the matching token before its expiry", () => {
    const reset = createPasswordResetToken(1_700_000_000_000);

    expect(
      isValidPasswordResetToken(
        reset.tokenHash,
        reset.expiresAt,
        reset.token,
        reset.expiresAt.getTime() - 1
      )
    ).toBe(true);
    expect(
      isValidPasswordResetToken(
        reset.tokenHash,
        reset.expiresAt,
        "wrong-token",
        reset.expiresAt.getTime() - 1
      )
    ).toBe(false);
    expect(
      isValidPasswordResetToken(
        reset.tokenHash,
        reset.expiresAt,
        reset.token,
        reset.expiresAt.getTime()
      )
    ).toBe(false);
  });

  it("requires a new password to be 8–128 characters", () => {
    expect(isValidNewPassword("validPass123")).toBe(true);
    expect(isValidNewPassword("short")).toBe(false);
    expect(isValidNewPassword("a".repeat(129))).toBe(false);
    expect(isValidNewPassword(undefined)).toBe(false);
  });
});