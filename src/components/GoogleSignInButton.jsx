import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Google's official 4-colour "G".
 *
 * Google requires the unmodified logo on any "Sign in with Google" control, so
 * it is never recoloured or redrawn - only scaled.
 */
const GoogleMark = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/**
 * A fully custom "Continue with Google" button styled to match this app.
 *
 * Google's own embedded button renders inside a cross-origin iframe, so it
 * cannot be styled to fit the design. This uses Google's OAuth popup flow
 * instead, which returns an ACCESS token (not an ID token) - the server then
 * verifies that token against Google's userinfo endpoint. That keeps the flow
 * secure without requiring a client secret in this project.
 *
 * Renders nothing when no client ID is configured, so a missing env var never
 * leaves a dead control on the page.
 */
export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Tracked in state, not read from the ref during render: a ref fill does not
  // trigger a re-render, so the button would stay disabled forever.
  const [ready, setReady] = useState(false);
  const tokenClientRef = useRef(null);
  const watchdogRef = useRef(null);

  /**
   * Google's popup is a second window we do not control. If it is blocked,
   * closed without reporting, or simply never answers, nothing calls back and
   * the button would spin forever. This always stops the spinner and tells the
   * user what to do next.
   */
  const stopBusy = (message) => {
    clearTimeout(watchdogRef.current);
    watchdogRef.current = null;
    setBusy(false);
    if (message) setError(message);
  };

  useEffect(() => {
    if (!clientId) return undefined;

    const prepare = () => {
      if (!window.google?.accounts?.oauth2 || tokenClientRef.current) return;

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        // Reuses the access grant from a previous sign-in, so returning users
        // skip the consent screen entirely instead of re-approving every time.
        include_granted_scopes: true,
        callback: async (response) => {
          if (response?.error || !response?.access_token) {
            stopBusy('Google sign-in did not complete. Please try again.');
            return;
          }
          try {
            await onCredential(response.access_token);
          } finally {
            stopBusy('');
          }
        },
        error_callback: (err) => {
          const type = err?.type || '';
          if (type === 'popup_closed_by_user') {
            stopBusy('Google sign-in was cancelled.');
            return;
          }
          if (type === 'unknown' && /popup/i.test(err?.message || '')) {
            stopBusy(
              'The Google pop-up was blocked. Allow pop-ups for this site, then try again.'
            );
            return;
          }
          // Google reports a rejected app configuration (a missing or wrong
          // "Authorized JavaScript origin") through this same generic path, so
          // do not blame the visitor's connection for it. Name the real causes.
          stopBusy(
            'Google sign-in did not finish. This normally means the site address is not registered under Authorized JavaScript Origins in the Google Cloud Console, or the pop-up was blocked.'
          );
        }
      });

      setReady(true);
    };

    if (window.google?.accounts?.oauth2) {
      prepare();
      return undefined;
    }

    const existing = document.querySelector('script[data-gsi="true"]');
    if (existing) {
      existing.addEventListener('load', prepare);
      return () => existing.removeEventListener('load', prepare);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.gsi = 'true';
    script.onload = prepare;
    document.head.appendChild(script);

    return () => {
      clearTimeout(watchdogRef.current);
      script.removeEventListener('load', prepare);
    };
  }, [clientId, onCredential]);

  const handleClick = () => {
    if (busy || disabled || !tokenClientRef.current) return;
    setError('');
    setBusy(true);

    // Safety net: no matter what happens in that other window, this button
    // becomes usable again.
    clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      stopBusy(
        'Google is taking too long to respond. Close the Google window if it is open, then try again.'
      );
    }, 60000);

    try {
      // prompt: '' is the fast path - if the visitor already granted access and
      // has one Google account, Google returns the token immediately with no
      // consent screen and no account picker.
      tokenClientRef.current.requestAccessToken({ prompt: '' });
    } catch {
      // A blocked pop-up throws here. Report it instead of leaving the button
      // spinning, which is what made this look broken.
      stopBusy(
        'The Google sign-in window could not be opened. Allow pop-ups for this site and try again.'
      );
    }
  };

  if (!clientId) return null;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || disabled || !ready}
        aria-busy={busy}
        className="group relative flex w-full max-w-[340px] items-center justify-center gap-3 rounded-xl border border-white/12 bg-zinc-900/80 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-white/25 hover:bg-zinc-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0"
      >
        {/* Soft top sheen on hover, matching the rest of the app's buttons */}
        <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.07] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <span className="relative flex h-5 w-5 items-center justify-center">
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
          ) : (
            <GoogleMark />
          )}
        </span>

        <span className="relative tracking-tight">
          {busy ? 'Waiting for Google…' : 'Continue with Google'}
        </span>
      </button>

      {busy && (
        <p className="mt-2.5 text-center text-[11px] text-zinc-500">
          Finish signing in in the Google window that just opened.
        </p>
      )}

      {error && (
        <p className="mt-2.5 flex items-start gap-1.5 text-center text-xs text-red-400">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}