// Financials & Analytics Test Suite
import { validateCreatePayment } from '../../backend/src/core/validators/payment.validator';
import { validateReportParams } from '../../backend/src/core/validators/reporting.validator';

function testPaymentValidation() {
  console.log('\n=== PAYMENT VALIDATION TESTS ===\n');
  const valid = validateCreatePayment({ invoice_id: 'inv-1', amount: 500, payment_method: 'UPI' });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid payment accepted`);
  
  const invalidMethod = validateCreatePayment({ invoice_id: 'inv-1', amount: 500, payment_method: 'BITCOIN' });
  console.log(`[${!invalidMethod.success ? 'PASS' : 'FAIL'}] Invalid payment method rejected`);
  
  const invalidAmount = validateCreatePayment({ invoice_id: 'inv-1', amount: -10, payment_method: 'CASH' });
  console.log(`[${!invalidAmount.success ? 'PASS' : 'FAIL'}] Negative amount rejected`);
}

function testReportingValidation() {
  console.log('\n=== REPORTING VALIDATION TESTS ===\n');
  
  const params = new URLSearchParams();
  params.set('start_date', '2024-01-01');
  params.set('end_date', '2024-12-31');
  params.set('report_type', 'SALES');

  const valid = validateReportParams(params);
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid report params accepted`);
  
  params.set('report_type', 'INVALID_TYPE');
  const invalid = validateReportParams(params);
  console.log(`[${!invalid.success ? 'PASS' : 'FAIL'}] Invalid report type rejected`);
}

export function runFinancialsTests() {
  console.log('============================================================');
  console.log('  FINANCIALS & ANALYTICS TEST SUITE');
  console.log('============================================================');

  testPaymentValidation();
  testReportingValidation();

  console.log('\n============================================================');
  console.log('  FINANCIALS TESTS COMPLETE');
  console.log('============================================================\n');
}
