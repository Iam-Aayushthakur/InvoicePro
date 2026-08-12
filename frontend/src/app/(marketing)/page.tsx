import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, BarChart3, Receipt, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">InvoicePro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Background decorative blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              The New Standard in GST Billing
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Manage your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">absolute precision.</span>
            </h1>
            <p className="mt-4 text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              A production-grade, multi-tenant platform built for modern enterprises. Effortless GST invoicing, real-time inventory, and authoritative financial analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all">
                View Live Demo
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">GST Compliance</h3>
              <p className="text-slate-600 leading-relaxed">
                Automated IGST, CGST, and SGST calculations. Generate beautiful, compliant invoices instantly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Live Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time dashboard tracking receivables, payables, and inventory valuation across your enterprise.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enterprise Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Strict tenant isolation, Granular RBAC, and immutable audit logs built on Cloudflare edge.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

