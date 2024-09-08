// Define a type for the FAQ Category
type FaqCategory = {
  id: string;
  identifier: string; // Unique identifier for the category
  faqs?: Faq[]; // Optional, only if you want to include FAQs in the category type
};

// Define a type for the FAQ itself
type Faq = {
  id: string;
  question: string;
  answer: string;
  faqCategoryId: string; // Foreign key to the FAQ category
  category?: FaqCategory; // Optional, only if you want to include category details in the FAQ type
};
