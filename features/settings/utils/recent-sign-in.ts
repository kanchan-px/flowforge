// How recently someone must have signed in to delete their account
// without a password.
export const RECENT_SIGN_IN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function isRecentSignIn(sessionCreatedAt: Date | string) {
  const signedInAt = new Date(sessionCreatedAt).getTime();

  return Date.now() - signedInAt < RECENT_SIGN_IN_WINDOW_MS;
}