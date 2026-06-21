function isUsableEnvValue(value: string | undefined): value is string {
  const trimmed = value?.trim();
  return Boolean(trimmed && !trimmed.includes("replace-with"));
}

/** Local development fallback using a static read-write token. */
export function hasBlobReadWriteToken(): boolean {
  return isUsableEnvValue(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Vercel OIDC credentials available at runtime. */
export function hasBlobOidcRuntimeCredentials(): boolean {
  return (
    isUsableEnvValue(process.env.BLOB_STORE_ID) &&
    isUsableEnvValue(process.env.VERCEL_OIDC_TOKEN)
  );
}

/**
 * Linked Vercel Blob store on a Vercel deployment.
 * OIDC tokens are resolved automatically per request by the SDK.
 */
export function hasVercelLinkedBlobStore(): boolean {
  return process.env.VERCEL === "1" && isUsableEnvValue(process.env.BLOB_STORE_ID);
}

export function isBlobConfigured(): boolean {
  return (
    hasBlobReadWriteToken() ||
    hasBlobOidcRuntimeCredentials() ||
    hasVercelLinkedBlobStore()
  );
}
