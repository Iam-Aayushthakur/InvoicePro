import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link
        href="/dashboard"
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
