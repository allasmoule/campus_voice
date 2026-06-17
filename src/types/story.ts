export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categoryColor: string;
  imageUrl: string;
  readTime: number;
  createdAt: string;
  status: "PENDING" | "PUBLISHED" | "REJECTED";
}
