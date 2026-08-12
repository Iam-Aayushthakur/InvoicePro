'use client';

import React, { useState } from 'react';
import { useProducts, Product } from '../../../hooks/api/useProducts';
import { useCategories } from '../../../hooks/api/useCategories';
import { ProductForm } from './ProductForm';
import { Plus, Search, Edit2, Box, Package, ArchiveRestore, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils/currency';


export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(page, 50);
  const { data: categoriesData } = useCategories();

  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  const getCategoryName = (id: string | null) => {
    if (!id) return '-';
    return categories.find(c => c.id === id)?.name || '-';
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products & Services</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your item catalog, pricing, and tax rates.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoadingProducts ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-sm text-slate-500 mb-6">Start building your catalog to use items in invoices.</p>
            <button onClick={handleAddNew} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Add your first product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Selling Price</th>
                  <th className="px-6 py-4 text-right">Tax Rate</th>
                  <th className="px-6 py-4 text-center">Inventory</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            {product.sku && <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">SKU: {product.sku}</span>}
                            <span>{product.unit}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {formatCurrency(product.selling_price)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      {product.tax_rate}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.track_inventory ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-700">
                          <ArchiveRestore className="w-3 h-3" /> Tracked
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Edit Product">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredProducts.length} of {productsData?.total || 0} products</span>
        </div>
      </div>

      <ProductForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
}
