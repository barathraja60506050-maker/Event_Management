import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-5">
          <h1 className="font-display font-bold text-2xl mb-2">Something went wrong</h1>
          <p className="text-ink-muted mb-6">Try reloading the page. If this keeps happening, let us know.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full font-semibold gradient-btn"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
