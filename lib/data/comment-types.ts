export type CommentAuthor = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type CommentImageRecord = {
  id: string;
  imageUrl: string;
  publicId: string | null;
};

export type ProjectImageRecord = {
  id: string;
  imageUrl: string;
  publicId: string | null;
};

export type CommentRecord = {
  id: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  user: CommentAuthor;
  images: CommentImageRecord[];
};

export type ProjectDetailRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  authorName: string;
  department: string;
  demoUrl: string | null;
  githubUrl: string | null;
  mainImageUrl: string | null;
  mainImagePublicId: string | null;
  galleryImages: ProjectImageRecord[];
  techStack: string | null;
  difficulty: string | null;
  category: {
    id: string;
    slug: string;
    nameUz: string;
    nameEn: string;
    nameRu: string;
    nameJa: string;
  };
  averageRating: number | null;
  commentCount: number;
  comments: CommentRecord[];
};
