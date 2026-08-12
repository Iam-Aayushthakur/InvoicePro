import React, { useState, useEffect } from 'react';
import { useCreateCategory, useUpdateCategory, Category } from '../../../hooks/api/useCategories';
import { X } from 'lucide-react';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  categories: Category[];
}

export function CategoryForm({ isOpen, onClose, category, categories }: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        parent_id: '',
      });
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      parent_id: formData.parent_id || undefined,
    };

    if (category) {
      updateCategory.mutate(
        { id: category.id, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createCategory.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  if (!isOpen) return null;

  const isPending = createCategory.isPending || updateCategory.isPending;

  // Filter out the current category and its children to prevent circular nesting
  const validParents = categories.filter(c => c.id !== category?.id);

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{category ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category Name *</label>
            <input required name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g. Electronics" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="flex min-h-[100px] w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none resize-none" placeholder="Optional category description..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Parent Category</label>
            <select name="parent_id" value={formData.parent_id} onChange={e => setFormData({ ...formData, parent_id: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="">None (Top Level)</option>
              {validParents.map(parent => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
              ))}
            </select>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button disabled={isPending} onClick={handleSubmit} className="flex-1 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </>
  );
}
