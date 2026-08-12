// Master Data Service Test Suite (Customer, Supplier, Category, Product)
import { validateCreateCustomer } from '../../backend/src/core/validators/customer.validator';
import { validateCreateSupplier } from '../../backend/src/core/validators/supplier.validator';
import { validateCreateCategory } from '../../backend/src/core/validators/category.validator';
import { validateCreateProduct } from '../../backend/src/core/validators/product.validator';

function testCustomerValidation() {
  console.log('\n=== CUSTOMER VALIDATION TESTS ===\n');
  const valid = validateCreateCustomer({ name: 'Cust A', billing_address: '123 St', gstin: '27AABCU9603R1ZM', pan: 'AABCU9603R', email: 'cust@a.com' });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid customer accepted`);
  const invalid = validateCreateCustomer({ name: 'A' });
  console.log(`[${!invalid.success ? 'PASS' : 'FAIL'}] Invalid customer rejected`);
}

function testSupplierValidation() {
  console.log('\n=== SUPPLIER VALIDATION TESTS ===\n');
  const valid = validateCreateSupplier({ name: 'Supp A', address: '456 Ave' });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid supplier accepted`);
}

function testCategoryValidation() {
  console.log('\n=== CATEGORY VALIDATION TESTS ===\n');
  const valid = validateCreateCategory({ name: 'Electronics' });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid category accepted`);
}

function testProductValidation() {
  console.log('\n=== PRODUCT VALIDATION TESTS ===\n');
  const valid = validateCreateProduct({ name: 'Laptop', sku: 'LAP-01', unit: 'PCS', tax_rate: 18 });
  console.log(`[${valid.success ? 'PASS' : 'FAIL'}] Valid product accepted`);
  
  const invalidUnit = validateCreateProduct({ name: 'Laptop', sku: 'LAP-01', unit: 'INVALID' });
  console.log(`[${!invalidUnit.success ? 'PASS' : 'FAIL'}] Invalid unit rejected`);
  
  const invalidTax = validateCreateProduct({ name: 'Laptop', sku: 'LAP-01', tax_rate: 99 });
  console.log(`[${!invalidTax.success ? 'PASS' : 'FAIL'}] Invalid tax_rate rejected`);
}

export function runMasterDataTests() {
  console.log('============================================================');
  console.log('  MASTER DATA SERVICES TEST SUITE');
  console.log('============================================================');

  testCustomerValidation();
  testSupplierValidation();
  testCategoryValidation();
  testProductValidation();

  console.log('\n============================================================');
  console.log('  MASTER DATA TESTS COMPLETE');
  console.log('============================================================\n');
}
