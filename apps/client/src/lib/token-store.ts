/**
 * In-memory access token store.
 * Axios interceptor reads from here; Auth context writes to here.
 * Never persisted to localStorage/sessionStorage — intentionally volatile.
 */
let accessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (token: string | null): void => {
    accessToken = token;
  },
};
