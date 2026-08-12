// Core Transactions Test Suite (Inventory, Purchases, Quotations, Invoices)
import { validateRecordTransaction } from '../../backend/src/core/validators/inventory.validator';
import { validateCreatePurchase } from '../../backend/src/core/validators/purchase.validator';
import { validateCreateQuotation } from '../../backend/src/core/validators/quotation.validator';
import { validateCreateInvoice } from '../../backend/src/core/validators/invoice.validator';

function testInventoryValidation() {
  console.log('\n=== INVENTORY VALIDATION TESTS ===\n');
  const valid = validateRecordTransaction({ product_id: 'prod-1', transaction_type: 'ADJUSTMENT', quantity: 10 });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid inventory adjustment accepted`);
  
  const invalidTx = validateRecordTransaction({ product_id: 'prod-1', transaction_type: 'MAGIC', quantity: 10 });
  console.log(`[${!invalidTx.success ? 'PASS' : 'FAIL'}] Invalid transaction type rejected`);
  
  const invalidQty = validateRecordTransaction({ product_id: 'prod-1', transaction_type: 'ADJUSTMENT', quantity: 0 });
  console.log(`[${!invalidQty.success ? 'PASS' : 'FAIL'}] Zero quantity rejected`);
}

function testPurchaseValidation() {
  console.log('\n=== PURCHASE VALIDATION TESTS ===\n');
  const valid = validateCreatePurchase({ supplier_id: 'sup-1', purchase_number: 'PO-001', items: [{ product_id: 'prod-1', quantity: 5, unit_price: 100 }] });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid purchase order accepted`);
  
  const emptyItems = validateCreatePurchase({ supplier_id: 'sup-1', purchase_number: 'PO-001', items: [] });
  console.log(`[${!emptyItems.success ? 'PASS' : 'FAIL'}] Purchase order with empty items rejected`);
}

function testQuotationValidation() {
  console.log('\n=== QUOTATION VALIDATION TESTS ===\n');
  const valid = validateCreateQuotation({ customer_id: 'cust-1', quotation_number: 'QT-001', items: [{ product_id: 'prod-1', quantity: 1, unit_price: 500 }] });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid quotation accepted`);
}

function testInvoiceValidation() {
  console.log('\n=== INVOICE VALIDATION TESTS ===\n');
  const valid = validateCreateInvoice({ customer_id: 'cust-1', invoice_number: 'INV-001', due_date: '2025-01-01', items: [{ product_id: 'prod-1', quantity: 2, unit_price: 100 }] });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid invoice accepted`);
  
  const invalidPrice = validateCreateInvoice({ customer_id: 'cust-1', invoice_number: 'INV-001', due_date: '2025-01-01', items: [{ product_id: 'prod-1', quantity: 2, unit_price: -10 }] });
  console.log(`[${!invalidPrice.success ? 'PASS' : 'FAIL'}] Invoice with negative unit price rejected`);
}

export function runTransactionTests() {
  console.log('============================================================');
  console.log('  CORE TRANSACTIONS TEST SUITE');
  console.log('============================================================');

  testInventoryValidation();
  testPurchaseValidation();
  testQuotationValidation();
  testInvoiceValidation();

  console.log('\n============================================================');
  console.log('  CORE TRANSACTIONS TESTS COMPLETE');
  console.log('============================================================\n');
}
