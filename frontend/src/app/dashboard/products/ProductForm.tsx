import React, { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct, Product } from '../../../hooks/api/useProducts';
import { useCategories } from '../../../hooks/api/useCategories';
import { X, Save } from 'lucide-react';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductForm({ isOpen, onClose, product }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categoriesData } = useCategories();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    sku: string;
    barcode: string;
    category_id: string;
    unit: string;
    purchase_price: number;
    selling_price: number;
    tax_rate: number;
    hsn_sac: string;
    track_inventory: boolean;
    minimum_stock: number;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category_id: '',
    unit: 'pcs',
    purchase_price: 0,
    selling_price: 0,
    tax_rate: 0,
    hsn_sac: '',
    track_inventory: true,
    minimum_stock: 0,
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category_id: product.category_id || '',
        unit: product.unit,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        tax_rate: product.tax_rate,
        hsn_sac: product.hsn_sac || '',
        track_inventory: product.track_inventory,
        minimum_stock: product.minimum_stock,
        status: product.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        sku: '',
        barcode: '',
        category_id: '',
        unit: 'pcs',
        purchase_price: 0,
        selling_price: 0,
        tax_rate: 18,
        hsn_sac: '',
        track_inventory: true,
        minimum_stock: 10,
        status: 'ACTIVE',
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') parsedValue = Number(value);
    if (type === 'checkbox') parsedValue = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert empty strings to null/undefined where appropriate
    const payload = {
      ...formData,
      category_id: formData.category_id || undefined,
      sku: formData.sku || undefined,
      barcode: formData.barcode || undefined,
      hsn_sac: formData.hsn_sac || undefined,
      description: formData.description || undefined,
    };

    if (product) {
      updateProduct.mutate(
        { id: product.id, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createProduct.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  if (!isOpen) return null;

  const isPending = createProduct.isPending || updateProduct.isPending;
  const categories = categoriesData?.categories || [];

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Product Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g. Wireless Mouse" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">SKU</label>
                <input name="sku" value={formData.sku} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g. WM-001" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Tax */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Pricing & Tax</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Purchase Price</label>
                <input type="number" step="0.01" min="0" required name="purchase_price" value={formData.purchase_price} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Selling Price</label>
                <input type="number" step="0.01" min="0" required name="selling_price" value={formData.selling_price} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tax Rate (%)</label>
                <input type="number" step="0.01" min="0" required name="tax_rate" value={formData.tax_rate} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">HSN/SAC Code</label>
                <input name="hsn_sac" value={formData.hsn_sac} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Inventory Control</h3>
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" id="track_inventory" name="track_inventory" checked={formData.track_inventory} onChange={handleChange} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600" />
              <label htmlFor="track_inventory" className="text-sm font-medium text-slate-700">Track inventory for this product</label>
            </div>
            
            {formData.track_inventory && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Unit of Measure</label>
                  <select name="unit" value={formData.unit} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ltr">Liters (ltr)</option>
                    <option value="box">Box</option>
                    <option value="m">Meters (m)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Minimum Stock</label>
                  <input type="number" min="0" name="minimum_stock" value={formData.minimum_stock} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  <p className="text-xs text-slate-500">Alert when stock falls below this.</p>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
          <button onClick={onClose} type="button" className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button disabled={isPending} onClick={handleSubmit} className="flex-[2] flex items-center justify-center gap-2 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </>
  );
}
