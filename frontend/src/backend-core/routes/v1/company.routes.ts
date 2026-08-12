// Company Routes — REST API /api/v1/companies/*
// Handles authentication, tenant resolution, and dispatching to CompanyController

import { CompanyController } from '../../controllers/company/index.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';
import { resolveTenantContext } from '../../middleware/tenant.middleware.js';
import { errorResponse } from '../../core/responses/index.js';
import { AppError } from '../../core/errors/index.js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export async function handleCompanyRoutes(
  request: Request,
  pathSegments: string[],
  env: Env
): Promise<Response> {
  try {
    // 1. Authenticate: Validate JWT
    const session = await authenticateRequest(request, env);

    // 2. Resolve tenant context from DB membership
    const requestedCompany = request.headers.get('x-company-id');
    const user = await resolveTenantContext(session.authUserId, requestedCompany, env);

    const method = request.method;
    const segment1 = pathSegments[0] || ''; // e.g. '', 'current', ':id'
    const segment2 = pathSegments[1] || ''; // e.g. '', 'members'

    // GET /api/v1/companies → List user's companies
    if (method === 'GET' && segment1 === '') {
      return CompanyController.listUserCompanies(user, env);
    }

    // GET /api/v1/companies/current → Current tenant company
    if (method === 'GET' && segment1 === 'current') {
      return CompanyController.getCurrent(user, env);
    }

    // GET /api/v1/companies/:id → Specific company
    if (method === 'GET' && segment1 && !segment2) {
      return CompanyController.getById(segment1, user, env);
    }

    // PATCH /api/v1/companies/:id → Update company
    if (method === 'PATCH' && segment1 && !segment2) {
      return CompanyController.update(request, segment1, user, env);
    }

    // DELETE /api/v1/companies/:id → Deactivate company
    if (method === 'DELETE' && segment1 && !segment2) {
      return CompanyController.deactivate(segment1, user, env);
    }

    // GET /api/v1/companies/:id/members → List company members
    if (method === 'GET' && segment1 && segment2 === 'members') {
      return CompanyController.listMembers(segment1, user, env);
    }

    return errorResponse('Company route not found', 404, 'NOT_FOUND');
  } catch (err) {
    if (err instanceof AppError) {
      return errorResponse(err.message, err.statusCode, err.code);
    }
    console.error('[CompanyRoutes Error]:', err);
    return errorResponse('Internal server error', 500, 'SERVER_ERROR');
  }
}
