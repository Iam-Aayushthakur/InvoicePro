// Platform & Admin Test Suite
import { validateCreateNotification } from '../../backend/src/core/validators/notification.validator';

function testNotificationValidation() {
  console.log('\n=== NOTIFICATION VALIDATION TESTS ===\n');
  const valid = validateCreateNotification({ type: 'SYSTEM', title: 'Welcome', message: 'Hello!' });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid notification accepted`);
  
  const invalidType = validateCreateNotification({ type: 'RANDOM', title: 'Hi', message: 'Hello' });
  console.log(`[${!invalidType.success ? 'PASS' : 'FAIL'}] Invalid type rejected`);
}

export function runPlatformTests() {
  console.log('============================================================');
  console.log('  PLATFORM & ADMIN TEST SUITE');
  console.log('============================================================');

  testNotificationValidation();

  console.log('\n============================================================');
  console.log('  PLATFORM TESTS COMPLETE');
  console.log('============================================================\n');
}
