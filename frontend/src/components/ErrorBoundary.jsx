import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EduPath UI ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('edupath_token');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Something encountered an issue</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {this.state.error?.message || "An unexpected error occurred during rendering."}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
