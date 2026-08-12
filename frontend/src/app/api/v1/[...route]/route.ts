import { NextRequest } from 'next/server';
import worker from '../../../../backend-core/workers/index';

export const runtime = 'edge';

async function handleRequest(request: NextRequest) {
  const env = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  };
  
  // Create a standard Request object from NextRequest to match the worker signature
  const req = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // Note: NextRequest extends Request, so it's mostly compatible directly, 
    // but we ensure it matches the standard Web API Request exactly.
    duplex: 'half' // required for node streams if any
  } as RequestInit);

  // The Cloudflare worker expects an ExecutionContext (ctx) with a passThroughOnException method, 
  // but we don't strictly need it unless the worker calls ctx.waitUntil(). 
  // We'll pass a mock ctx to satisfy the typescript signature if needed, or cast it.
  const mockCtx = {} as any;

  return worker.fetch(request, env, mockCtx);
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request);
}
