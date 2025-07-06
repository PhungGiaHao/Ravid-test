import { create } from 'zustand';
import { storage } from '@/utils/storage';
import { nanoid } from 'nanoid/non-secure';

export type CategoryType = 'positions' | 'Custom';
export interface Category {
  id: string;
  label: string;
  type: CategoryType;
  positionTitle?: string;
  companyName?: string;
  startDate?: string;
  sections?: Array<{
    title: string;
    value: string;
    type: 'text' | 'date';
  }>;
}

const BUILDER_CATEGORIES_KEY = 'builder_categories';

interface BuilderStore {
  categories: Category[];
  addCategory: (type: CategoryType, label?: string, extra?: { positionTitle?: string; companyName?: string; startDate?: string; sections?: Array<{ title: string; value: string; type: 'text' | 'date'; }> }) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  loadCategories: () => void;
}

const defaultCategories: Category[] = [
  { id: nanoid(), type: 'positions', label: 'positions' },
  { id: nanoid(), type: 'Custom', label: 'Custom', sections: [] },
];

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  categories: defaultCategories,
  addCategory: (type, label, extra) => {
    const newCategory: Category = {
      id: nanoid(),
      type,
      label: type === 'positions' ? (extra?.positionTitle || 'positions') : (label || 'Custom'),
      ...(type === 'positions'
        ? {
            positionTitle: extra?.positionTitle || '',
            companyName: extra?.companyName || '',
            startDate: extra?.startDate || '',
          }
        : {
            sections: extra?.sections || [],
            label: label || 'Custom',
          }),
    };
    const categories = [...get().categories, newCategory];
    set({ categories });
    storage.set(BUILDER_CATEGORIES_KEY, JSON.stringify(categories));
  },
  removeCategory: (id) => {
    const categories = get().categories.filter((cat) => cat.id !== id);
    set({ categories });
    storage.set(BUILDER_CATEGORIES_KEY, JSON.stringify(categories));
  },
  updateCategory: (id, data) => {
    const categories = get().categories.map((cat) =>
      cat.id === id ? { ...cat, ...data } : cat
    );
    set({ categories });
    storage.set(BUILDER_CATEGORIES_KEY, JSON.stringify(categories));
  },
  loadCategories: () => {
    const data = storage.getString(BUILDER_CATEGORIES_KEY);
    const categories = data ? JSON.parse(data) : defaultCategories;
    set({ categories });
  },
}));
