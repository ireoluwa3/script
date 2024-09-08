// store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import debounce from "lodash/debounce";

type Product = {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  categoryId: string;
  inventoryQuantity: number;
  status: boolean;
  image: string;
  currency: string;
  walletType: string;
  createdAt: string;
  rating: number;
  reviewsCount: number;
  ecommerceReviews: Review[];
  orders: Order[];
  categoryName: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: boolean;
  createdAt: string;
  products: Product[];
};

type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  status: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
};

type Order = {
  id: string;
  userId: string;
  status: string;
  shippingId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  ecommerceOrderItem: {
    quantity: number;
    filePath: string | null;
    key: string | null;
  };
};

type EcommerceStore = {
  product: Product | null;
  products: Product[];
  category: Category | null;
  categories: Category[];
  wishlist: Product[];
  fetchCategories: () => Promise<void>;
  setCategory: (categoryName: string) => void;
  fetchProduct: (name: string) => Promise<void>;
  reviewProduct: (
    productId: string,
    rating: number,
    comment: string
  ) => Promise<boolean>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => void;
};

export const useEcommerceStore = create<EcommerceStore>()(
  immer((set, get) => ({
    product: null,
    products: [],
    category: null,
    categories: [],
    wishlist: [],

    fetchCategories: async () => {
      const { data, error } = await $fetch({
        url: "/api/ext/ecommerce/category",
        silent: true,
      });

      if (!error) {
        const categories = data.map((category: any) => ({
          ...category,
          products: category.ecommerceProducts.map((product: any) => ({
            ...product,
            rating: product.ecommerceReviews?.length
              ? product.ecommerceReviews.reduce(
                  (acc: number, review: Review) => acc + review.rating,
                  0
                ) / product.ecommerceReviews.length
              : 0,
            reviewsCount: product.ecommerceReviews?.length ?? 0,
          })),
        }));

        set((state) => {
          state.categories = categories;
        });
      }
    },

    setCategory: async (categoryName: string) => {
      const { fetchCategories } = get();
      if (!get().categories || get().categories.length === 0) {
        await fetchCategories();
      }
      if (get().categories && get().categories.length > 0 && categoryName) {
        const selectedCategory = get().categories.find(
          (category) => category.name === categoryName
        );
        if (selectedCategory) {
          set((state) => {
            state.category = selectedCategory;
            state.products = selectedCategory.products;
          });
        }
      }
    },

    fetchProduct: async (name: string) => {
      const { data, error } = await $fetch({
        url: `/api/ext/ecommerce/product/${name.replace(/-/g, " ")}`,
        silent: true,
      });

      if (!error) {
        const product = {
          ...data,
          rating: data.ecommerceReviews?.length
            ? data.ecommerceReviews.reduce(
                (acc: number, review: Review) => acc + review.rating,
                0
              ) / data.ecommerceReviews.length
            : 0,
          reviewsCount: data.ecommerceReviews?.length ?? 0,
        };

        set((state) => {
          state.product = product;
        });
      }
    },

    reviewProduct: async (
      productId: string,
      rating: number,
      comment: string
    ) => {
      const { fetchProduct, product } = get();
      const { error } = await $fetch({
        url: `/api/ext/ecommerce/review/${productId}`,
        method: "POST",
        body: {
          rating,
          comment,
        },
      });

      if (!error) {
        if (product) {
          fetchProduct(product.name);
        }
        return true;
      }
      return false;
    },

    addToWishlist: async (product: Product) => {
      const { error } = await $fetch({
        url: `/api/ext/ecommerce/wishlist`,
        method: "POST",
        body: {
          productId: product.id,
        },
      });

      if (!error) {
        set((state) => {
          state.wishlist.push(product);
        });
      }
    },

    removeFromWishlist: async (productId: string) => {
      const { error } = await $fetch({
        url: `/api/ext/ecommerce/wishlist/${productId}`,
        method: "DELETE",
      });

      if (!error) {
        set((state) => {
          state.wishlist = state.wishlist.filter(
            (product) => product.id !== productId
          );
        });
      }
    },

    fetchWishlist: debounce(async () => {
      const { data, error } = await $fetch({
        url: "/api/ext/ecommerce/wishlist",
        silent: true,
      });

      if (!error) {
        const wishlistProducts = data.flatMap((wishlist: any) =>
          wishlist.products.map((product: any) => ({
            ...product,
            categoryName: wishlist.categoryName,
            rating: product.ecommerceReviews?.length
              ? product.ecommerceReviews.reduce(
                  (acc: number, review: Review) => acc + review.rating,
                  0
                ) / product.ecommerceReviews.length
              : 0,
            reviewsCount: product.ecommerceReviews?.length ?? 0,
          }))
        );
        set((state) => {
          state.wishlist = wishlistProducts;
        });
      }
    }, 100),
  }))
);
