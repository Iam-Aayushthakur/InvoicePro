// Role Service Test Suite
import { validateAssignPermissions } from '../../backend/src/core/validators/role.validator';
import { can, UserContext } from '../../backend/src/core/permissions';

function testRoleValidation() {
  console.log('\n=== ROLE & PERMISSION VALIDATION TESTS ===\n');

  const r1 = validateAssignPermissions({ permission_ids: ['uuid-1', 'uuid-2'] });
  console.log(`[${r1.success ? 'PASS' : 'FAIL'}] Valid permission assignment accepted`);

  const r2 = validateAssignPermissions({});
  console.log(`[${!r2.success ? 'PASS' : 'FAIL'}] Missing permission_ids rejected`);

  const r3 = validateAssignPermissions({ permission_ids: 'uuid-1' });
  console.log(`[${!r3.success ? 'PASS' : 'FAIL'}] Non-array permission_ids rejected`);
  
  const r4 = validateAssignPermissions({ permission_ids: ['uuid-1', 123] });
  console.log(`[${!r4.success ? 'PASS' : 'FAIL'}] Array with non-string elements rejected`);
}

function testRoleAuthorization() {
  console.log('\n=== ROLE AUTHORIZATION TESTS ===\n');

  const ownerUser: UserContext = {
    userId: 'user-owner', companyId: 'company-a', role: 'OWNER',
    permissions: ['settings.update'],
  };
  
  const adminUser: UserContext = {
    userId: 'user-admin', companyId: 'company-a', role: 'ADMIN',
    permissions: [],
  };

  console.log(`[${can(ownerUser, 'settings.update') ? 'PASS' : 'FAIL'}] OWNER can update settings (permissions)`);
  console.log(`[${!can(adminUser, 'settings.update') ? 'PASS' : 'FAIL'}] ADMIN cannot update settings (permissions)`);
}

export function runRoleTests() {
  console.log('============================================================');
  console.log('  ROLE & PERMISSION SERVICE TEST SUITE');
  console.log('============================================================');

  testRoleValidation();
  testRoleAuthorization();

  console.log('\n============================================================');
  console.log('  ROLE & PERMISSION SERVICE TESTS COMPLETE');
  console.log('============================================================\n');
}
