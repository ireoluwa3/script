// store.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import { toast } from "sonner";

type KnowledgeBase = {
  id: string;
  faqCategoryId: string;
  question: string;
  answer: string;
};

type Category = {
  id: string;
  faqs: KnowledgeBase[];
};

type KnowledgeBaseStore = {
  faq: KnowledgeBase | null;
  faqs: KnowledgeBase[];
  category: Category | null;
  categories: Category[];
  fetchCategories: () => Promise<void>;
  setCategory: (id: string) => void;
};

export const useKnowledgeBaseStore = create<KnowledgeBaseStore>()(
  immer((set, get) => ({
    faq: null,
    faqs: [],
    category: null,
    categories: [],

    fetchCategories: async () => {
      const { data, error } = await $fetch({
        url: "/api/ext/faq",
        silent: true,
      });

      if (!error) {
        const categories = data.map((category) => ({
          ...category,
          faqs: category.faqs || [],
        }));

        set((state) => {
          state.categories = categories;
        });
      }
    },

    setCategory: async (id) => {
      if (!get().categories || get().categories.length === 0) {
        await get().fetchCategories();
      }

      if (get().categories && get().categories.length > 0 && id) {
        const selectedCategory = get().categories.find(
          (category) => category.id === id
        );
        set((state) => {
          state.category = selectedCategory || null;
          state.faqs = selectedCategory?.faqs || [];
        });
      } else {
        set((state) => {
          state.category = null;
          state.faqs = [];
        });
      }
    },
  }))
);
