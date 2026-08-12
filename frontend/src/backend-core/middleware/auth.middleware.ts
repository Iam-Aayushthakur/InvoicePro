// Supabase Auth JWT validation middleware for Cloudflare Workers
import { UnauthorizedError } from '../core/errors/index.js';

export interface AuthSession {
  authUserId: string;
  email: string;
}

export async function authenticateRequest(request: Request, env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }): Promise<AuthSession> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization Bearer header');
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UnauthorizedError('Empty Bearer authentication token');
  }

  try {
    // Validate JWT token with Supabase Auth API
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }

    const userData = await response.json() as { id: string; email: string };
    return {
      authUserId: userData.id,
      email: userData.email,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Authentication verification failed');
  }
}
