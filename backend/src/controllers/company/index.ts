// Company Controller — Request/Response handler for company endpoints
// Validates input, delegates to CompanyService, and formats responses.

import { CompanyService } from '../../services/company.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateUpdateCompany } from '../../core/validators/company.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const CompanyController = {
  /**
   * GET /api/v1/companies/current
   * Returns the authenticated user's current tenant company profile.
   */
  async getCurrent(user: UserContext, env: Env): Promise<Response> {
    try {
      const company = await CompanyService.getCurrentCompany(user, env);
      return successResponse({ company });
    } catch (err) {
      return handleControllerError(err);
    }
  },

  /**
   * GET /api/v1/companies/:id
   * Returns a specific company by ID (must be the user's own tenant).
   */
  async getById(companyId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const company = await CompanyService.getCompany(companyId, user, env);
      return successResponse({ company });
    } catch (err) {
      return handleControllerError(err);
    }
  },

  /**
   * PATCH /api/v1/companies/:id
   * Updates the tenant company profile.
   */
  async update(request: Request, companyId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const validation = validateUpdateCompany(body);
      if (!validation.success) {
        return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', validation.errors);
      }
      const company = await CompanyService.updateCompany(companyId, validation.data!, user, env);
      return successResponse({ company });
    } catch (err) {
      return handleControllerError(err);
    }
  },

  /**
   * GET /api/v1/companies
   * Lists all companies the authenticated user has membership in.
   */
  async listUserCompanies(user: UserContext, env: Env): Promise<Response> {
    try {
      const companies = await CompanyService.listUserCompanies(user, env);
      return successResponse({ companies, total: companies.length });
    } catch (err) {
      return handleControllerError(err);
    }
  },

  /**
   * GET /api/v1/companies/:id/members
   * Lists all active members of a specific tenant company.
   */
  async listMembers(companyId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const members = await CompanyService.listCompanyMembers(companyId, user, env);
      return successResponse({ members, total: members.length });
    } catch (err) {
      return handleControllerError(err);
    }
  },

  /**
   * DELETE /api/v1/companies/:id
   * Deactivates (soft-deletes) a tenant company. OWNER only.
   */
  async deactivate(companyId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const company = await CompanyService.deactivateCompany(companyId, user, env);
      return successResponse({ company, message: 'Company deactivated successfully' });
    } catch (err) {
      return handleControllerError(err);
    }
  },
};

/**
 * Centralized controller error formatter.
 * Maps AppError subclasses to proper HTTP status codes.
 */
function handleControllerError(err: unknown): Response {
  if (err instanceof AppError) {
    return errorResponse(err.message, err.statusCode, err.code, err.details);
  }
  console.error('[CompanyController Error]:', err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  return errorResponse(message, 500, 'SERVER_ERROR');
}
