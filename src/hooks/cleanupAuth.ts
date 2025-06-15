
/** 
 * Robustly clears all auth/session data from localStorage and sessionStorage.
 * Use this before login and before logout to prevent "limbo" state.
 */
export function cleanupAuthState() {
  // Clean supabase.auth.* and all sb-* keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
}
