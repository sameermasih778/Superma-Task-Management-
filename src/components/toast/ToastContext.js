import { createContext, useContext } from 'react';

/**
 * Toast state lives in its own module (no JSX) so this file exports only a
 * context and a hook - which keeps React Fast Refresh working.
 *
 * Toasts and the bell dropdown are deliberately different things:
 *   - a toast is immediate, transient feedback about an action just taken
 *   - the bell is a durable inbox of messages waiting to be read
 * Replacing one with the other would lose messages users never saw.
 */
export const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
}