// Company Service — Business logic layer for company operations
// Orchestrates repository calls, enforces authorization, and triggers audit logging.

import { CompanyRepository, Env } from '../repositories/company.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { ForbiddenError } from '../core/errors/index.js';
import type { Company, CreateCompanyInput, UpdateCompanyInput, CompanyMember } from '../core/types/company.types.js';

export const CompanyService = {
  /**
   * Get the current tenant company profile for the authenticated user.
   * Permission: company.read (implicit for any tenant member)
   */
  async getCurrentCompany(user: UserContext, env: Env): Promise<Company> {
    // Any authenticated tenant member can view their own company
    return CompanyRepository.findByIdOrThrow(user.companyId, env);
  },

  /**
   * Get a specific company by ID.
   * The tenant middleware already ensures user belongs to this company.
   */
  async getCompany(companyId: string, user: UserContext, env: Env): Promise<Company> {
    // Ensure requesting their own tenant company
    if (companyId !== user.companyId) {
      throw new ForbiddenError('Cannot access a company you are not a member of');
    }
    return CompanyRepository.findByIdOrThrow(companyId, env);
  },

  /**
   * Update the current tenant company profile.
   * Permission: company.update (OWNER or ADMIN)
   */
  async updateCompany(
    companyId: string,
    data: UpdateCompanyInput,
    user: UserContext,
    env: Env
  ): Promise<Company> {
    if (companyId !== user.companyId) {
      throw new ForbiddenError('Cannot update a company you are not a member of');
    }
    assertPermission(user, 'company.update');

    return CompanyRepository.update(companyId, { ...data, updated_by: user.userId }, env);
  },

  /**
   * List all companies the authenticated user has membership in.
   * Useful for multi-company workspace switcher.
   */
  async listUserCompanies(user: UserContext, env: Env): Promise<Company[]> {
    return CompanyRepository.listByUser(user.userId, env);
  },

  /**
   * List all active members of the current tenant company.
   * Permission: users.read
   */
  async listCompanyMembers(companyId: string, user: UserContext, env: Env): Promise<CompanyMember[]> {
    if (companyId !== user.companyId) {
      throw new ForbiddenError('Cannot view members of a company you are not a member of');
    }
    assertPermission(user, 'users.read');

    return CompanyRepository.listMembers(companyId, env);
  },

  /**
   * Deactivate (soft-delete) a company.
   * Permission: OWNER only.
   */
  async deactivateCompany(companyId: string, user: UserContext, env: Env): Promise<Company> {
    if (companyId !== user.companyId) {
      throw new ForbiddenError('Cannot deactivate a company you are not a member of');
    }
    if (user.role !== 'OWNER') {
      throw new ForbiddenError('Only the company OWNER can deactivate the company');
    }
    return CompanyRepository.deactivate(companyId, user.userId, env);
  },
};
