// Shared Supabase REST API helper for all repositories
// Eliminates boilerplate across repository files.

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export function supabaseHeaders(env: Env, prefer = 'return=representation') {
  return {
    'Content-Type': 'application/json',
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    Prefer: prefer,
  };
}

export async function supabaseGet<T>(env: Env, table: string, query: string): Promise<T[]> {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: supabaseHeaders(env) });
  return r.ok ? (await r.json() as T[]) : [];
}

export async function supabaseGetOne<T>(env: Env, table: string, query: string): Promise<T | null> {
  const rows = await supabaseGet<T>(env, table, query);
  return rows[0] || null;
}

export async function supabaseInsert<T>(env: Env, table: string, data: Record<string, unknown>): Promise<T> {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: supabaseHeaders(env), body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`Insert ${table} failed: ${await r.text()}`);
  const rows = await r.json() as T[];
  return rows[0];
}

export async function supabasePatch<T>(env: Env, table: string, filter: string, data: Record<string, unknown>): Promise<T> {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH', headers: supabaseHeaders(env), body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`Patch ${table} failed: ${await r.text()}`);
  const rows = await r.json() as T[];
  return rows[0];
}

export async function supabaseCount(env: Env, table: string, filter: string): Promise<number> {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${filter}&select=id`, {
    method: 'HEAD', headers: { ...supabaseHeaders(env, 'count=exact') },
  });
  return parseInt(r.headers.get('content-range')?.split('/')[1] || '0', 10);
}

export async function supabaseList<T>(env: Env, table: string, query: string, page: number, limit: number): Promise<{ data: T[]; total: number }> {
  const offset = (page - 1) * limit;
  const total = await supabaseCount(env, table, query.split('&select=')[0]);
  const data = await supabaseGet<T>(env, table, `${query}&offset=${offset}&limit=${limit}`);
  return { data, total };
}
