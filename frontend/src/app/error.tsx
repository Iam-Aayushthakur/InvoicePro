'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Log error to Sentry or monitoring service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="rounded bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
