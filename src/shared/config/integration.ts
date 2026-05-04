function normalizeUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function getConfiguredRemoteSystemOrigin(): string | undefined {
  const value = process.env.REMOTE_SYSTEM_ORIGIN;

  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? normalizeUrl(trimmed) : undefined;
}

export function resolveRemoteSystemOrigin(): string {
  return getConfiguredRemoteSystemOrigin() ?? normalizeUrl(window.location.origin);
}

export function resolveIntegrationBaseUrl(): string {
  return `${resolveRemoteSystemOrigin()}/Integration/odata`;
}

export function resolveIntegrationMetadataUrl(): string {
  return `${resolveIntegrationBaseUrl()}/$metadata`;
}
