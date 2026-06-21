import { afterEach, describe, expect, it, vi } from "vitest";

describe("blob availability", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  async function loadAvailability() {
    return import("@/lib/blob/availability");
  }

  it("detects a local read-write token", async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test";
    delete process.env.BLOB_STORE_ID;
    delete process.env.VERCEL_OIDC_TOKEN;
    delete process.env.VERCEL;

    const { isBlobConfigured } = await loadAvailability();
    expect(isBlobConfigured()).toBe(true);
  });

  it("detects OIDC runtime credentials", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BLOB_STORE_ID = "store_123";
    process.env.VERCEL_OIDC_TOKEN = "oidc-token";

    const { isBlobConfigured } = await loadAvailability();
    expect(isBlobConfigured()).toBe(true);
  });

  it("detects a linked Vercel Blob store without a static token", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.VERCEL_OIDC_TOKEN;
    process.env.BLOB_STORE_ID = "store_123";
    process.env.VERCEL = "1";

    const { isBlobConfigured } = await loadAvailability();
    expect(isBlobConfigured()).toBe(true);
  });

  it("returns false when no blob credentials are configured", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BLOB_STORE_ID;
    delete process.env.VERCEL_OIDC_TOKEN;
    delete process.env.VERCEL;

    const { isBlobConfigured } = await loadAvailability();
    expect(isBlobConfigured()).toBe(false);
  });
});
