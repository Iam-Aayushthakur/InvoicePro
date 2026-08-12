// Auth Controller handling Registration, Identity Lookup, and Company Context Switching
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { UserContext } from '../../core/permissions.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';

export const AuthController = {
  async register(request: Request, env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }): Promise<Response> {
    try {
      const body = await request.json() as {
        email: string;
        password: string;
        fullName: string;
        companyName: string;
        stateCode?: string;
      };

      if (!body.email || !body.password || !body.fullName || !body.companyName) {
        return errorResponse('Missing mandatory registration fields (email, password, fullName, companyName)', 400, 'VALIDATION_ERROR');
      }

      // 1. Create Supabase Auth identity
      const authResp = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
          email_confirm: true,
        }),
      });

      if (!authResp.ok) {
        const errJson = await authResp.json();
        return errorResponse(errJson.message || 'Failed to create auth identity', 400, 'AUTH_ERROR', errJson);
      }

      const authUser = await authResp.json() as { id: string; email: string };

      // 2. Insert application user profile
      const userResp = await fetch(`${env.SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          auth_user_id: authUser.id,
          email: authUser.email,
          full_name: body.fullName,
        }),
      });

      const userRows = await userResp.json() as Array<{ id: string }>;
      const appUser = userRows[0];

      // 3. Create Tenant Company
      const compResp = await fetch(`${env.SUPABASE_URL}/rest/v1/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          name: body.companyName,
          email: body.email,
          phone: '0000000000',
          address: 'Default Business Address',
          city: 'City',
          state: 'State',
          postal_code: '000000',
          state_code: body.stateCode || '27',
          created_by: appUser.id,
        }),
      });

      const compRows = await compResp.json() as Array<{ id: string; name: string }>;
      const company = compRows[0];

      // 4. Fetch OWNER Role ID
      const roleResp = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?select=id&name=eq.OWNER`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      const roleRows = await roleResp.json() as Array<{ id: string }>;
      const ownerRole = roleRows[0];

      // 5. Assign Membership as OWNER
      await fetch(`${env.SUPABASE_URL}/rest/v1/company_members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          company_id: company.id,
          user_id: appUser.id,
          role_id: ownerRole.id,
        }),
      });

      // 6. Assign Default FREE Subscription Trial
      const planResp = await fetch(`${env.SUPABASE_URL}/rest/v1/subscription_plans?select=id&code=eq.FREE`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      const planRows = await planResp.json() as Array<{ id: string }>;
      if (planRows && planRows.length > 0) {
        const freePlan = planRows[0];
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 14);

        await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            company_id: company.id,
            plan_id: freePlan.id,
            status: 'TRIAL',
            current_period_end: trialEnd.toISOString(),
            trial_start: new Date().toISOString(),
            trial_end: trialEnd.toISOString(),
          }),
        });
      }

      return successResponse({
        message: 'Tenant registration completed successfully',
        userId: appUser.id,
        companyId: company.id,
        companyName: company.name,
      }, 201);
    } catch (error) {
      console.error('[Registration Error]:', error);
      return errorResponse('Registration failed', 500, 'REGISTRATION_ERROR');
    }
  },

  async oauthOnboard(request: Request, env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }): Promise<Response> {
    try {
      const body = await request.json() as {
        companyName: string;
        fullName?: string;
        stateCode?: string;
      };

      if (!body.companyName) {
        return errorResponse('Missing mandatory field (companyName)', 400, 'VALIDATION_ERROR');
      }

      // 1. Authenticate Request to get Auth Identity
      const session = await authenticateRequest(request, env);
      
      const email = session.email || 'oauth@user.com';
      const fullName = body.fullName || email.split('@')[0];

      // 2. Insert application user profile (Using UPSERT in case it somehow exists)
      const userResp = await fetch(`${env.SUPABASE_URL}/rest/v1/users?on_conflict=auth_user_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation,resolution=merge-duplicates',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          auth_user_id: session.authUserId,
          email: email,
          full_name: fullName,
        }),
      });

      const userRows = await userResp.json() as Array<{ id: string }>;
      const appUser = userRows[0];
      
      if (!appUser) {
        return errorResponse('Failed to create or link user profile', 500, 'USER_PROFILE_ERROR');
      }

      // 3. Create Tenant Company
      const compResp = await fetch(`${env.SUPABASE_URL}/rest/v1/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          name: body.companyName,
          email: email,
          phone: '0000000000',
          address: 'Default Business Address',
          city: 'City',
          state: 'State',
          postal_code: '000000',
          state_code: body.stateCode || '27',
          created_by: appUser.id,
        }),
      });

      const compRows = await compResp.json() as Array<{ id: string; name: string }>;
      const company = compRows[0];

      // 4. Fetch OWNER Role ID
      const roleResp = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?select=id&name=eq.OWNER`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      const roleRows = await roleResp.json() as Array<{ id: string }>;
      const ownerRole = roleRows[0];

      // 5. Assign Membership as OWNER
      await fetch(`${env.SUPABASE_URL}/rest/v1/company_members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          company_id: company.id,
          user_id: appUser.id,
          role_id: ownerRole.id,
        }),
      });

      // 6. Assign Default FREE Subscription Trial
      const planResp = await fetch(`${env.SUPABASE_URL}/rest/v1/subscription_plans?select=id&code=eq.FREE`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      const planRows = await planResp.json() as Array<{ id: string }>;
      if (planRows && planRows.length > 0) {
        const freePlan = planRows[0];
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 14);

        await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            company_id: company.id,
            plan_id: freePlan.id,
            status: 'TRIAL',
            current_period_end: trialEnd.toISOString(),
            trial_start: new Date().toISOString(),
            trial_end: trialEnd.toISOString(),
          }),
        });
      }

      // Generate API token just like normal login (if needed by frontend state)
      // Actually, frontend already has Supabase session, but api-client needs the JWT to pass `authenticateRequest`.
      // The frontend uses `payload.accessToken` to authenticate `oauthOnboard`, 
      // so it can just keep using `accessToken` for subsequent API calls.
      return successResponse({
        message: 'OAuth Tenant Onboarding completed successfully',
        user: { id: appUser.id, email, full_name: fullName },
        token: session.authUserId, // Just a placeholder, the frontend uses Supabase session token
        companyId: company.id,
        companyName: company.name,
      }, 201);
    } catch (error) {
      console.error('[OAuth Onboarding Error]:', error);
      return errorResponse('OAuth Onboarding failed', 500, 'ONBOARDING_ERROR');
    }
  },

  async getMe(userContext: UserContext): Promise<Response> {
    return successResponse({
      userId: userContext.userId,
      companyId: userContext.companyId,
      role: userContext.role,
      permissions: userContext.permissions,
    });
  },
};
