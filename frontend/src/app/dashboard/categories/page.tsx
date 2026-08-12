'use client';

import React, { useState, useMemo } from 'react';
import { useCategories, useDeleteCategory, Category } from '../../../hooks/api/useCategories';
import { CategoryForm } from './CategoryForm';
import { Plus, Search, Edit2, Trash2, Tags, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = data?.categories || [];

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id);
    }
  };

  // Build hierarchy strings for display
  const enrichedCategories = useMemo(() => {
    return categories.map(cat => {
      let path = cat.name;
      let currentParentId = cat.parent_id;
      
      // Traverse up to build path (e.g. Electronics > Mobile Phones)
      // Limit to 3 levels deep to prevent infinite loops from bad data
      let depth = 0;
      while (currentParentId && depth < 3) {
        const parent = categories.find(p => p.id === currentParentId);
        if (parent) {
          path = `${parent.name} > ${path}`;
          currentParentId = parent.parent_id;
        } else {
          break;
        }
        depth++;
      }
      return { ...cat, path };
    }).filter(c => c.path.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.path.localeCompare(b.path));
  }, [categories, search]);

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Organize your products and inventory.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading categories...</div>
        ) : enrichedCategories.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tags className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No categories found</h3>
            <p className="text-sm text-slate-500 mb-6">Create categories to keep your inventory organized.</p>
            <button onClick={handleAddNew} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Add first category</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Category Path</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrichedCategories.map((category) => {
                  const segments = category.path.split(' > ');
                  return (
                    <tr key={category.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          {segments.map((segment, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                              <span className={idx === segments.length - 1 ? 'text-indigo-600 font-semibold' : 'text-slate-500'}>
                                {segment}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {category.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(category)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Category">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Category">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        category={selectedCategory}
        categories={categories}
      />
    </div>
  );
}
