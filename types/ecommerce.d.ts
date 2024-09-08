// Enums
enum EcommerceProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum EcommerceCategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum EcommerceReviewStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum EcommerceDiscountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// E-commerce Product
type EcommerceProduct = {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  categoryId: string;
  inventoryQuantity: number;
  filePath?: string;
  status: EcommerceProductStatus;
  image?: string;
  currency: string;
  walletType: WalletType;
  createdAt: Date;
  updatedAt: Date;
  // Relations:
  category: EcommerceCategory;
  reviews: EcommerceReview[];
  orderItems: EcommerceOrderItem[];
  discounts: EcommerceDiscount[];
  ecommerceWishlist: EcommerceWishlist[];
};

// E-commerce Category
type EcommerceCategory = {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: EcommerceCategoryStatus;
  // Relation:
  products: EcommerceProduct[];
};

// E-commerce Order
type EcommerceOrder = {
  id: string;
  userId: string;
  status: EcommerceOrderStatus;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  orderItems: EcommerceOrderItem[];
};

enum EcommerceOrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

// E-commerce Order Item
type EcommerceOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  key?: string;
  // Relations:
  order: EcommerceOrder;
  product: EcommerceProduct;
};

// E-commerce Review
type EcommerceReview = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  status: EcommerceReviewStatus;
  // Relations:
  product: EcommerceProduct;
  user: User; // Assuming User is defined elsewhere in your code.
};

// E-commerce Discount
type EcommerceDiscount = {
  id: string;
  code: string;
  percentage: number;
  validUntil: Date;
  productId: string;
  status: EcommerceDiscountStatus;
  // Relation:
  product: EcommerceProduct;
};

// E-commerce Wishlist
type EcommerceWishlist = {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  // Relations:
  user: User; // Assuming User is defined elsewhere in your code.
  product: EcommerceProduct;
};
