import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Suprema ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    // Clear in-memory caches and reload
    try {
      sessionStorage.removeItem('suprema_active_ws_id');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 selection:bg-white selection:text-black">
          <div className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Dashboard Interface Recovered
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An unexpected interface state occurred. We have prevented a blank screen and safely recovered the application state.
              </p>
              {this.state.error?.message && (
                <p className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 break-all mt-3">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Dashboard</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 border border-white/10 text-white text-xs font-semibold rounded-xl hover:bg-zinc-850 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-zinc-400" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
