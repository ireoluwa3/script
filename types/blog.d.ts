interface Author {
  id: string;
  userId: string;
  status: AuthorStatus;
  user: User;
  posts: Post[];
}

type AuthorStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  posts: Post[];
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  postId: string;
  post: Post;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface PostTag {
  id: string;
  postId: string;
  tagId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  author: Author;
  createdAt: Date | null;
  updatedAt: Date | null;
  comment: Comment[];
  postTag: PostTag[];
  status: PostStatus;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  description: string;
  status: PostStatus;
  image?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
  author: Author;
  category: Category;
  categoryId: string;
  tags?: Tag[];
}

interface BlogPostCreateInput {
  id?: string;
  title?: string;
  content?: string;
  slug?: string;
  description?: string;
  status?: PostStatus;
  image?: any;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  author?: Author;
  category?: Category;
  categoryId?: string;
  tags?: Tag[];
  oldPath?: string;
}

type PostStatus = "PUBLISHED" | "DRAFT";

interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  postTag: PostTag[];
}
