// Frontend GST calculation — mirrors backend/src/services/gst.service.ts
// Used for live invoice/quotation/purchase total previews

export interface LineTaxInput {
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  is_inter_state: boolean;
}

export interface LineTaxResult {
  taxable_amount: number;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  tax_amount: number;
  line_total: number;
}

export interface DocumentTotals {
  subtotal: number;
  discount_total: number;
  taxable_amount: number;
  cgst_total: number;
  sgst_total: number;
  igst_total: number;
  tax_total: number;
  round_off: number;
  grand_total: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateLineTax(input: LineTaxInput): LineTaxResult {
  const lineSubtotal = input.quantity * input.unit_price;
  const taxable_amount = Math.max(0, lineSubtotal - input.discount);

  let cgst_rate = 0, sgst_rate = 0, igst_rate = 0;
  let cgst_amount = 0, sgst_amount = 0, igst_amount = 0;

  if (input.is_inter_state) {
    igst_rate = input.tax_rate;
    igst_amount = round2(taxable_amount * igst_rate / 100);
  } else {
    cgst_rate = input.tax_rate / 2;
    sgst_rate = input.tax_rate / 2;
    cgst_amount = round2(taxable_amount * cgst_rate / 100);
    sgst_amount = round2(taxable_amount * sgst_rate / 100);
  }

  const tax_amount = cgst_amount + sgst_amount + igst_amount;
  const line_total = round2(taxable_amount + tax_amount);

  return {
    taxable_amount: round2(taxable_amount),
    cgst_rate, sgst_rate, igst_rate,
    cgst_amount, sgst_amount, igst_amount,
    tax_amount: round2(tax_amount),
    line_total,
  };
}

export function calculateDocumentTotals(lines: LineTaxResult[]): DocumentTotals {
  let taxable_amount = 0;
  let cgst_total = 0, sgst_total = 0, igst_total = 0, tax_total = 0;

  for (const line of lines) {
    taxable_amount += line.taxable_amount;
    cgst_total += line.cgst_amount;
    sgst_total += line.sgst_amount;
    igst_total += line.igst_amount;
    tax_total += line.tax_amount;
  }

  const rawGrand = taxable_amount + tax_total;
  const grand_total = Math.round(rawGrand);
  const round_off = round2(grand_total - rawGrand);

  return {
    subtotal: round2(taxable_amount),
    discount_total: 0,
    taxable_amount: round2(taxable_amount),
    cgst_total: round2(cgst_total),
    sgst_total: round2(sgst_total),
    igst_total: round2(igst_total),
    tax_total: round2(tax_total),
    round_off,
    grand_total,
  };
}
