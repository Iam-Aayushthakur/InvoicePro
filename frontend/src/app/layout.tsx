import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InvoicePro | Business Management & GST Invoicing SaaS',
  description: 'Multi-tenant SaaS for managing invoices, inventory, sales, purchases, and GST reporting.',
};

import { Providers } from '../components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
